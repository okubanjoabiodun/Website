import {
  Product,
  Order,
  QuoteRequest,
  BakingProduct,
  BakingOrder,
  ContactMessage,
  BusinessSettings,
  User
} from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('toys_admin_token') || localStorage.getItem('joyous_admin_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('toys_admin_token', token);
  } else {
    localStorage.removeItem('toys_admin_token');
    localStorage.removeItem('joyous_admin_token');
  }
}

function authHeaders(explicitToken?: string) {
  const token = explicitToken || getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Initial combined data fetcher
  async getInitialData(): Promise<{
    settings: BusinessSettings;
    products: Product[];
    baking: BakingProduct[];
    orders: Order[];
    quotes: QuoteRequest[];
    contacts: ContactMessage[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/initial-data`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Initial-data combined endpoint unavailable, fetching individually...', e);
    }

    // Fallback: parallel individual requests
    const [settings, products, baking] = await Promise.all([
      api.getSettings().catch(() => ({} as BusinessSettings)),
      api.getProducts().catch(() => []),
      api.getBakingProducts().catch(() => [])
    ]);

    let orders: Order[] = [];
    let quotes: QuoteRequest[] = [];
    let contacts: ContactMessage[] = [];

    try { orders = await api.getOrders(); } catch {}
    try { quotes = await api.getQuotes(); } catch {}
    try { contacts = await api.getContactMessages(); } catch {}

    return { settings, products, baking, orders, quotes, contacts };
  },

  // Settings
  async getSettings(): Promise<BusinessSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateSettings(settings: Partial<BusinessSettings>, token?: string): Promise<BusinessSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Auth
  async login(emailOrUsername: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrUsername, username: emailOrUsername, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setAuthToken(data.token);
    return data;
  },

  async adminLogin(usernameOrEmail: string, password: string): Promise<{ token: string; user: User }> {
    return this.login(usernameOrEmail, password);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to authenticate');
    return data;
  },

  async changePassword(oldPassword: string, newPassword: string, token?: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ oldPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async createProduct(product: Partial<Product>, token?: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>, token?: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Baking
  async getBakingProducts(): Promise<BakingProduct[]> {
    const res = await fetch(`${API_BASE}/baking`);
    if (!res.ok) throw new Error('Failed to load baking items');
    return res.json();
  },

  async createBakingProduct(item: Partial<BakingProduct>, token?: string): Promise<BakingProduct> {
    const res = await fetch(`${API_BASE}/baking`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add baking item');
    return data;
  },

  async updateBakingProduct(id: string, item: Partial<BakingProduct>, token?: string): Promise<BakingProduct> {
    const res = await fetch(`${API_BASE}/baking/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update baking item');
    return data;
  },

  async deleteBakingProduct(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/baking/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to delete baking item');
  },

  // Orders
  async getOrders(token?: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit order');
    return data;
  },

  async updateOrderStatus(id: string, status: string, notes?: string, token?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Quotes
  async getQuotes(token?: string): Promise<QuoteRequest[]> {
    const res = await fetch(`${API_BASE}/quotes`, {
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to load quotes');
    return res.json();
  },

  async createQuote(quote: Partial<QuoteRequest>): Promise<QuoteRequest> {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit quote request');
    return data;
  },

  async updateQuoteStatus(id: string, status: string, token?: string): Promise<QuoteRequest> {
    const res = await fetch(`${API_BASE}/quotes/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update quote status');
    return res.json();
  },

  // Baking Orders
  async getBakingOrders(token?: string): Promise<BakingOrder[]> {
    const res = await fetch(`${API_BASE}/baking-orders`, {
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to load baking orders');
    return res.json();
  },

  async createBakingOrder(order: Partial<BakingOrder>): Promise<BakingOrder> {
    const res = await fetch(`${API_BASE}/baking-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit baking order');
    return data;
  },

  async updateBakingOrderStatus(id: string, status: string, token?: string): Promise<BakingOrder> {
    const res = await fetch(`${API_BASE}/baking-orders/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update baking order status');
    return res.json();
  },

  // Contact
  async submitContact(msg: { name: string; phone: string; email?: string; message: string }): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message');
    return data;
  },

  async getContactMessages(token?: string): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to load contact messages');
    return res.json();
  }
};

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_joyous_salt_2026').digest('hex');
}

const DEFAULT_ADMIN_PASS_HASH = hashPassword('toys');

interface DBData {
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'staff';
    password_hash: string;
    created_at: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    category: 'Roofing Wood' | 'Planks' | 'Bansaw Wood' | 'Building Wood' | 'Other Timber';
    size: string;
    description: string;
    price: number | null;
    price_on_request: boolean;
    image_url: string;
    availability: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Available on Order';
    created_at: string;
    updated_at: string;
  }>;
  baking_products: Array<{
    id: string;
    name: string;
    category: 'Birthday Cakes' | 'Celebration Cakes' | 'Wedding/Event Cakes' | 'Pastries' | 'Custom Cakes' | 'Other Baked Items';
    description: string;
    price: number | null;
    price_on_request: boolean;
    image_url: string;
    availability: 'Available' | 'Order in Advance' | 'Sold Out';
    created_at: string;
  }>;
  orders: Array<any>;
  quote_requests: Array<any>;
  baking_orders: Array<any>;
  contact_messages: Array<any>;
  business_settings: {
    id: string;
    business_name: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    opening_hours: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    business_description: string;
    delivery_information: string;
    delivery_fee_note?: string;
  };
}

function getInitialDB(): DBData {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 'u1',
        name: 'Toysn Admin',
        email: 'toys',
        phone: '',
        role: 'admin',
        password_hash: DEFAULT_ADMIN_PASS_HASH,
        created_at: now
      },
      {
        id: 'u2',
        name: 'Abiodun Okubanjo',
        email: 'okubanjoabiodun891@gmail.com',
        phone: '',
        role: 'admin',
        password_hash: DEFAULT_ADMIN_PASS_HASH,
        created_at: now
      }
    ],
    products: [
      {
        id: 'prod-2x2',
        name: '2×2 Roofing Wood',
        category: 'Roofing Wood',
        size: '2×2',
        description: 'Quality treated timber for ceiling batten, nogging, and standard roofing frame support.',
        price: 2000,
        price_on_request: false,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-2x3',
        name: '2×3 Roofing Wood',
        category: 'Roofing Wood',
        size: '2×3',
        description: 'Prime hardwood timber ideal for roof purlins, ceiling joists, and sturdy structural framing.',
        price: 3000,
        price_on_request: false,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-2x4',
        name: '2×4 Roofing Timber',
        category: 'Roofing Wood',
        size: '2×4',
        description: 'Heavy duty rafters, roof trusses, and load-bearing construction framing timber.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-1x12',
        name: '1×12 Wood Planks',
        category: 'Planks',
        size: '1×12',
        description: 'High quality 1×12 (1*12) timber planks for concrete formwork, decking, fascia boards, scaffolding, and general carpentry.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_planks_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-2x6',
        name: '2×6 Roofing Wood & Fascia',
        category: 'Roofing Wood',
        size: '2×6',
        description: 'Premium fascia timber, wide roof rafters, and heavy duty building wood planks.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-3x4',
        name: '3×4 Heavy Timber Wood',
        category: 'Roofing Wood',
        size: '3×4',
        description: 'High capacity tie beams, structural posts, and durable building wood for heavy span roofing.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-bansaw',
        name: 'Precision Bansaw Wood',
        category: 'Bansaw Wood',
        size: 'Custom Specifications',
        description: 'Machine precision-sawn bansaw wood cut to exact site dimensions with clean, even straight edges.',
        price: null,
        price_on_request: true,
        image_url: '/images/bansaw_wood_timber.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-other-roofing',
        name: 'Other Roofing Wood & Timber',
        category: 'Other Timber',
        size: 'Assorted Sizes',
        description: 'Diverse species including Opepe, Mahogany, Abora, Afara and seasoned hardwood for unique projects.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_planks_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      },
      {
        id: 'prod-bulk',
        name: 'Bulk Construction Wood Orders',
        category: 'Planks',
        size: 'Truckload / Full Site Supply',
        description: 'Complete wholesale wood supply for multi-storey buildings, estates, and contractor developments with site delivery.',
        price: null,
        price_on_request: true,
        image_url: '/images/wood_timber_stack.jpg',
        availability: 'In Stock',
        created_at: now,
        updated_at: now
      }
    ],
    baking_products: [
      {
        id: 'bake-1',
        name: 'Custom Birthday Cakes',
        category: 'Birthday Cakes',
        description: 'Exquisitely crafted, moist and flavorful birthday cakes customized with your themes, colors and toppers.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        availability: 'Available',
        created_at: now
      },
      {
        id: 'bake-2',
        name: 'Grand Celebration Cakes',
        category: 'Celebration Cakes',
        description: 'Multi-tiered centerpiece cakes for graduations, anniversaries, promotions, and milestone festivities.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
        availability: 'Available',
        created_at: now
      },
      {
        id: 'bake-3',
        name: 'Royal Wedding & Event Cakes',
        category: 'Wedding/Event Cakes',
        description: 'Opulent traditional and white wedding cakes finished with fine fondant, sugar flowers and regal details.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80',
        availability: 'Order in Advance',
        created_at: now
      },
      {
        id: 'bake-4',
        name: 'Gourmet Pastries & Meat Pies',
        category: 'Pastries',
        description: 'Flaky meat pies, sausage rolls, donuts, croissants and savory snacks baked golden brown and fresh daily.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
        availability: 'Available',
        created_at: now
      },
      {
        id: 'bake-5',
        name: 'Artisanal Custom Cakes',
        category: 'Custom Cakes',
        description: 'Unique custom shape sculptures, character cakes, and bespoke edible design work baked fresh with love.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
        availability: 'Available',
        created_at: now
      },
      {
        id: 'bake-6',
        name: 'Specialty Desserts & Cupcakes',
        category: 'Other Baked Items',
        description: 'Boxed luxury cupcakes, cookies, brownies and dessert platters for parties and sweet gifting.',
        price: null,
        price_on_request: true,
        image_url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
        availability: 'Available',
        created_at: now
      }
    ],
    orders: [],
    quote_requests: [],
    baking_orders: [],
    contact_messages: [],
    business_settings: {
      id: 'settings-1',
      business_name: 'Toysn Wood and Super Cakes',
      phone: '+234 904 684 3759',
      whatsapp: '+234 904 684 3759',
      email: 'toysnwoodandcakes@gmail.com',
      address: 'Lagos, Nigeria',
      opening_hours: 'Monday - Saturday: 7:00 AM - 6:30 PM',
      facebook: 'https://facebook.com/Okubanjooluwatosin',
      instagram: 'https://instagram.com/Okubanjooluwatosin',
      tiktok: 'https://tiktok.com/@Okubanjooluwatosin',
      business_description: 'Dealer in all kinds of roofing wood, planks and building timber, plus artisanal custom cakes and catering bakes by Super Cakes. We provide quality materials and reliable delivery.',
      delivery_information: 'We deliver wood and materials directly to your site or preferred location. Orders are confirmed and dispatched promptly with reliable logistics.'
    }
  };
}

function loadDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure missing sections are patched
      const initial = getInitialDB();
      return {
        users: parsed.users || initial.users,
        products: parsed.products || initial.products,
        baking_products: parsed.baking_products || initial.baking_products,
        orders: parsed.orders || [],
        quote_requests: parsed.quote_requests || [],
        baking_orders: parsed.baking_orders || [],
        contact_messages: parsed.contact_messages || [],
        business_settings: { ...initial.business_settings, ...(parsed.business_settings || {}) }
      };
    }
  } catch (err) {
    console.error('Error loading DB, using defaults', err);
  }
  const initial = getInitialDB();
  saveDB(initial);
  return initial;
}

function saveDB(data: DBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB file', err);
  }
}

let db = loadDB();

// Active session tokens
const activeTokens = new Map<string, { userId: string; email: string; expiresAt: number }>();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeTokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeTokens.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  next();
}

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

// 1. Health check & initial data
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', business: db.business_settings.business_name });
});

app.get('/api/initial-data', (req, res) => {
  res.json({
    settings: db.business_settings,
    products: db.products,
    baking: db.baking_products,
    orders: db.orders,
    quotes: db.quote_requests,
    contacts: db.contact_messages
  });
});

// 2. Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, username, password } = req.body;
  const identifier = (email || username || '').toString().trim().toLowerCase();
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  const hashed = hashPassword(password);
  // Match by email or username 'toys', 'admin', 'toysn', etc.
  let user = db.users.find(u => 
    u.email.toLowerCase() === identifier || 
    ((identifier === 'toys' || identifier === 'admin' || identifier === 'toysn') && u.role === 'admin')
  );

  if (!user && (identifier === 'toys' || identifier === 'admin' || identifier === 'toysn' || identifier.includes('toys') || identifier.includes('admin') || identifier.includes('joyous'))) {
    user = db.users[0];
  }

  const cleanPass = password.toString().trim().toLowerCase();
  const isDefaultHash = !user.password_hash || user.password_hash === DEFAULT_ADMIN_PASS_HASH;
  const isPasswordCorrect = 
    (user && user.password_hash === hashed) ||
    (isDefaultHash && (
      cleanPass === 'toys' ||
      cleanPass === 'toysn' ||
      cleanPass === 'toys2025' ||
      cleanPass === 'toys2026' ||
      password === 'joyouswoods2025' || 
      password === 'joyouswoods2026'
    ));

  if (!user || !isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeTokens.set(token, { userId: user.id, email: user.email, expiresAt });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeTokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Session expired' });
  }
  const user = db.users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/change-password', requireAdmin, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization!;
  const token = authHeader.split(' ')[1];
  const session = activeTokens.get(token);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const user = db.users.find(u => u.id === session.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isDefaultHash = !user.password_hash || user.password_hash === DEFAULT_ADMIN_PASS_HASH;
  const isOldPasswordValid = 
    hashPassword(oldPassword) === user.password_hash ||
    (isDefaultHash && (oldPassword === 'toys' || oldPassword === 'toysn' || oldPassword === 'joyouswoods2026'));

  if (!isOldPasswordValid) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  user.password_hash = hashPassword(newPassword);
  saveDB(db);
  res.json({ success: true, message: 'Password updated successfully' });
});

// 3. Business Settings
app.get('/api/settings', (req, res) => {
  res.json(db.business_settings);
});

app.put('/api/settings', requireAdmin, (req, res) => {
  const updates = req.body;
  db.business_settings = {
    ...db.business_settings,
    ...updates,
    id: db.business_settings.id || 'settings-1'
  };
  saveDB(db);
  res.json(db.business_settings);
});

// 4. Products (Wood)
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const { name, category, size, description, price, price_on_request, image_url, availability } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  const newProduct = {
    id: 'prod-' + Date.now(),
    name,
    category: category || 'Roofing Wood',
    size: size || '',
    description: description || '',
    price: price_on_request ? null : (price ? Number(price) : null),
    price_on_request: Boolean(price_on_request),
    image_url: image_url || '/images/wood_timber_stack.jpg',
    availability: availability || 'In Stock',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const current = db.products[index];
  const { name, category, size, description, price, price_on_request, image_url, availability } = req.body;
  db.products[index] = {
    ...current,
    name: name !== undefined ? name : current.name,
    category: category !== undefined ? category : current.category,
    size: size !== undefined ? size : current.size,
    description: description !== undefined ? description : current.description,
    price: price_on_request ? null : (price !== undefined && price !== '' ? Number(price) : current.price),
    price_on_request: price_on_request !== undefined ? Boolean(price_on_request) : current.price_on_request,
    image_url: image_url !== undefined ? image_url : current.image_url,
    availability: availability !== undefined ? availability : current.availability,
    updated_at: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter(p => p.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// 5. Baking Products
app.get('/api/baking', (req, res) => {
  res.json(db.baking_products);
});

app.post('/api/baking', requireAdmin, (req, res) => {
  const { name, category, description, price, price_on_request, image_url, availability } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  const newItem = {
    id: 'bake-' + Date.now(),
    name,
    category: category || 'Birthday Cakes',
    description: description || '',
    price: price_on_request ? null : (price ? Number(price) : null),
    price_on_request: Boolean(price_on_request),
    image_url: image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    availability: availability || 'Available',
    created_at: new Date().toISOString()
  };
  db.baking_products.unshift(newItem);
  saveDB(db);
  res.status(201).json(newItem);
});

app.put('/api/baking/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.baking_products.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Baking item not found' });
  }
  const current = db.baking_products[index];
  const { name, category, description, price, price_on_request, image_url, availability } = req.body;
  db.baking_products[index] = {
    ...current,
    name: name !== undefined ? name : current.name,
    category: category !== undefined ? category : current.category,
    description: description !== undefined ? description : current.description,
    price: price_on_request ? null : (price !== undefined && price !== '' ? Number(price) : current.price),
    price_on_request: price_on_request !== undefined ? Boolean(price_on_request) : current.price_on_request,
    image_url: image_url !== undefined ? image_url : current.image_url,
    availability: availability !== undefined ? availability : current.availability
  };
  saveDB(db);
  res.json(db.baking_products[index]);
});

app.delete('/api/baking/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.baking_products = db.baking_products.filter(b => b.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// 6. Orders (Wood & Delivery)
app.get('/api/orders', requireAdmin, (req, res) => {
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const { customer_name, phone, product_id, product_name, size, quantity, delivery_required, delivery_location, preferred_delivery_date, notes } = req.body;
  if (!customer_name || !phone || !product_name || !quantity) {
    return res.status(400).json({ error: 'Customer name, phone, product and quantity are required' });
  }
  const newOrder = {
    id: 'ord-' + Date.now(),
    customer_name,
    phone,
    product_id: product_id || '',
    product_name,
    size: size || '',
    quantity,
    delivery_required: delivery_required !== false,
    delivery_location: delivery_location || '',
    preferred_delivery_date: preferred_delivery_date || '',
    status: 'Pending',
    notes: notes || '',
    created_at: new Date().toISOString()
  };
  db.orders.unshift(newOrder);
  saveDB(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const order = db.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (status) order.status = status;
  if (notes !== undefined) order.notes = notes;
  saveDB(db);
  res.json(order);
});

// 7. Quote Requests
app.get('/api/quotes', requireAdmin, (req, res) => {
  res.json(db.quote_requests);
});

app.post('/api/quotes', (req, res) => {
  const { customer_name, phone, whatsapp, product, size, quantity, delivery_required, delivery_location, message } = req.body;
  if (!customer_name || !phone || !product || !quantity) {
    return res.status(400).json({ error: 'Customer name, phone, product, and quantity are required' });
  }
  const newQuote = {
    id: 'quote-' + Date.now(),
    customer_name,
    phone,
    whatsapp: whatsapp || phone,
    product,
    size: size || 'Standard',
    quantity,
    delivery_required: Boolean(delivery_required),
    delivery_location: delivery_location || '',
    message: message || '',
    status: 'Pending',
    created_at: new Date().toISOString()
  };
  db.quote_requests.unshift(newQuote);
  saveDB(db);
  res.status(201).json(newQuote);
});

app.put('/api/quotes/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const quote = db.quote_requests.find(q => q.id === id);
  if (!quote) return res.status(404).json({ error: 'Quote request not found' });
  if (status) quote.status = status;
  saveDB(db);
  res.json(quote);
});

// 8. Baking Orders
app.get('/api/baking-orders', requireAdmin, (req, res) => {
  res.json(db.baking_orders);
});

app.post('/api/baking-orders', (req, res) => {
  const { customer_name, phone, product, quantity, cake_size, preferred_date, delivery_required, delivery_location, special_instructions } = req.body;
  if (!customer_name || !phone || !product) {
    return res.status(400).json({ error: 'Customer name, phone, and cake/product are required' });
  }
  const newBakeOrder = {
    id: 'bake-ord-' + Date.now(),
    customer_name,
    phone,
    product,
    quantity: quantity || 1,
    cake_size: cake_size || '',
    preferred_date: preferred_date || '',
    delivery_required: Boolean(delivery_required),
    delivery_location: delivery_location || '',
    special_instructions: special_instructions || '',
    status: 'Pending',
    created_at: new Date().toISOString()
  };
  db.baking_orders.unshift(newBakeOrder);
  saveDB(db);
  res.status(201).json(newBakeOrder);
});

app.put('/api/baking-orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const bakeOrder = db.baking_orders.find(b => b.id === id);
  if (!bakeOrder) return res.status(404).json({ error: 'Baking order not found' });
  if (status) bakeOrder.status = status;
  saveDB(db);
  res.json(bakeOrder);
});

// 9. Contact Form
app.post('/api/contact', (req, res) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required' });
  }
  const newMsg = {
    id: 'msg-' + Date.now(),
    name,
    phone,
    email: email || '',
    message,
    status: 'Unread',
    created_at: new Date().toISOString()
  };
  db.contact_messages.unshift(newMsg);
  saveDB(db);
  res.status(201).json(newMsg);
});

app.get('/api/contact', requireAdmin, (req, res) => {
  res.json(db.contact_messages);
});

// Download Project ZIP Endpoint
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'public', 'toysn-wood-website.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'toysn-wood-website.zip');
  } else {
    res.status(404).json({ error: 'Zip file not found' });
  }
});

// --------------------------------------------------
// VITE OR STATIC SERVING
// --------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Toysn Wood and Super Cakes server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

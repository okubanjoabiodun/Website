export interface Product {
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
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Out for Delivery' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  product_id?: string;
  product_name: string;
  size?: string;
  quantity: string | number;
  delivery_required: boolean;
  delivery_location: string;
  preferred_delivery_date?: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
}

export type QuoteStatus = 'Pending' | 'Contacted' | 'Completed' | 'Cancelled';

export interface QuoteRequest {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp?: string;
  product: string;
  size: string;
  quantity: string | number;
  delivery_required?: boolean;
  delivery_location: string;
  message?: string;
  status: QuoteStatus;
  created_at: string;
}

export interface BakingProduct {
  id: string;
  name: string;
  category: 'Birthday Cakes' | 'Celebration Cakes' | 'Wedding/Event Cakes' | 'Pastries' | 'Custom Cakes' | 'Other Baked Items';
  description: string;
  price: number | null;
  price_on_request: boolean;
  image_url: string;
  availability: 'Available' | 'Order in Advance' | 'Sold Out';
  created_at: string;
}

export interface BakingOrder {
  id: string;
  customer_name: string;
  phone: string;
  product: string;
  quantity: string | number;
  cake_size?: string;
  preferred_date: string;
  delivery_required: boolean;
  delivery_location: string;
  special_instructions?: string;
  status: OrderStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'Unread' | 'Read' | 'Responded';
  created_at: string;
}

export interface BusinessSettings {
  id?: string;
  business_name: string;
  business_description?: string;
  description?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  opening_hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  delivery_information?: string;
  delivery_fee_note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff';
  created_at: string;
}

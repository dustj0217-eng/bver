// app/my/types/index.ts

export interface ShippingAddress {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  bgColor?: string;
  description?: string;
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'completed' | 'canceled';
  totalPrice: number;
  items: CartItem[];
  createdAt: any;
  paymentInfo?: {
    paymentMethod: string;
    transferInfo?: any;
    status: string;
  };
  shippingAddress?: ShippingAddress;
}

export interface UserData {
  name: string;
  email: string;
  createdAt: Date;
  shippingAddress?: ShippingAddress;
}

export interface Coupon {
  id: string;
  code: string;
  eventId: string;
  eventTitle: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  issuedAt: any;
  expiresAt: any;
  usedAt: any | null;
  isUsed: boolean;
}
import { Customer } from "@/types/customer";

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  DELIVERED = 'delivered',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  COD = 'COD',
  SSL = 'SSL',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}

export interface OrderProduct {
  productId: number;
  productCode?: string;
  sizeId?: number;
  colorId?: number;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderDate: string;
  addressLine: string;
  name: string;
  email: string;
  phoneNumber: string;
  payment: 'paid' | 'unpaid';
  insideDhaka?: boolean;
  transactionId?: string;
  status: OrderStatus;
  paymentType: PaymentType;
  totalAmount: number;
  customerId: number;
  products: OrderProduct[];
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
    data: Order[];
    total: number;
    page: number;
    limit: number;
}

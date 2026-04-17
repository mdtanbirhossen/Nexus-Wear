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
  productId: string;
  productCode?: string;
  sizeId?: string;
  colorId?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
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
  customerId: string;
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

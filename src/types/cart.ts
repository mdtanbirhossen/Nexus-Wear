export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  colorId?: number;
  sizeId?: number;
  quantity: number;
  price: number;
  product?: any; // You can type this better later if needed
}

export interface Cart {
  id: number;
  customerId?: number | null;
  sessionId?: string | null;
  totalQuantity: number;
  totalAmount: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

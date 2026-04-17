export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  colorId?: string;
  sizeId?: string;
  quantity: number;
  price: number;
  product?: any;
}

export interface Cart {
  id: string;
  customerId?: string | null;
  sessionId?: string | null;
  totalQuantity: number;
  totalAmount: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

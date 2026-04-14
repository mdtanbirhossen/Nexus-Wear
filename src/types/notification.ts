export interface Notification {
  id: number;
  title: string;
  message: string;
  customerId?: number;
  orderId?: number;
  paymentId?: number;
  offer?: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
    data: Notification[];
}

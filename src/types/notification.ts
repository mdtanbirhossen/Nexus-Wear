export interface Notification {
  id: string;
  title: string;
  message: string;
  customerId?: string;
  orderId?: string;
  paymentId?: string;
  offer?: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
    data: Notification[];
}

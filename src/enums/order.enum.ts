export enum EOrderStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  COMFIRMED = 'comfirmed',
}

export enum EOrderPaymentType {
  CASH = 'cash',
  VNPAY = 'vnpay',
  ZALOPAY = 'zalopay',
}

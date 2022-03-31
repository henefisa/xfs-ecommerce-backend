export enum EOrderStatus {
  RECEIVED = 'received',
  WAIT_FOR_PAYMENT = 'wait for payment',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  COMFIRMED = 'comfirmed',
}

export enum EOrderPaymentType {
  CASH = 'cash',
  CARD = 'card',
}

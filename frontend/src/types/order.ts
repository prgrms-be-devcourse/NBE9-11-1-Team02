export type OrderProductRequest = {
    productId: number;
    orderQuantity: number;
  };
  
  export type OrderRequest = {
    email: string;
    username: string;
    address: string;
    phoneNumber: string;
    orderProductRequestList: OrderProductRequest[];
  };
  
  export type OrderProductResponse = {
    productId: number;
    productName: string;
    orderQuantity: number;
    price: number;
  };
  
  export type OrderResponse = {
    orderId: number;
    email: string;
    username: string;
    address: string;
    phoneNumber: string;
    orderStatus: string;
    totalPrice: number;
    deliveryDate: string;
    orderProducts: OrderProductResponse[];
  };
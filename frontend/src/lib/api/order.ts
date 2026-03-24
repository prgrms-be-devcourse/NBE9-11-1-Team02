import { apiClient } from "./client";
import type { OrderRequest, OrderResponse } from "@/types/order";

export async function createOrder(payload: OrderRequest) {
  return apiClient.post<OrderResponse>("/api/orders", payload);
}

export async function cancelOrder(orderId: number) {
  return apiClient.patch<null>(`/api/orders/${orderId}/cancel`);
}

export async function getOrders(email: string) {
    return apiClient.get<any[]>(`/api/orders?email=${encodeURIComponent(email)}`);
  }

export async function getOrderDetail(orderId: number) {
  return apiClient.get<any>(`/api/orders/${orderId}`);
}

export async function getAllOrders() {
    return apiClient.get<any[]>("/api/orders/all");
  }

export async function getMergedOrders() {
  return apiClient.get<any[]>("/api/orders/merged");
}

export async function updateOrderStatus(orderId: number, orderStatus: string) {
    return apiClient.patch<null>(`/api/orders/${orderId}/status`, {
      orderStatus,
    });
  }

export async function updateMergedOrderStatus(
    email: string,
    username: string,
    address: string,
    orderStatus: string
  ) {
    return apiClient.patch("/api/orders/merged/status", {
      email,
      username,
      address,
      orderStatus,
    });
  }
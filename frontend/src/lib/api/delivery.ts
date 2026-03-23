import { apiClient } from "./client";
import type { DeliveryCreateRequest } from "@/types/delivery";

export async function createDelivery(payload: DeliveryCreateRequest) {
  return apiClient.post<number>("/api/delivery", payload);
}
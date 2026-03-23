import { apiClient } from "./client";
import type { Product } from "@/types/product";

export async function getProducts() {
  return apiClient.get<Product[]>("/api/products");
}
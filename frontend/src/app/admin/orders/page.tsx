"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllOrders,
  getMergedOrders,
  updateMergedOrderStatus,
} from "@/lib/api/order";

type OrderItem = {
  orderId: number;
  email: string;
  username: string;
  address: string;
  phoneNumber: string;
  orderStatus: string;
  totalPrice: number;
  deliveryDate?: string;
  createdAt?: string;
};

type MergedProduct = {
  name: string;
  quantity: number;
  totalPrice: number;
};

type MergedOrderItem = {
  orderId: number;
  email: string;
  username: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  deliveryDate?: string;
  orderStatus: string;
  products: MergedProduct[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [mergedOrders, setMergedOrders] = useState<MergedOrderItem[]>([]);
  const [viewMode, setViewMode] = useState<"all" | "merged">("all");

  useEffect(() => {
    getAllOrders().then((res) => setOrders(res.data));
    getMergedOrders().then((res) => setMergedOrders(res.data));
  }, []);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => a.orderId - b.orderId);
  }, [orders]);

  const sortedMergedOrders = useMemo(() => {
    return [...mergedOrders].sort((a, b) => a.orderId - b.orderId);
  }, [mergedOrders]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { backgroundColor: "#e5ffe5", color: "green" };
      case "CANCELLED":
        return { backgroundColor: "#ffe5e5", color: "red" };
      default:
        return { backgroundColor: "#fff", color: "#000" };
    }
  };

  const handleMergedStatusChange = async (
    email: string,
    username: string,
    address: string,
    newStatus: string
  ) => {
    const ok = window.confirm(`합배송 상태를 ${newStatus}(으)로 변경하시겠습니까?`);
    if (!ok) return;

    try {
      await updateMergedOrderStatus(email, username, address, newStatus);

      setMergedOrders((prev) =>
        prev.map((order) =>
          order.email === email &&
          order.username === username &&
          order.address === address
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.email === email &&
          order.username === username &&
          order.address === address
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      alert("합배송 상태가 변경되었습니다.");
    } catch (e) {
      console.error(e);
      alert("상태 변경 실패");
    }
  };

  return (
    <main style={{ background: "#000", color: "#fff", padding: "30px", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "50px", marginBottom: "30px" }}>
        관리자 주문 관리
      </h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setViewMode("all")}
          style={{
            padding: "10px 16px",
            background: viewMode === "all" ? "#fff" : "#000",
            color: viewMode === "all" ? "#000" : "#fff",
            border: "1px solid #fff",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          전체 주문
        </button>

        <button
          onClick={() => setViewMode("merged")}
          style={{
            padding: "10px 16px",
            background: viewMode === "merged" ? "#fff" : "#000",
            color: viewMode === "merged" ? "#000" : "#fff",
            border: "1px solid #fff",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          합배송 주문
        </button>
      </div>

      {viewMode === "all" && (
        <div>
          {sortedOrders.length === 0 && <p>주문 내역이 없습니다.</p>}

          {sortedOrders.map((order) => (
            <div
              key={order.orderId}
              style={{
                background: "#fff",
                color: "#000",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "12px",
              }}
            >
              <p><b>ID:</b> {order.orderId}</p>
              <p><b>이메일:</b> {order.email}</p>
              <p><b>이름:</b> {order.username}</p>
              <p><b>주소:</b> {order.address}</p>
              <p><b>전화번호:</b> {order.phoneNumber}</p>

              <p>
                <b>상태:</b>{" "}
                <span
                  style={{
                    ...getStatusStyle(order.orderStatus),
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    border: "1px solid #ccc",
                  }}
                >
                  {order.orderStatus}
                </span>
              </p>

              <p><b>금액:</b> {order.totalPrice}원</p>
              <p><b>배송일:</b> {order.deliveryDate ?? "-"}</p>
            </div>
          ))}
        </div>
      )}

      {viewMode === "merged" && (
        <div>
          {sortedMergedOrders.length === 0 && <p>합배송 주문 내역이 없습니다.</p>}

          {sortedMergedOrders.map((order, idx) => (
            <div
              key={order.orderId ?? `${order.email}-${order.address}-${idx}`}
              style={{
                background: "#fff",
                color: "#000",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "12px",
              }}
            >
              <p><b>ID:</b> {order.orderId ?? "-"}</p>
              <p><b>이메일:</b> {order.email}</p>
              <p><b>이름:</b> {order.username}</p>
              <p><b>주소:</b> {order.address}</p>
              <p><b>전화번호:</b> {order.phoneNumber}</p>

              <div style={{ marginBottom: "10px" }}>
                <b>상태:</b>
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleMergedStatusChange(
                      order.email,
                      order.username,
                      order.address,
                      e.target.value
                    )
                  }
                  style={{
                    marginLeft: "10px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid black",
                    fontWeight: "bold",
                    cursor: "pointer",
                    ...getStatusStyle(order.orderStatus),
                  }}
                >
                  <option value="READY">READY</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <p><b>총 금액:</b> {order.totalPrice}원</p>
              <p><b>배송일:</b> {order.deliveryDate ?? "-"}</p>
              <p>
                <b>상품:</b>{" "}
                {order.products.length > 0
                  ? order.products.map((p) => `${p.name} x ${p.quantity}`).join(", ")
                  : "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
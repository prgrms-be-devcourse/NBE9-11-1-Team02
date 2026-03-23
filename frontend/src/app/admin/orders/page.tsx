"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/api/order";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders("test@test.com")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("주문 조회 에러:", err);
        setError("주문 목록을 불러오지 못했습니다.");
      });
  }, []);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => a.orderId - b.orderId);
  }, [orders]);

  const handleStatusChange = async (
    orderId: number,
    currentStatus: string,
    newStatus: string
  ) => {
    if (currentStatus === newStatus) return;

    if (currentStatus === "CANCELLED" && newStatus !== "CANCELLED") {
      alert("취소된 주문은 다른 상태로 변경할 수 없습니다.");
      return;
    }

    const ok = window.confirm(`주문 상태를 ${newStatus}(으)로 변경하시겠습니까?`);
    if (!ok) return;

    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      alert("주문 상태가 변경되었습니다.");
    } catch (err) {
      console.error("상태 변경 에러:", err);
      alert("주문 상태 변경에 실패했습니다.");
    }
  };

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        관리자 주문 관리
      </h1>

      {error && (
        <p style={{ color: "red", marginBottom: "16px" }}>
          {error}
        </p>
      )}

      {sortedOrders.length === 0 && !error && (
        <p>주문 내역이 없습니다.</p>
      )}

      {sortedOrders.map((order) => (
        <div
          key={order.orderId}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <p><strong>주문 ID:</strong> {order.orderId}</p>
          <p><strong>이메일:</strong> {order.email}</p>
          <p><strong>이름:</strong> {order.username}</p>
          <p><strong>주소:</strong> {order.address}</p>
          <p><strong>전화번호:</strong> {order.phoneNumber}</p>

          <div style={{ marginBottom: "8px" }}>
            <strong>상태:</strong>
            <select
    value={order.orderStatus}
    onChange={(e) =>
    handleStatusChange(
      order.orderId,
      order.orderStatus,
      e.target.value
    )
  }
  style={{
    marginLeft: "8px",
    padding: "6px 10px",
    border: "1px solid black",
    borderRadius: "6px",
    backgroundColor:
      order.orderStatus === "CANCELLED"
        ? "#ffe5e5"
        : order.orderStatus === "COMPLETED"
        ? "#e5ffe5"
        : "#fff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
              <option value="READY">READY</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <p><strong>총 금액:</strong> {order.totalPrice}원</p>
          <p><strong>배송일:</strong> {order.deliveryDate ?? "-"}</p>
          <p><strong>주문일시:</strong> {order.createdAt ?? "-"}</p>
        </div>
      ))}
    </main>
  );
}
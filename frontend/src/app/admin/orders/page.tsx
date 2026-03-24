"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAllOrders,
  getMergedOrders,
  updateMergedOrderStatus,
} from "@/lib/api/order";

const ADMIN_EMAIL = "admin@cafe.com";

type OrderItem = {
  orderId: number;
  orderNumber?: string;
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
  orderNumber?: string;
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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");

    if (adminEmail !== ADMIN_EMAIL) {
      alert("관리자만 접근 가능합니다.");
      window.location.href = "/admin/login";
      return;
    }

    setIsAuthorized(true);

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
        return { backgroundColor: "rgba(45,110,45,0.1)", color: "#2d6e2d" };
      case "CANCELLED":
        return { backgroundColor: "rgba(185,28,28,0.1)", color: "#b91c1c" };
      default:
        return { backgroundColor: "var(--amber-pale)", color: "var(--amber)" };
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
      const adminEmail = localStorage.getItem("adminEmail") ?? "";

      await updateMergedOrderStatus(email, username, address, newStatus, adminEmail);

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

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin/login";
  };

  if (!isAuthorized) return null;

  return (
    <main style={{ background: "var(--cream)", color: "var(--ink)", padding: "2.5rem", minHeight: "100vh" }}>
      {/* 헤더 */}
      <div style={{ background: "var(--ink)", padding: "2.5rem 2.5rem 1.5rem", marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2.2rem",
            fontWeight: "900",
            color: "var(--cream)",
            marginBottom: "1.5rem",
          }}
        >
          관리자 주문 관리
        </h1>

        <div className="flex gap-3">
          <Link href="/admin/products">
            <button className="border px-4 py-2">상품 관리</button>
          </Link>

          <button onClick={handleLogout} className="border px-4 py-2">
            로그아웃
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
          <button onClick={() => setViewMode("all")}>전체 주문</button>
          <button onClick={() => setViewMode("merged")}>합배송 주문</button>
        </div>
      </div>

      {/* 내용 */}
      <div>
        {viewMode === "all" &&
          sortedOrders.map((order) => (
            <div key={order.orderId}>
              #{order.orderNumber ?? order.orderId} / {order.totalPrice}원
            </div>
          ))}

        {viewMode === "merged" &&
          sortedMergedOrders.map((order) => (
            <div key={order.orderId}>
              #{order.orderNumber ?? order.orderId} / {order.totalPrice}원
            </div>
          ))}
      </div>
    </main>
  );
}
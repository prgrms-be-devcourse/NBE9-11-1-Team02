"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getAllOrders,
    getMergedOrders,
    updateMergedOrderStatus,
} from "@/lib/api/order";

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
        <main style={{ background: "var(--cream)", color: "var(--ink)", padding: "2.5rem", minHeight: "100vh" }}>
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

                <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
                    <button
                        onClick={() => setViewMode("all")}
                        style={{
                            padding: "10px 20px",
                            background: viewMode === "all" ? "var(--cream)" : "transparent",
                            color: viewMode === "all" ? "var(--ink)" : "var(--cream)",
                            border: "1px solid var(--cream)",
                            borderRadius: "8px",
                            fontFamily: "var(--font-dm-mono), monospace",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            cursor: "pointer",
                        }}
                    >
                        전체 주문
                    </button>

                    <button
                        onClick={() => setViewMode("merged")}
                        style={{
                            padding: "10px 20px",
                            background: viewMode === "merged" ? "var(--cream)" : "transparent",
                            color: viewMode === "merged" ? "var(--ink)" : "var(--cream)",
                            border: "1px solid var(--cream)",
                            borderRadius: "8px",
                            fontFamily: "var(--font-dm-mono), monospace",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            cursor: "pointer",
                        }}
                    >
                        합배송 주문
                    </button>
                </div>
            </div>

            <div style={{ padding: "0 2.5rem 2.5rem" }}>
                {viewMode === "all" && (
                    <div>
                        {sortedOrders.length === 0 && (
                            <p style={{ color: "var(--muted)", fontSize: "13px" }}>주문 내역이 없습니다.</p>
                        )}

                        {sortedOrders.map((order) => (
                            <div
                                key={order.orderId}
                                style={{
                                    background: "var(--parchment)",
                                    border: "1px solid var(--border)",
                                    padding: "1.5rem",
                                    marginBottom: "1rem",
                                    borderRadius: "8px",
                                }}
                            >
                                <div style={{ marginBottom: "1rem" }}>
                  <span
                      style={{
                          fontFamily: "var(--font-playfair), serif",
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "var(--amber)",
                      }}
                  >
                    #{order.orderNumber ?? order.orderId}
                  </span>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "6px 2rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    {[
                                        ["이메일", order.email],
                                        ["이름", order.username],
                                        ["주소", order.address],
                                        ["전화번호", order.phoneNumber],
                                        ["배송일", order.deliveryDate ?? "-"],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                                            <span style={{ color: "var(--muted)", minWidth: "56px" }}>{label}</span>
                                            <span style={{ color: "var(--ink)" }}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderTop: "1px solid var(--border)",
                                        paddingTop: "1rem",
                                    }}
                                >
                  <span
                      style={{
                          ...getStatusStyle(order.orderStatus),
                          padding: "4px 12px",
                          fontSize: "11px",
                          fontFamily: "var(--font-dm-mono), monospace",
                          letterSpacing: "0.06em",
                          border: "1px solid currentColor",
                      }}
                  >
                    {order.orderStatus}
                  </span>

                                    <span
                                        style={{
                                            fontFamily: "var(--font-playfair), serif",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            color: "var(--ink)",
                                        }}
                                    >
                    {order.totalPrice.toLocaleString()}원
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === "merged" && (
                    <div>
                        {sortedMergedOrders.length === 0 && (
                            <p style={{ color: "var(--muted)", fontSize: "13px" }}>합배송 주문 내역이 없습니다.</p>
                        )}

                        {sortedMergedOrders.map((order, idx) => (
                            <div
                                key={order.orderId ?? `${order.email}-${order.address}-${idx}`}
                                style={{
                                    background: "var(--parchment)",
                                    border: "1px solid var(--border)",
                                    padding: "1.5rem",
                                    marginBottom: "1rem",
                                    borderRadius: "8px",
                                }}
                            >
                                <div style={{ marginBottom: "1rem" }}>
                  <span
                      style={{
                          fontFamily: "var(--font-playfair), serif",
                          fontSize: "16px",
                          fontWeight: "700",
                          color: "var(--amber)",
                      }}
                  >
                    #{order.orderNumber ?? order.orderId ?? "-"}
                  </span>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "6px 2rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    {[
                                        ["이메일", order.email],
                                        ["이름", order.username],
                                        ["주소", order.address],
                                        ["전화번호", order.phoneNumber],
                                        ["배송일", order.deliveryDate ?? "-"],
                                    ].map(([label, value]) => (
                                        <div key={label} style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                                            <span style={{ color: "var(--muted)", minWidth: "56px" }}>{label}</span>
                                            <span style={{ color: "var(--ink)" }}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        background: "var(--cream)",
                                        border: "1px solid var(--border)",
                                        padding: "10px 14px",
                                        marginBottom: "1rem",
                                        fontSize: "12px",
                                        color: "var(--ink)",
                                        fontFamily: "var(--font-dm-mono), monospace",
                                    }}
                                >
                                    {order.products.length > 0
                                        ? order.products.map((p) => `${p.name} × ${p.quantity}`).join("  ·  ")
                                        : "-"}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderTop: "1px solid var(--border)",
                                        paddingTop: "1rem",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>상태:</span>

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
                                                padding: "6px 12px",
                                                border: "1px solid var(--border2)",
                                                fontFamily: "var(--font-dm-mono), monospace",
                                                fontSize: "11px",
                                                letterSpacing: "0.06em",
                                                cursor: "pointer",
                                                background: "var(--cream)",
                                                color: "var(--ink)",
                                            }}
                                        >
                                            <option value="READY">READY</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </div>

                                    <span
                                        style={{
                                            fontFamily: "var(--font-playfair), serif",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            color: "var(--ink)",
                                        }}
                                    >
                    {order.totalPrice.toLocaleString()}원
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
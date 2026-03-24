"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";
import { createOrder } from "../../lib/api/order"; 

export default function OrderPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ text: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProcessOrder = async () => {
    setStatus(null);
    if (cartItems.length === 0) {
      setStatus({ text: "장바구니가 비어 있습니다.", type: "error" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setStatus({ text: "이메일을 정확히 입력하세요.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        email,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        totalAmount
      } as any);

      setStatus({ text: "주문이 완료되었습니다!", type: "success" });
      clearCart();
      setTimeout(() => router.push("/"), 2000);
    } catch (e) {
      // 에러 발생 시 콘솔을 확인
      console.error("주문 생성 에러:", e);
      setStatus({ text: "주문 처리 중 오류가 발생했습니다.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusMessage = status ? (
    <div style={{ textAlign: "center", marginBottom: "15px" }}>{status.text}</div>
  ) : null;

  if (!isMounted) return null;

  return (
    <main style={{ maxWidth: "650px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>☕ 주문서 작성</h1>

      {statusMessage}

      <section style={{ textAlign: "left", marginBottom: "20px" }}>
        <h3>🛒 [주문 상품 정보]</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item: CartItem) => (
            <li key={item.productId} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span>- {item.productName} ({item.quantity}개)</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "left", fontWeight: "bold" }}>💰 총 결제 금액: {totalAmount.toLocaleString()}원</div>
      </section>

      <section style={{ textAlign: "left", marginBottom: "20px" }}>
        <h3>🙋‍♂️ [주문자 정보 입력]</h3>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>이메일 주소: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{ flexGrow: 1, padding: "5px" }}
            disabled={isSubmitting}
          />
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          <p>* 이메일 주소로 주문이 관리됩니다.</p>
          <p>* 동일 이메일은 묶음 배송됩니다.</p>
        </div>
      </section>

      <section style={{ textAlign: "left", marginBottom: "30px" }}>
        <h3>🚚 [배송 안내]</h3>
        <div>⚠️ 당일 오후 2시 이후 주문은 내일 배송됩니다.</div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={() => router.push("/")} disabled={isSubmitting} style={{ padding: "10px 20px" }}>❌ 취소</button>
        <button onClick={handleProcessOrder} disabled={isSubmitting} style={{ padding: "10px 20px" }}>
          {isSubmitting ? "처리 중..." : "💳 주문하기"}
        </button>
      </div>
    </main>
  );
}
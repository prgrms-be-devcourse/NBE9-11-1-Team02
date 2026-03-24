"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";
import { createOrder } from "../../api/order/order";

export default function OrderPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 스토어 데이터 개별 선택
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ text: string; type: "error" | "success" } | null>(null);

  // 하이드레이션 체크
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 총액 계산
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 주문 처리 로직
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
      // API 전송
      await createOrder({
        email,
        items: cartItems,
        totalAmount
      } as any);

      setStatus({ text: "주문이 완료되었습니다!", type: "success" });
      clearCart();
      setTimeout(() => router.push("/"), 2000);
    } catch (e) {
      setStatus({ text: "오류가 발생했습니다.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 메시지 처리
  const statusMessage = status ? (
    <div style={{ textAlign: "center" }}>{status.text}</div>
  ) : null;

  if (!isMounted) return null;

  return (
    <main style={{ maxWidth: "650px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>☕ 주문서 작성</h1>

      {statusMessage}

      <section style={{ textAlign: "left" }}>
        <h3>🛒 [주문 상품 정보]</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item: CartItem) => (
            <li key={item.productId} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>- {item.productName} ({item.quantity}개)</span>
              <span>{(item.price * item.quantity).toLocaleString()}원</span>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "left" }}>💰 총 결제 금액: {totalAmount.toLocaleString()}원</div>
      </section>

      <section style={{ textAlign: "left" }}>
        <h3>🙋‍♂️ [주문자 정보 입력]</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>이메일 주소: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{ flexGrow: 1 }}
            disabled={isSubmitting}
          />
        </div>
        <div style={{ textAlign: "left" }}>
          <p>* 이메일 주소로 주문이 관리됩니다.</p>
          <p>* 동일 이메일은 묶음 배송됩니다.</p>
        </div>
      </section>

      <section style={{ textAlign: "left" }}>
        <h3>🚚 [배송 안내]</h3>
        <div style={{ textAlign: "left" }}>⚠️ 당일 오후 2시 이후 주문은 내일 배송됩니다.</div>
      </section>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => router.push("/")} disabled={isSubmitting}>❌ 취소</button>
        <button onClick={handleProcessOrder} disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "💳 주문하기"}
        </button>
      </div>
    </main>
  );
}
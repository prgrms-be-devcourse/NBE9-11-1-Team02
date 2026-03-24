"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";

export default function OrderPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ text: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  const handleProcessOrder = () => {
    setStatus(null);
    if (cartItems.length === 0) {
      setStatus({ text: "장바구니가 비어 있습니다.", type: "error" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setStatus({ text: "이메일 주소를 정확히 입력해 주세요.", type: "error" });
      return;
    }
    setStatus({ text: "주문이 완료되었습니다!", type: "success" });
    clearCart(); 
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const statusMessage = status ? (
    <div style={{ textAlign: "center" }}>
      {status.text}
    </div>
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
        <div style={{ textAlign: "left" }}>
          💰 총 결제 금액: {totalAmount.toLocaleString()}원
        </div>
      </section>

      <section style={{ textAlign: "left" }}>
        <h3>🙋‍♂️ [주문자 정보 입력]</h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>이메일 주소:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="[ 이메일을 입력해 주세요 ✉️ ]"
            style={{ flexGrow: 1 }}
          />
        </div>
        <div style={{ textAlign: "left" }}>
          <p>* 회원가입 없이 이메일 주소만으로 주문이 접수 및 관리됩니다.</p>
          <p>* 동일한 이메일로 추가 주문 시, 하나의 배송으로 합쳐집니다.</p>
        </div>
      </section>

      <section style={{ textAlign: "left" }}>
        <h3>🚚 [배송 안내]</h3>
        <div style={{ textAlign: "left" }}>
          ⚠️ 당일 오후 2시 이후의 주문 건은 다음 날 배송이 시작됩니다.
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={() => router.push("/")}>
          ❌ 취소하기
        </button>
        <button onClick={handleProcessOrder}>
          💳 결제 및 주문
        </button>
      </div>
    </main>
  );
}
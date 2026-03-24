"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// 상대 경로를 통한 cartStore 연결.
import { useCartStore, CartItem } from "../../stores/cartStore";

export default function OrderPage() {
  const router = useRouter();

  // 주문 완료 시에 '장바구니 초기화' 관련 기능
  const { cartItems, clearCart } = useCartStore((state) => ({
    cartItems: state.cartItems,
    clearCart: state.clearCart,
  }));

  // 상태 값에도 엄격한 자료형(string)을 부여했네.
  const [email, setEmail] = useState("");

  // 총금액 계산
  const totalAmount: number = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,0);

  const handleProcessOrder = (): void => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      alert("[주문 확인을 위해 이메일을 입력해 주세요]");
      return;
    }

    // 전송 통신 성공 시
    console.log("주문 데이터 전송 완료:", {
      email,
      items: cartItems,
      totalAmount,
    });
    alert("주문이 완료되었습니다. 메인 화면으로 복귀합니다.");

    // 장바구니 비우기
    // clearCart();
    // 메인 페이지(/)로 이동
    router.push("/"); // src/app/page.jsx로 이동
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>☕ 주문서 작성 (TSX)</h1>

      {/* [주문 상품 정보 박스] */}
      <section>
        <h2>🛒 [주문 상품 정보]</h2>
        <ul>
          {cartItems.map((item: CartItem) => (
            <li key={item.productId}>
              - {item.productName} ({item.quantity}개) :{" "}
              {(item.price * item.quantity).toLocaleString()}원
            </li>
          ))}
        </ul>
        <p>💰 총 결제 금액: {totalAmount.toLocaleString()}원</p>
      </section>

      {/* [주문자 정보 입력 박스] */}
      <section style={{ marginTop: "20px" }}>
        <h2>🙋‍♂️ [주문자 정보 입력]</h2>
        <label>
          이메일 주소 :{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="[ 주문 확인을 위해 이메일을 입력해 주세요 ✉️ ]"
            style={{ width: "70%", padding: "5px" }}
          />
        </label>
      </section>

      {/* 제어 구역 */}
      <section style={{ marginTop: "20px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          ❌ 취소하기
        </button>

        <button
          onClick={handleProcessOrder}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          💳 결제 및 주문
        </button>
      </section>
    </main>
  );
}

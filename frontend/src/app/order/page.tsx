"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";

import { createOrder } from "../../lib/api/order"; 
import { OrderRequest } from "@/types/order"; // 정의된 타입을 참조

export default function OrderPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  // 구매자 정보 상태 추가
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // 구매자명
  const [address, setAddress] = useState("");   // 주소
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호

  const [status, setStatus] = useState<{ text: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProcessOrder = async () => {
    setStatus(null);
    
    // 유효성 검사
    if (cartItems.length === 0) {
      setStatus({ text: "장바구니가 비어 있습니다.", type: "error" });
      return;
    }
    if (!email.trim() || !username.trim() || !address.trim() || !phoneNumber.trim()) {
      setStatus({ text: "모든 주문자 정보를 입력해 주세요.", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: OrderRequest = {
        email,
        username,
        address,
        phoneNumber,
        orderProductRequestList: cartItems.map(item => ({
          productId: item.productId,
          orderQuantity: item.quantity
        }))
      };

      await createOrder(orderData);

      setStatus({ text: "주문이 완료되었습니다!", type: "success" });
      clearCart();
      setTimeout(() => router.push("/"), 2000);
    } catch (e) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* 구매자명 입력 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "100px" }}>구매자 이름: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              style={{ flexGrow: 1, padding: "5px" }}
              disabled={isSubmitting}
            />
          </div>
          {/* 이메일 입력 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "100px" }}>이메일 주소: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              style={{ flexGrow: 1, padding: "5px" }}
              disabled={isSubmitting}
            />
          </div>
          {/* 연락처 입력 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "100px" }}>연락처: </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-0000-0000"
              style={{ flexGrow: 1, padding: "5px" }}
              disabled={isSubmitting}
            />
          </div>
          {/* 주소 입력 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "100px" }}>배송 주소: </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              style={{ flexGrow: 1, padding: "5px" }}
              disabled={isSubmitting}
            />
          </div>
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
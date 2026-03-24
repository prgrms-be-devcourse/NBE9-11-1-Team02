"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";
import { createOrder } from "../../lib/api/order"; 
import { OrderRequest, OrderResponse } from "@/types/order";

export default function OrderPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [address, setAddress] = useState("");   
  const [phoneNumber, setPhoneNumber] = useState(""); 

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
    
    // 필수 입력값 검증
    if (!username.trim() || !email.trim() || !address.trim() || !phoneNumber.trim()) {
      const errorMsg = "주문 정보를 입력하여 주세요.";
      setStatus({ text: errorMsg, type: "error" });
      alert(errorMsg);
      return;
    }
    
    // 이메일 검증
    if (!email.includes("@")) {
      const emailError = "이메일 형식이 유효하지 않습니다.";
      setStatus({ text: emailError, type: "error" });
      alert(emailError);
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

<<<<<<< HEAD
	  // API 호출 - 응답 구조에 따라 데이터를 안전하게 추출함
      const response = await createOrder(orderData);
      
      // 언디파인드 방지
      // API 라이브러리가 res.data를 반환하는지, res 전체를 반환하는지에 따라 대응
      const confirmedOrderId = (response as any).orderId || (response as any).data?.orderId;
=======
      // 서버 응답 타입을 OrderResponse로 명시
      const response = await createOrder(orderData) as { data: OrderResponse };
      const confirmedOrderId = response.data.orderNumber;
>>>>>>> e6d8254100e49f36146fda0c8a59ad5706e9fe66

      if (!confirmedOrderId) {
        throw new Error("서버 응답에서 주문 번호를 식별할 수 없습니다.");
      }

      setStatus({ text: `주문 성공. 번호: ${confirmedOrderId}`, type: "success" });
      
      // 사용자의 명시적 확인 후 이동
      alert(`주문이 완료되었습니다.\n주문 번호: ${confirmedOrderId}\n확인을 누르면 메인으로 이동합니다.`);
	  
      clearCart();
      router.push("/"); // 확인 버튼 클릭 후 즉시 이동

    } catch (e: any) {
      // 서버의 원본 에러 메시지 추출
      const serverErrorMessage = e.response?.data?.message;
      
      // 요청은 보냈으나 응답을 전혀 받지 못한 경우 (네트워크 문제 등)
      const networkErrorMessage = e.request ? "서버와 통신할 수 없습니다. 네트워크 상태를 확인하세요." : null;
      
      // 그 외 설정 오류 또는 알 수 없는 문제
      const finalMsg = serverErrorMessage || networkErrorMessage || e.message || "치명적인 시스템 오류가 발생했습니다.";
      
      const fullErrorMsg = `오류 상세: ${finalMsg}`;
      
      console.error("통신 장애 발생 보고:", e);
      setStatus({ text: fullErrorMsg, type: "error" });
      alert(fullErrorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 상태 메시지
  const statusMessage = status ? (
    <div style={{ 
      textAlign: "center", 
      marginBottom: "15px", 
      fontWeight: "bold",
      color: status.type === "error" ? "red" : "green",
      padding: "10px",
      borderRadius: "4px",
      border: `2px solid ${status.type === "error" ? "#ff4444" : "#44ff44"}`
    }}>
      {status.text}
    </div>
  ) : null;

  if (!isMounted) return null;

  // 공통 섹션 스타일 (경계선 포함)
  const sectionStyle: React.CSSProperties = {
    textAlign: "left",
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9"
  };

  return (
    <main style={{ maxWidth: "650px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ 
        textAlign: "center", 
        fontSize: "2.5rem",   
        fontWeight: "bold",   
        marginBottom: "30px",
        color: "#333"
      }}>
        ☕ 주문서 작성
      </h1>

      {statusMessage}

      <section style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>🛒 [주문 상품 정보]</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {cartItems.map((item: CartItem) => (
            <li key={item.productId} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "5px", backgroundColor: "white", borderRadius: "4px" }}>
              <span>- {item.productName} ({item.quantity}개)</span>
              <span style={{ fontWeight: "bold" }}>{(item.price * item.quantity).toLocaleString()}원</span>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "1.2rem", borderTop: "2px solid #007bff", paddingTop: "10px", marginTop: "10px" }}>
          💰 총 결제 금액: {totalAmount.toLocaleString()}원
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>[주문자 정보 입력]</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>구매자 이름:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              style={{ flexGrow: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              disabled={isSubmitting}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>이메일 주소:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              style={{ flexGrow: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              disabled={isSubmitting}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>연락처:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-0000-0000"
              style={{ flexGrow: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              disabled={isSubmitting}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ width: "100px", fontWeight: "bold" }}>배송 주소:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              style={{ flexGrow: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>🚚 [배송 안내]</h3>
        <div style={{ color: "#e74c3c", fontWeight: "bold" }}>
          ⚠️ 당일 오후 2시 이후 주문은 내일 배송됩니다.
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px" }}>
        <button 
          onClick={() => router.push("/")} 
          disabled={isSubmitting} 
          style={{ 
            padding: "12px 24px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem"
          }} 
        >
          ❌ 취소
        </button>
        <button 
          onClick={handleProcessOrder} 
          disabled={isSubmitting} 
          style={{ 
            padding: "12px 24px", 
            backgroundColor: isSubmitting ? "#6c757d" : "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "6px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "bold"
          }}
        >
          {isSubmitting ? "처리 중..." : "💳 주문하기"}
        </button>
      </div>
    </main>
  );
}
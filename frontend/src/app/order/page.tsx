"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "../../stores/cartStore";
import { createOrder } from "../../lib/api/order";
import { OrderRequest } from "@/types/order";

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

  const [status, setStatus] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleProcessOrder = async () => {
    setStatus(null);

    if (cartItems.length === 0) {
      setStatus({ text: "장바구니가 비어 있습니다.", type: "error" });
      return;
    }

    if (!username.trim() || !email.trim() || !address.trim() || !phoneNumber.trim()) {
      const errorMsg = "주문 정보를 입력하여 주세요.";
      setStatus({ text: errorMsg, type: "error" });
      alert(errorMsg);
      return;
    }

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
        orderProductRequestList: cartItems.map((item) => ({
          productId: item.productId,
          orderQuantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);

      
      // 언디파인드 방지
      // API 라이브러리가 res.data를 반환하는지, res 전체를 반환하는지에 따라 대응
	  
	  // 주문 번호가 없을 경우 "알 수 없음"으로 대체하여 중단 없이 진행.
      const rawOrderId = (response as any).orderNumber || (response as any).data?.orderNumber;

      const confirmedOrderId =
        (response as any).orderNumber || (response as any).data?.orderNumber;

      if (!confirmedOrderId) {
        throw new Error("서버 응답에서 주문 번호를 식별할 수 없습니다.");
      }

      setStatus({
        text: `주문 성공. 번호: ${confirmedOrderId}`,
        type: "success",
      });

      alert(
        `주문이 완료되었습니다.\n주문 번호: ${confirmedOrderId}\n확인을 누르면 메인으로 이동합니다.`
      );

      clearCart();
      router.push("/");
    } catch (e: any) {
      const serverErrorMessage = e.response?.data?.message;
      const networkErrorMessage = e.request
        ? "서버와 통신할 수 없습니다. 네트워크 상태를 확인하세요."
        : null;
      const finalMsg =
        serverErrorMessage ||
        networkErrorMessage ||
        e.message ||
        "치명적인 시스템 오류가 발생했습니다.";

      const fullErrorMsg = `오류 상세: ${finalMsg}`;

      console.error("통신 장애 발생 보고:", e);
      setStatus({ text: fullErrorMsg, type: "error" });
      alert(fullErrorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusMessage = status ? (
    <div
      style={{
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "bold",
        padding: "12px 16px",
        borderRadius: "6px",
        border:
          status.type === "error"
            ? "1px solid rgba(185,28,28,0.25)"
            : "1px solid rgba(45,110,45,0.25)",
        background:
          status.type === "error"
            ? "rgba(185,28,28,0.08)"
            : "rgba(45,110,45,0.08)",
        color: status.type === "error" ? "#b91c1c" : "#2d6e2d",
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: "12px",
        letterSpacing: "0.04em",
      }}
    >
      {status.text}
    </div>
  ) : null;

  if (!isMounted) return null;

  const sectionStyle: React.CSSProperties = {
    textAlign: "left",
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    backgroundColor: "var(--parchment)",
  };

  const labelStyle: React.CSSProperties = {
    width: "100px",
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: "12px",
    letterSpacing: "0.04em",
    color: "var(--muted)",
  };

  const inputStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: "10px 12px",
    border: "1px solid var(--border2)",
    borderRadius: "4px",
    background: "var(--cream)",
    color: "var(--ink)",
    outline: "none",
  };

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "40px 20px",
        minHeight: "100vh",
        background: "var(--cream)",
        color: "var(--ink)",
      }}
    >
      <section
        style={{
          background: "var(--ink)",
          padding: "32px 28px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2.5rem",
            fontWeight: "900",
            marginBottom: "10px",
            color: "var(--cream)",
          }}
        >
          주문서 작성
        </h1>

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.06em",
            color: "var(--sand)",
            margin: 0,
          }}
        >
          주문 정보를 입력하고 배송 일정을 확인하세요.
        </p>
      </section>

      {statusMessage}

      <section style={sectionStyle}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.4rem",
            color: "var(--ink)",
          }}
        >
          주문 상품 정보
        </h3>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {cartItems.map((item: CartItem) => (
            <li
              key={item.productId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "12px 14px",
                backgroundColor: "var(--cream)",
                borderRadius: "4px",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--ink)" }}>
                {item.productName} ({item.quantity}개)
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontWeight: "bold",
                  color: "var(--ink)",
                }}
              >
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--font-playfair), serif",
            fontWeight: "700",
            fontSize: "1.3rem",
            borderTop: "1px solid var(--border)",
            paddingTop: "14px",
            marginTop: "14px",
            color: "var(--amber2)",
          }}
        >
          총 결제 금액: {totalAmount.toLocaleString()}원
        </div>
      </section>

      <section style={sectionStyle}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.4rem",
            color: "var(--ink)",
          }}
        >
          주문자 정보 입력
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={labelStyle}>구매자 이름</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력하세요"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={labelStyle}>이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={labelStyle}>연락처</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-0000-0000"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={labelStyle}>배송 주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h3
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.4rem",
            color: "var(--ink)",
          }}
        >
          배송 안내
        </h3>

        <div
          style={{
            color: "var(--amber2)",
            fontWeight: "700",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.04em",
          }}
        >
          당일 오후 2시 이후 주문은 내일 배송됩니다.
        </div>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          marginTop: "32px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          disabled={isSubmitting}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "var(--ink)",
            border: "1px solid var(--border2)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.08em",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          취소
        </button>

        <button
          onClick={handleProcessOrder}
          disabled={isSubmitting}
          style={{
            padding: "12px 24px",
            backgroundColor: isSubmitting ? "var(--sand)" : "var(--ink)",
            color: isSubmitting ? "var(--muted)" : "var(--cream)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            letterSpacing: "0.08em",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "처리 중..." : "주문하기"}
        </button>
      </div>
    </main>
  );
}
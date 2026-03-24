"use client";

import { useState } from "react";
// 단건 조회(getOrderDetail) 대신 다건 조회(getOrders) 함수를 가져옵니다.
import { getOrders, cancelOrder } from "@/lib/api/order";
import type { OrderResponse } from "@/types/order";

export default function OrdersPage() {
  const [emailInput, setEmailInput] = useState("");
  // 한 건의 객체가 아니라 여러 주문을 담기 위해 배열([])로 상태를 바꿉니다.
  const [orderList, setOrderList] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // 검색 실행 여부 확인용

  // 1. 이메일 기반 주문 목록 조회 기능
  const handleFetchOrders = async () => {
    if (!emailInput.includes("@")) return alert("올바른 이메일 형식을 입력해주세요.");
    
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const res = await getOrders(emailInput);
      setOrderList(res.data); // 이제 res.data는 주문들의 배열(Array)입니다.
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      alert("주문 정보를 불러오는데 실패했습니다.");
      setOrderList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 주문 취소 기능 (어떤 주문을 취소할지 orderId를 매개변수로 받음)
  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("정말로 이 주문을 취소하시겠습니까?")) return;
    
    try {
      await cancelOrder(orderId);
      alert("주문이 성공적으로 취소되었습니다.");
      handleFetchOrders(); // 취소 후 상태 새로고침
    } catch (error) {
      console.error(error);
      alert("주문 취소에 실패했습니다. (이미 배송 중일 수 있습니다)");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 내 주문 내역 조회 (이메일 검색)</h1>
      <hr style={{ marginBottom: "20px" }} />

      {/* 검색 영역 */}
      <div>
        <label htmlFor="emailInput"><strong>주문자 이메일: </strong></label>
        <input
          type="email"
          id="emailInput"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="예: test@cafe.com"
          style={{ marginRight: "10px", padding: "5px", width: "200px" }}
          onKeyDown={(e) => e.key === 'Enter' && handleFetchOrders()}
        />
        <button onClick={handleFetchOrders} disabled={isLoading} style={{ padding: "5px 10px" }}>
          {isLoading ? "조회 중..." : "조회하기"}
        </button>
      </div>

      <br />

      {/* 검색 결과가 없을 때 */}
      {hasSearched && orderList.length === 0 && (
        <p style={{ color: "gray" }}>해당 이메일로 조회된 주문 내역이 없습니다.</p>
      )}

      {/* 검색 결과가 있을 때 (배열을 map으로 순회하여 렌더링) */}
      {orderList.map((order) => (
        <div key={order.orderId} style={{ border: "1px solid #ccc", padding: "15px", marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>주문번호: #{order.orderId}</h2>
            <span style={{ 
              fontWeight: "bold",
              color: order.orderStatus === 'CANCELLED' ? 'red' : 'blue' 
            }}>
              상태: {order.orderStatus}
            </span>
          </div>
          
          <p><strong>총 결제 금액:</strong> {order.totalPrice.toLocaleString()}원</p>
          <p><strong>배송지:</strong> {order.address}</p>

          <hr style={{ margin: "10px 0" }} />

          <h3>주문 상품</h3>
          <ul>
            {order.orderProducts.map((product, idx) => (
              <li key={idx}>
                {product.productName} - 수량: {product.orderQuantity}개 / {product.price.toLocaleString()}원
              </li>
            ))}
          </ul>

          <hr style={{ margin: "10px 0" }} />

          {/* 취소 버튼 영역 */}
          {order.orderStatus !== "CANCELLED" && (
            <button 
              onClick={() => handleCancelOrder(order.orderId)} 
              style={{ backgroundColor: "#ff4d4f", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }}
            >
              이 주문 취소하기
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import { getOrders, cancelOrder } from "@/lib/api/order";
import type { OrderResponse } from "@/types/order";

export default function OrdersPage() {
  const [emailInput, setEmailInput] = useState("");
  const [orderList, setOrderList] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchOrders = async () => {
    if (!emailInput.includes("@")) return alert("올바른 이메일 형식을 입력해주세요.");
    
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const res = await getOrders(emailInput);
      
      // 🚨 안전 장치 1: 응답 데이터가 배열일 때만 추출하도록 수정
      let fetchedOrders = [];
      if (Array.isArray(res)) {
        fetchedOrders = res;
      } else if (res && Array.isArray(res.data)) {
        fetchedOrders = res.data;
      }
      
      setOrderList(fetchedOrders);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      alert("주문 정보를 불러오는데 실패했습니다.");
      setOrderList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("정말로 이 주문을 취소하시겠습니까?")) return;
    
    try {
      await cancelOrder(orderId);
      alert("주문이 성공적으로 취소되었습니다.");
      handleFetchOrders(); 
    } catch (error) {
      console.error(error);
      alert("주문 취소에 실패했습니다.");
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
      {hasSearched && (!orderList || orderList.length === 0) && (
        <p style={{ color: "gray" }}>해당 이메일로 조회된 주문 내역이 없습니다.</p>
      )}

      {/* 🚨 안전 장치 2: orderList 뒤에 물음표(?)를 붙여서 데이터가 있을 때만 map 실행 */}
      {orderList?.map((order) => (
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
          
          <p><strong>총 결제 금액:</strong> {order.totalPrice?.toLocaleString() || 0}원</p>
          <p><strong>배송지:</strong> {order.address}</p>

          <hr style={{ margin: "10px 0" }} />

          <h3>주문 상품</h3>
          <ul>
            {/* 🚨 안전 장치 3: orderProducts 뒤에 물음표(?) 추가 (Postman으로 넣을 때 상품 데이터가 빠져있어도 에러 안 남) */}
            {order.orderProducts?.map((product, idx) => (
              <li key={idx}>
                {product.productName} - 수량: {product.orderQuantity}개 / {product.price?.toLocaleString() || 0}원
              </li>
            ))}
            
            {(!order.orderProducts || order.orderProducts.length === 0) && (
              <li style={{ color: "gray" }}>상품 정보가 없습니다. (Postman 테스트 데이터)</li>
            )}
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
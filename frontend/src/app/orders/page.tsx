"use client";

import { useState } from "react";
import { getOrders, cancelOrder } from "@/lib/api/order";
import type { OrderResponse } from "@/types/order";

export default function OrdersPage() {
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [orderList, setOrderList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchOrders = async () => {
    if (!usernameInput.trim()) return alert("주문자 이름을 입력해주세요.");
    if (!emailInput.includes("@")) return alert("올바른 이메일 형식을 입력해주세요.");
    
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const res = await getOrders(emailInput);
      
      let fetchedOrders = [];
      if (Array.isArray(res)) {
        fetchedOrders = res;
      } else if (res && Array.isArray(res.data)) {
        fetchedOrders = res.data;
      }
      
      // 이름 필터링
      fetchedOrders = fetchedOrders.filter(
        (order: any) => order.username === usernameInput
      );
      
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

  // 14시 기준 '당일/익일 배송' 계산 텍스트 변환 함수
  const getDeliveryText = (order: any) => {
    if (order.createdAt) {
      const orderHour = new Date(order.createdAt).getHours();
      return orderHour < 14 ? "당일 배송" : "익일 배송";
    }
    return order.deliveryDate ? `${order.deliveryDate} (배송 예정)` : "배송일 미정";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 내 주문 내역 조회</h1>
      <hr style={{ marginBottom: "20px" }} />

      {/* 검색 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label htmlFor="usernameInput" style={{ display: "inline-block", width: "120px" }}><strong>주문자 이름: </strong></label>
          <input
            type="text"
            id="usernameInput"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="예: 홍길동"
            style={{ padding: "5px", width: "200px" }}
          />
        </div>

        <div>
          <label htmlFor="emailInput" style={{ display: "inline-block", width: "120px" }}><strong>주문자 이메일: </strong></label>
          <input
            type="email"
            id="emailInput"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="예: test@cafe.com"
            style={{ marginRight: "10px", padding: "5px", width: "200px" }}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchOrders()}
          />
          <button onClick={handleFetchOrders} disabled={isLoading} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px" }}>
            {isLoading ? "조회 중..." : "조회하기"}
          </button>
        </div>
      </div>

      <br />

      {/* 검색 결과가 없을 때 */}
      {hasSearched && (!orderList || orderList.length === 0) && (
        <p style={{ color: "gray", fontWeight: "bold" }}>해당 이름과 이메일로 조회된 주문 내역이 없습니다.</p>
      )}

      {/* 검색 결과가 있을 때 */}
      {orderList?.map((order) => {
        const currentOrderId = order.orderId || order.id;

        // 백엔드 변수명이 무엇이든 다 잡아내는 만능 배열 추출기
        const products = order.orderProducts || order.productResponseList || order.orderProductResponseList || order.products || order.orderProductDtoList || order.orderProductList || [];

        return (
          <div key={currentOrderId} style={{ border: "1px solid #ccc", padding: "15px", marginTop: "15px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="text-2xl font-bold font-mono">Order #{order.orderNumber || currentOrderId}</h2>
              <span style={{ 
                fontWeight: "bold",
                color: order.orderStatus === 'CANCELLED' ? 'red' : 'blue',
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: order.orderStatus === 'CANCELLED' ? '#ffeede' : '#eef2ff'
              }}>
                상태: {order.orderStatus}
              </span>
            </div>
            
            <p><strong>총 결제 금액:</strong> {order.totalPrice?.toLocaleString() || 0}원</p>
            <p><strong>배송지:</strong> {order.address}</p>
            <p style={{ color: "#0066cc" }}><strong>배송 예정일:</strong> {getDeliveryText(order)}</p>

            <hr style={{ margin: "10px 0" }} />

            <h3>주문 상품</h3>
            <ul>
              {products?.map((product: any, idx: number) => {
                const pName = product.productName || product.name || "상품명 확인 불가";
                const pQty = product.orderQuantity || product.quantity || product.count || 0;
                const pPrice = product.price || product.orderPrice || product.totalPrice || 0;

                return (
                  <li key={idx} style={{ marginBottom: "5px" }}>
                    <strong style={{ fontSize: "16px" }}>{pName}</strong> - 수량: {pQty}개 / {pPrice.toLocaleString()}원
                  </li>
                );
              })}
              
              {(!products || products.length === 0) && (
                <li style={{ color: "gray" }}>주문 시 상품 정보가 연동되지 않았습니다.</li>
              )}
            </ul>

            <hr style={{ margin: "10px 0" }} />

            {/* 취소 버튼 영역 */}
            {order.orderStatus !== "CANCELLED" && (
              <button 
                onClick={() => handleCancelOrder(currentOrderId)} 
                style={{ backgroundColor: "#ff4d4f", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                이 주문 취소하기
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

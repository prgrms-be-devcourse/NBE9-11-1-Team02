"use client";

import { useState } from "react";
import { getOrders, cancelOrder } from "@/lib/api/order";

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

  const getDeliveryText = (order: any) => {
    if (order.createdAt) {
      const orderHour = new Date(order.createdAt).getHours();
      return orderHour < 14 ? "당일 배송" : "익일 배송";
    }
    return order.deliveryDate ? `${order.deliveryDate} (배송 예정)` : "배송일 미정";
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <h1 
        className="text-4xl font-bold text-center mb-8"
        style={{ fontFamily: "var(--font-playfair), serif", color: "var(--ink)" }}
      >
        My Orders
      </h1>

      {/* 검색 영역 */}
      <div 
        className="p-6 md:p-8 rounded-lg shadow-sm flex flex-col gap-4"
        style={{ backgroundColor: "var(--parchment)", border: "1px solid var(--border)" }}
      >
        <div className="grid md:grid-cols-[120px_1fr] items-center gap-2">
          <label htmlFor="usernameInput" className="font-bold text-sm">주문자 이름</label>
          <input
            type="text"
            id="usernameInput"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="홍길동"
            className="p-2 outline-none rounded-sm transition-colors"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border2)" }}
          />
        </div>

        <div className="grid md:grid-cols-[120px_1fr_auto] items-center gap-2">
          <label htmlFor="emailInput" className="font-bold text-sm">주문자 이메일</label>
          <input
            type="email"
            id="emailInput"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="test@cafe.com"
            className="p-2 outline-none rounded-sm transition-colors"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border2)" }}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchOrders()}
          />
          <button 
            onClick={handleFetchOrders} 
            disabled={isLoading} 
            className="px-6 py-2 rounded-sm font-bold transition-opacity hover:opacity-90 md:ml-2 mt-2 md:mt-0"
            style={{ backgroundColor: "var(--ink)", color: "var(--cream)" }}
          >
            {isLoading ? "조회 중..." : "조회하기"}
          </button>
        </div>
      </div>

      {/* 검색 결과가 없을 때 */}
      {hasSearched && (!orderList || orderList.length === 0) && (
        <p className="text-center py-10" style={{ color: "var(--muted)" }}>해당 이름과 이메일로 조회된 주문 내역이 없습니다.</p>
      )}

      {/* 검색 결과 */}
      <div className="space-y-6">
        {orderList?.map((order) => {
          const currentOrderId = order.orderId || order.id;
          const products = order.orderProducts || order.productResponseList || order.orderProductResponseList || order.products || order.orderProductDtoList || order.orderProductList || [];

          return (
            <div 
              key={currentOrderId} 
              className="p-6 rounded-lg shadow-sm space-y-4"
              style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border2)" }}
            >
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-2xl font-bold font-mono">Order #{currentOrderId}</h2>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: order.orderStatus === 'CANCELLED' ? "var(--amber-pale)" : "var(--parchment)",
                    color: order.orderStatus === 'CANCELLED' ? "red" : "var(--amber2)",
                    border: "1px solid var(--border)"
                  }}
                >
                  {order.orderStatus}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <p><strong style={{ color: "var(--muted)" }}>총 결제 금액:</strong> {order.totalPrice?.toLocaleString() || 0}원</p>
                <p><strong style={{ color: "var(--muted)" }}>배송지:</strong> {order.address}</p>
                <p style={{ color: "var(--amber2)" }}><strong>배송 예정일:</strong> {getDeliveryText(order)}</p>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--muted)" }}>주문 상품</h3>
                <ul className="space-y-2">
                  {products?.map((product: any, idx: number) => {
                    const pName = product.productName || product.name || "상품명 확인 불가";
                    const pQty = product.orderQuantity || product.quantity || product.count || 0;
                    const pPrice = product.price || product.orderPrice || product.totalPrice || 0;

                    return (
                      <li key={idx} className="flex justify-between items-center bg-white/40 p-2 rounded text-sm" style={{ border: "1px solid var(--border)" }}>
                        <span><strong>{pName}</strong> <span style={{ color: "var(--muted)" }}>x {pQty}</span></span>
                        <span className="font-mono">{pPrice.toLocaleString()}원</span>
                      </li>
                    );
                  })}
                  {(!products || products.length === 0) && (
                    <li className="text-sm" style={{ color: "var(--muted)" }}>주문 시 상품 정보가 연동되지 않았습니다.</li>
                  )}
                </ul>
              </div>

              {/* 취소 버튼 */}
              {order.orderStatus !== "CANCELLED" && (
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => handleCancelOrder(currentOrderId)} 
                    className="px-4 py-2 rounded-sm text-sm font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "var(--amber)", color: "var(--cream)" }}
                  >
                    이 주문 취소하기
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client'

import { getProducts } from "@/lib/api/product";
import { CartItem, useCartStore } from "@/stores/cartStore";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function List() {

  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { cartItems, addToCart, removeFromCart } = useCartStore();

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.data)
      console.log(res);
    })
  }, []);

  const increase = (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  const decrease = (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1)
    }));
  };

  const handleAddToCart = (p: Product) => {
    const quantityToAdd = quantities[p.id] || 1;

    const existingItem = cartItems.find(item => item.productId === p.id);
    const existingQuantity = existingItem ? existingItem.quantity : 0;

    if (existingQuantity + quantityToAdd > 10) {
      alert("장바구니에는 한 상품 최대 10개까지만 담을 수 있습니다. 10개까지만 담겼습니다.");
    }

    addToCart({
      productId: p.id,
      productName: p.name,
      price: p.price,
      quantity: Math.min(existingQuantity + quantityToAdd, 10) - existingQuantity,
    });

    setQuantities(prev => ({
      ...prev,
      [p.id]: 1
    }));
  };

  return (
      <>
        <div className="flex gap-6">
          <ProductList
              products={products}
              quantities={quantities}
              increase={increase}
              decrease={decrease}
              handleAddToCart={handleAddToCart}
          />
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </div>
      </>
  );
}

function ProductList({
                       products,
                       quantities,
                       increase,
                       decrease,
                       handleAddToCart,
                     }: {
  products: Product[];
  quantities: Record<number, number>;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  handleAddToCart: (p: Product) => void;
}) {
  if (products.length === 0) return <div>로딩 중...</div>;

  return (
      <>
        <div className="flex-1 grid gap-4">
          {products.map((p) => (
              /* 상품 카드 */
              <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ background: "var(--parchment)", border: "1px solid var(--border)" }}
              >
                <Image
                    src={p.image_url ? `/${p.image_url}` : "/default.png"}
                    alt={p.name}
                    width={100}
                    height={100}
                    className="rounded"
                    loading="eager"
                />
                <div className="flex-1 px-4 flex flex-col gap-1">
                  {/* 상품명 */}
                  <div style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--ink)",
                  }}>
                    {p.name}
                  </div>
                  {/* 가격 */}
                  <div style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "13px",
                    color: "var(--amber)",
                  }}>
                    {p.price}원
                  </div>
                  {/* 품절 여부 */}
                  <div className="text-red-500 font-semibold" style={{ fontSize: "12px" }}>
                    {p.quantity < 1
                        ? "품절🥲"
                        : p.quantity <= 50
                            ? "품절 임박!"
                            : null}
                  </div>
                </div>

                {p.quantity > 0 && (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex flex-col items-center">
                          {/* 수량 조절 버튼 */}
                          <div className="flex items-center gap-2">
                            <button
                                style={{
                                  width: "32px", height: "32px",
                                  border: "1px solid var(--border2)",
                                  background: (quantities[p.id] || 1) <= 1 ? "var(--sand)" : "transparent",
                                  cursor: (quantities[p.id] || 1) <= 1 ? "not-allowed" : "pointer",
                                  color: "var(--ink)",
                                }}
                                onClick={() => decrease(p.id)}
                                disabled={(quantities[p.id] || 1) <= 1}
                            >
                              -
                            </button>
                            <span style={{
                              width: "24px", textAlign: "center",
                              fontFamily: "var(--font-dm-mono), monospace",
                            }}>
                        {quantities[p.id] || 1}
                      </span>
                            <button
                                style={{
                                  width: "32px", height: "32px",
                                  border: "1px solid var(--border2)",
                                  background: (quantities[p.id] || 1) >= 10 ? "var(--sand)" : "transparent",
                                  cursor: (quantities[p.id] || 1) >= 10 ? "not-allowed" : "pointer",
                                  color: "var(--ink)",
                                }}
                                onClick={() => increase(p.id)}
                                disabled={(quantities[p.id] || 1) >= 10}
                            >
                              +
                            </button>
                          </div>

                          <div className="h-4 mt-1 text-center" style={{ fontSize: "10px", color: "var(--amber)" }}>
                            {(quantities[p.id] || 1) >= 10 && "최대 10개까지만 담을 수 있습니다."}
                          </div>
                        </div>

                        {/* 추가 버튼 */}
                        <button
                            style={{
                              marginTop: "4px",
                              padding: "6px 20px",
                              height: "34px",
                              background: p.quantity < 1 ? "var(--sand)" : "var(--ink)",
                              color: p.quantity < 1 ? "var(--muted)" : "var(--cream)",
                              border: "none",
                              fontFamily: "var(--font-dm-mono), monospace",
                              fontSize: "11px",
                              letterSpacing: "0.08em",
                              cursor: p.quantity < 1 ? "not-allowed" : "pointer",
                            }}
                            onClick={() => handleAddToCart(p)}
                            disabled={p.quantity < 1}
                        >
                          추가
                        </button>
                      </div>
                    </>
                )}
              </div>
          ))}
        </div>
      </>
  );
}

function Cart({
                cartItems,
                removeFromCart,
              }: {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
}) {
  return (
      /* 장바구니 사이드바 */
      <div
          className="w-80 p-4 rounded-lg sticky top-4 h-fit"
          style={{ background: "var(--parchment)", border: "1px solid var(--border)" }}
      >
        {/* 장바구니 제목 */}
        <h2 style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "1rem",
          color: "var(--ink)",
        }}>
          장바구니
        </h2>

        {cartItems.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>비어있음</div>
        ) : (
            <ul className="flex flex-col gap-2">
              {cartItems.map((item) => (
                  <li
                      key={item.productId}
                      className="flex justify-between items-center p-2 rounded"
                      style={{ background: "var(--cream)", border: "1px solid var(--border)" }}
                  >
                    <span className="flex-1" style={{ fontSize: "13px" }}>{item.productName}</span>
                    <span className="w-12 text-center" style={{ fontSize: "12px", color: "var(--muted)" }}>{item.quantity}개</span>
                    <span className="w-20 text-right" style={{ fontSize: "13px" }}>{item.price * item.quantity}원</span>
                    {/* 삭제 버튼 */}
                    <button
                        className="ml-2 px-2 py-1"
                        style={{
                          border: "1px solid var(--border2)",
                          color: "#b91c1c",
                          fontSize: "11px",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => removeFromCart(item.productId)}
                    >
                      삭제
                    </button>
                  </li>
              ))}
            </ul>
        )}

        <div className="mt-4">
          <Link href="/order">
            {/* 주문하기 버튼 */}
            <button
                disabled={cartItems.length === 0}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: cartItems.length === 0 ? "var(--sand)" : "var(--ink)",
                  color: cartItems.length === 0 ? "var(--muted)" : "var(--cream)",
                  border: "none",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
                }}
            >
              주문하기
            </button>
          </Link>
        </div>
      </div>
  );
}
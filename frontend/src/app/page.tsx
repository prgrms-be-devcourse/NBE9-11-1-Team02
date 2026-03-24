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
    getProducts().then((res) => {
      console.log("상품 배열:", res.data); // 배열 확인
      console.table(res.data);            // 표로 확인
      setProducts(res.data);
    });
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
        <div 
          key={p.id} 
          className="flex items-center justify-between bg-cream-50 p-4 rounded-lg shadow-sm">
          <img
            src={p.image_url ? `/${p.image_url}` : "/default.png"}
            alt={p.name}
            width={100}
            height={100}
      className="rounded"
/>
          <div className="flex-1 px-4 flex flex-col justify-between">
            <div className="font-semibold">{p.name}</div>
            <div className="text-gray-600">{p.price}원</div>
            <div className="text-red-500 font-semibold">
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
                <div className="flex items-center gap-2">
                  <button
                    className={`w-8 h-8 border rounded hover:bg-gray-100 disabled:bg-gray-200
                      ${(quantities[p.id] || 1) <= 1 ? "bg-gray-200 hover:bg-gray-200" : ""}`}
                    onClick={() => decrease(p.id)}
                    disabled={(quantities[p.id] || 1) <= 1}
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{quantities[p.id] || 1}</span>
                  <button
                    className={`w-8 h-8 border rounded hover:bg-gray-100 disabled:bg-gray-200 
                      ${(quantities[p.id] || 1) >= 10 ? "bg-gray-200 hover:bg-gray-200" : ""}`}
                    onClick={() => increase(p.id)}
                    disabled={(quantities[p.id] || 1) >= 10}
                  >
                    +
                  </button>
                </div>

                <div className="h-4 w-50 text-red-500 text-xs mt-1 text-center">
                  {(quantities[p.id] || 1) >= 10 && "최대 10개까지만 담을 수 있습니다."}
                </div>
              </div>

              <button
                className={`mt-1 border rounded px-4 h-8 hover:bg-gray-100 disabled:bg-gray-200 
                  ${p.quantity < 1 ? "bg-gray-200 hover:bg-gray-200" : ""}`}
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
    <div className="w-80 bg-cream-100 p-4 rounded-lg shadow-md sticky top-4 h-fit">
      <h2 className="text-lg font-bold mb-4">장바구니</h2>
      {cartItems.length === 0 ? (
        <div className="text-gray-500">비어있음</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <li 
              key={item.productId} 
              className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
              <span className="flex-1">{item.productName}</span>
              <span className="w-12 text-center">{item.quantity}개</span>
              <span className="w-20 text-right">{item.price * item.quantity}원</span>
              <button
                className="border rounded px-2 py-1 text-red-500 hover:bg-red-50 ml-2"
                onClick={() => removeFromCart(item.productId)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col mt-4">
        <Link href="/order">
          <button
            disabled={cartItems.length === 0}
            title="상품을 먼저 담아주세요"
            className={`border rounded px-4 py-2 transition ${
              cartItems.length === 0
                ? "bg-gray-200 text-gray-400 opacity-70"
                : "hover:bg-gray-100"
            }`}
          >
            주문하기
          </button>
        </Link>
      </div>
    </div>
  );
}
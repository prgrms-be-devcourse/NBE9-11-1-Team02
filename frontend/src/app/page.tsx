'use client'

import { getProducts } from "@/lib/api/product";
import { useCartStore } from "@/stores/cartStore";
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
    }
    )
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
    <div>Grids & Circles</div>
    <div className="flex gap-50">
      <div>
        {products.length === 0 ? (
          <div>로딩 중...</div>
        ) : (
        products.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <Image src={p.imageUrl || "/default.png"} 
                    alt={p.name} 
                    width={100} height={100}
                    loading="eager" />
            <div>{p.name}</div>
            <div>{p.price}원</div>

            <div className="text-red-500 font-semibold">
              {p.quantity < 1  
                ? "품절🥲"          
                : p.quantity <= 50
                    ? "품절 임박!"     
                    : null}     
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
              <button
                className={`border rounded px-2 py-1 hover:bg-gray-100 
                  ${ (quantities[p.id] || 1) <= 1 
                        ? 'bg-gray-200 hover:bg-gray-200' : '' }`}
                onClick={() => decrease(p.id)}
                disabled={(quantities[p.id] || 1) <= 1}>-
              </button>
                <span>{quantities[p.id] || 1}</span>
                <button
                  className={`border rounded px-2 py-1 hover:bg-gray-100 
                    ${ (quantities[p.id] || 1) >= 10 
                          ? 'bg-gray-200 hover:bg-gray-200' : '' }`}
                  onClick={() => increase(p.id)}
                  disabled={(quantities[p.id] || 1) >= 10}>+
                </button>
              </div>
              {(quantities[p.id] || 1) >= 10 && (
                <div className="text-red-500 text-sm mt-1">
                  최대 10개까지만 담을 수 있습니다.
                </div>
              )}
            </div>
            <button 
              className="border rounded px-4 py-1 ml-3 hover:bg-gray-100"
              onClick={() => handleAddToCart(p)}>추가</button>
          </div>
        ))
      )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold">장바구니</h2>
        {cartItems.length === 0 ? (
          <div>비어있음</div>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <span>{item.productName}</span>
                <span>{item.quantity}개</span>
                <span>{item.price * item.quantity}원</span>
                <button
                  className="border rounded px-2 py-1 text-red-500 hover:bg-red-50"
                  onClick={() => removeFromCart(item.productId)}>삭제
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col">
          <Link href="/order">
            <button 
              disabled={cartItems.length === 0}
              title="상품을 먼저 담아주세요"
              className={`border rounded px-4 py-2 mt-4 transition
              ${cartItems.length === 0 
                      ? "bg-gray-200 text-gray-400 opacity-70" 
                      : "hover:bg-gray-100"}`}>
              주문하기
            </button>
          </Link>
          <Link href="/orders">
            <button className="border rounded px-4 py-2 mt-2 hover:bg-gray-100">
              주문조회
            </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

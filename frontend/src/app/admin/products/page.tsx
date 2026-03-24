"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/api/products");
    const json = await res.json();
    console.log("admin products:", json.data);
    console.table(json.data);
    setProducts(json.data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    const body = JSON.stringify(form);

    if (editId !== null) {
      await fetch(`http://localhost:8080/api/products/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Admin-Email": "admin@cafe.com",
        },
        body,
      });
    } else {
      await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Email": "admin@cafe.com",
        },
        body,
      });
    }

    await fetchProducts();
    setForm({
      name: "",
      price: 0,
      quantity: 0,
    });
    setEditId(null);
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Admin-Email": "admin@cafe.com",
      },
    });
    await fetchProducts();
  };

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">관리자 상품 관리</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
        <section className="bg-white text-black rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">
            {editId !== null ? "상품 수정" : "상품 추가"}
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">상품명</label>
              <input
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="상품명 입력"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">가격</label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="가격 입력"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">재고</label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black"
                placeholder="재고 입력"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-black text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-800"
              >
                {editId !== null ? "수정 완료" : "상품 추가"}
              </button>

              {editId !== null && (
                <button
                  onClick={() => {
                    setEditId(null);
                    setForm({
                      name: "",
                      price: 0,
                      quantity: 0,
                    });
                  }}
                  className="border border-gray-400 rounded-lg px-4 py-2 font-semibold hover:bg-gray-100"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white text-black rounded-2xl shadow-lg p-5 flex flex-col"
              >
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={`/${product.image_url}`}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">이미지 없음</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-1">가격: {product.price}원</p>
                <p className="text-gray-700 mb-4">재고: {product.quantity}</p>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-black text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 border border-red-500 text-red-500 rounded-lg px-4 py-2 font-semibold hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
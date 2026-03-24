"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    imageUrl: "default.png",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/api/products");
    const json = await res.json();
    setProducts(json.data ?? []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      quantity: "",
      imageUrl: "default.png",
    });
    setEditId(null);
    setMode("create");
  };

  const handleSubmit = async () => {
    const body = JSON.stringify({
      name: form.name,
      price: Number(form.price),       
      quantity: Number(form.quantity), 
    });

    if (mode === "edit" && editId !== null) {
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
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setMode("edit");
    setForm({
      name: product.name,
      price: String(product.price),
      quantity: String(product.quantity),
      imageUrl: product.image_url ?? "default.png",
    });
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Admin-Email": "admin@cafe.com",
      },
    });

    if (editId === id) {
      resetForm();
    }

    await fetchProducts();
  };

  return (
    <main className="min-h-screen bg-black text-white px-8 py-10">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">관리자 상품 관리</h1>

        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="border border-white rounded-lg px-4 py-2 font-semibold hover:bg-white hover:text-black transition"
          >
            상품 추가
          </button>

          <Link href="/admin/orders">
            <button className="border border-white rounded-lg px-4 py-2 font-semibold hover:bg-white hover:text-black transition">
              주문 관리
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        <section className="bg-white text-black rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">
            {mode === "edit" ? "상품 수정" : "상품 추가"}
          </h2>

          {mode === "edit" && editId !== null && (
            <p className="text-sm text-gray-500 mb-4">
              현재 수정 중인 상품 ID: {editId}
            </p>
          )}

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
                  setForm({ ...form, price: e.target.value })
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
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-black text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-800"
              >
                {mode === "edit" ? "수정 완료" : "상품 추가"}
              </button>

              <button
                onClick={resetForm}
                className="border border-gray-400 rounded-lg px-4 py-2 font-semibold hover:bg-gray-100"
              >
                초기화
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white text-black p-4 rounded-xl shadow-lg"
              >
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={`/${product.image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">이미지 없음</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-1">가격: {product.price}원</p>
                <p className="text-gray-700 mb-4">재고: {product.quantity}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-black text-white py-2 rounded font-semibold hover:bg-gray-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 border border-red-500 text-red-500 py-2 rounded font-semibold hover:bg-red-50"
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
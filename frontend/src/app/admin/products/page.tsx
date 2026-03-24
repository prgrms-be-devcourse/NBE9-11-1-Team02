"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";

const ADMIN_EMAIL = "admin@cafe.com";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/api/products");
    const json = await res.json();
    setProducts(json.data ?? []);
  };

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");

    if (adminEmail !== ADMIN_EMAIL) {
      alert("관리자만 접근 가능합니다.");
      window.location.href = "/admin/login";
      return;
    }

    setIsAuthorized(true);
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      quantity: "",
    });
    setEditId(null);
    setMode("create");
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!form.price.trim() || Number(form.price) < 0) {
      alert("가격을 올바르게 입력해주세요.");
      return;
    }

    if (!form.quantity.trim() || Number(form.quantity) < 0) {
      alert("재고를 올바르게 입력해주세요.");
      return;
    }

    const adminEmail = localStorage.getItem("adminEmail") ?? "";

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
          "Admin-Email": adminEmail,
        },
        body,
      });
    } else {
      await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Email": adminEmail,
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
    });
  };

  const handleDelete = async (id: number) => {
    const adminEmail = localStorage.getItem("adminEmail") ?? "";

    await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Admin-Email": adminEmail,
      },
    });

    if (editId === id) {
      resetForm();
    }

    await fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin/login";
  };

  if (!isAuthorized) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "28px",
            fontWeight: "700",
            color: "var(--ink)",
          }}
        >
          관리자 상품 관리
        </h1>

        <div className="flex gap-2">
          <button
            onClick={resetForm}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border2)",
              background: "transparent",
              fontFamily: "var(--font-dm-mono)",
              cursor: "pointer",
            }}
          >
            상품 추가
          </button>

          <Link href="/admin/orders">
            <button
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border2)",
                background: "transparent",
                fontFamily: "var(--font-dm-mono)",
                cursor: "pointer",
              }}
            >
              주문 관리
            </button>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border2)",
              background: "transparent",
              fontFamily: "var(--font-dm-mono)",
              cursor: "pointer",
              color: "#b91c1c",
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6">
        <div
          className="p-4 rounded-lg"
          style={{ background: "var(--parchment)", border: "1px solid var(--border)" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            {mode === "edit" ? "상품 수정" : "상품 추가"}
          </h2>

          <div className="flex flex-col gap-3">
            <input
              placeholder="상품명"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border"
            />

            <input
              type="number"
              step="100"
              min="0"
              placeholder="가격"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="p-2 border"
            />

            <input
              type="number"
              min="0"
              placeholder="재고"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="p-2 border"
            />

            <button
              onClick={handleSubmit}
              style={{
                padding: "8px",
                background: "var(--ink)",
                color: "var(--cream)",
                fontFamily: "var(--font-dm-mono)",
                cursor: "pointer",
              }}
            >
              {mode === "edit" ? "수정" : "추가"}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ background: "var(--parchment)", border: "1px solid var(--border)" }}
            >
              <img
                src={p.image_url ? `/${p.image_url}` : "/default.png"}
                alt={p.name}
                width={100}
                height={100}
                className="rounded"
              />

              <div className="flex-1 px-4">
                <div
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "12px",
                    color: "var(--amber)",
                  }}
                >
                  {p.price}원 / {p.quantity}개
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  style={{
                    padding: "8px 16px",
                    background: "var(--ink)",
                    color: "var(--cream)",
                    border: "1px solid var(--ink)",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  수정
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    color: "#b91c1c",
                    border: "1px solid #b91c1c",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
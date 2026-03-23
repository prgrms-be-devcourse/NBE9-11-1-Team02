"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";


export default function AdminProductsPage() {
    //상품 목록 상태
    const [products, setProducts] = useState<Product[]>([]);
    // 등록/수정 폼 상태
    const [form, setForm] = useState({ name: "", price: 0, quantity: 0, imageUrl: "" });
    // 수정 중인 상품 id (null이면 등록 모드)
    const [editId, setEditId] = useState<number | null>(null);

    // 상품 목록 조회
    const fetchProducts = async () => {
        const res = await fetch("http://localhost:8080/api/products");
        const json = await res.json();
        console.log(json);
        setProducts(json.data ?? []);
    };

    // 페이지 진입 시 상품 목록 불러오기
    useEffect(() => {
        fetchProducts();
    }, []);

    // 등록 또는 수정 처리
    const handleSubmit = async () => {
        if (editId !== null) {
            await fetch(`http://localhost:8080/api/products/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        } else {
            // 등록 모드 — POST 요청
            await fetch("http://localhost:8080/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }
        // 목록 새로고침 후 폼 초기화
        fetchProducts();
        setForm({ name: "", price: 0, quantity: 0, imageUrl: "" });
        setEditId(null);
    };

    // 수정 버튼 클릭 — 폼에 기존 데이터 채우기
    const handleEdit = (product: Product) => {
        setEditId(product.id);
        setForm({ name: product.name, price: product.price, quantity: product.quantity, imageUrl: product.imageUrl });
    };

    // 삭제 버튼 클릭 — DELETE 요청 후 목록 새로고침
    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
    };

    return (
        <div>
            <h1>관리자 상품 관리</h1>

            {/* 상품 등록 / 수정 */}
            <div>
                <h2>{editId !== null ? "상품 수정" : "상품 추가"}</h2>

                <label>상품명</label>
                <input placeholder="상품명 입력" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

                <label>가격</label>
                <input placeholder="가격 입력" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />

                <label>재고</label>
                <input placeholder="재고 입력" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />

                <label>이미지 URL</label>
                <input placeholder="이미지 URL 입력" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

                <button onClick={handleSubmit}>{editId !== null ? "수정 완료" : "추가"}</button>
                {editId !== null && <button onClick={() => setEditId(null)}>취소</button>}
            </div>

            {/* 상품 목록 */}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <p>{product.name}</p>
                        <p>{product.price}원</p>
                        <p>재고: {product.quantity}</p>
                        <button onClick={() => handleEdit(product)}>수정</button>
                        <button onClick={() => handleDelete(product.id)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
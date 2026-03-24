"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) {
      alert("관리자 이메일을 입력해주세요.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const json = await res.json();
      console.log("admin login response:", json);
  
      if (json.resultCode === "200") {
        localStorage.setItem("adminEmail", email.trim());
        router.push("/admin/products");
      } else {
        alert(json.msg || "관리자 이메일이 아닙니다.");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div
        className="w-full max-w-md p-8 rounded-lg"
        style={{
          background: "var(--parchment)",
          border: "1px solid var(--border)",
          color: "var(--ink)",
        }}
      >
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          관리자 로그인
        </h1>

        <p
          className="mb-4"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "12px",
            color: "var(--muted)",
          }}
        >
          관리자 이메일을 입력해주세요.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border mb-4"
          style={{
            borderColor: "var(--border2)",
            background: "var(--cream)",
            color: "var(--ink)",
          }}
        />

        <div className="flex gap-2">
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--ink)",
              color: "var(--cream)",
              border: "none",
              fontFamily: "var(--font-dm-mono), monospace",
              cursor: "pointer",
            }}
          >
            확인
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              color: "var(--ink)",
              border: "1px solid var(--border2)",
              fontFamily: "var(--font-dm-mono), monospace",
              cursor: "pointer",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setResult("✅ 회원가입 성공");
      } else {
        setResult(`❌ 실패: ${data.message}`);
      }
    } catch (err) {
      setResult("❌ 오류 발생");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📝 회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <button onClick={handleRegister}>회원가입</button>
      <p>{result}</p>
    </div>
  );
}

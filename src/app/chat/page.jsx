"use client";

import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
export default function ChatPage() {
  const [nickname, setNickname] = useState("익명");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0); // 접속자 수 상태

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const handleUserCount = (count) => setUserCount(count);

    socket.on("chat message", handleMessage);
    socket.on("user count update", handleUserCount); // 이벤트명 정확히 맞춤

    return () => {
      socket.off("chat message", handleMessage);
      socket.off("user count update", handleUserCount);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const fullMessage = `${nickname}: ${message}`;
    socket.emit("chat message", fullMessage);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>
        🗨️ 실시간 채팅{" "}
        <span style={{ fontSize: "0.7em", color: "gray" }}>
          ({userCount - 2}명 접속)
        </span>
      </h1>

      <input
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div
        ref={messagesEndRef}
        style={{
          border: "1px solid gray",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      <input
        placeholder="메시지 입력"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

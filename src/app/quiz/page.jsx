"use client";

import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";

export default function QuizPage() {
  // 컴포넌트 이름은 PascalCase가 관례입니다 (quizPage -> QuizPage)
  const [nickname, setNickname] = useState("익명");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0); // 접속자 수 상태
  const [quizQuestion, setQuizQuestion] = useState(""); // 문제 상태
  const [quizAnswer, setQuizAnswer] = useState(""); // 정답 상태
  const [currentQuiz, setCurrentQuiz] = useState(null); // 현재 출제된 문제 정보 (서버에서 받음)

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      // 메시지가 정답인지 확인
      if (currentQuiz && msg.includes(currentQuiz.answer)) {
        // 간단한 포함 여부로 체크
        setMessages((prev) => [...prev, "🌟 정답입니다! 🌟"]);
        setCurrentQuiz(null); // 정답이 맞춰지면 현재 문제 초기화
      }
    };
    const handleUserCount = (count) => setUserCount(count);
    const handleNewQuiz = (quiz) => {
      // 서버에서 새로운 문제가 출제되면
      setCurrentQuiz(quiz); // 현재 문제 업데이트
      setMessages((prev) => [...prev, `[새로운 문제]: ${quiz.question}`]); // 문제 알림
    };
    const handleQuizAnswered = () => {
      // 서버에서 정답이 맞춰졌다고 알려줄 때
      setCurrentQuiz(null); // 현재 문제 초기화
      setMessages((prev) => [...prev, "🌟 정답이 맞춰졌습니다! 🌟"]);
    };

    socket.on("chat message", handleMessage);
    socket.on("user count update", handleUserCount);
    socket.on("new quiz", handleNewQuiz); // 새로운 퀴즈 이벤트 리스너 추가
    socket.on("quiz answered", handleQuizAnswered); // 퀴즈 정답 이벤트 리스너 추가

    return () => {
      socket.off("chat message", handleMessage);
      socket.off("user count update", handleUserCount);
      socket.off("new quiz", handleNewQuiz);
      socket.off("quiz answered", handleQuizAnswered);
    };
  }, [currentQuiz]); // currentQuiz가 변경될 때마다 useEffect를 다시 실행하여 최신 값을 사용

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤을 맨 아래로 내림
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const fullMessage = `${nickname}: ${message}`;
    socket.emit("chat message", fullMessage); // 메시지 전송
    setMessage("");
  };

  const submitQuiz = () => {
    if (!quizQuestion.trim() || !quizAnswer.trim()) {
      alert("문제와 정답을 모두 입력해주세요!");
      return;
    }
    // 서버에 문제와 정답 전송
    socket.emit("submit quiz", { question: quizQuestion, answer: quizAnswer });
    setQuizQuestion(""); // 입력 필드 초기화
    setQuizAnswer(""); // 입력 필드 초기화
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>
        🗨️ 실시간 채팅{" "}
        <span style={{ fontSize: "0.7em", color: "gray" }}>
          ({Math.max(0, userCount - 2)}명 접속) {/* 클라이언트에서도 -2 보정 */}
        </span>
      </h1>

      {/* 닉네임 입력 */}
      <input
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* 문제 출제 섹션 */}
      <div
        style={{ border: "1px solid lightgray", padding: 10, marginBottom: 20 }}
      >
        <h2>📝 문제 내기</h2>
        <textarea
          placeholder="문제 내용을 입력하세요."
          value={quizQuestion}
          onChange={(e) => setQuizQuestion(e.target.value)}
          rows="3"
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="정답을 입력하세요."
          value={quizAnswer}
          onChange={(e) => setQuizAnswer(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button onClick={submitQuiz}>문제 내기</button>
      </div>

      {/* 채팅 메시지 영역 */}
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

      {/* 메시지 입력 및 전송 */}
      <input
        placeholder="메시지 입력"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "calc(100% - 60px)", marginRight: 5 }}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

// src/app/api/login/route.js
import { db } from "@/lib/db";

export async function POST(req) {
  const { email, password } = await req.json();

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  // ✅ 먼저 존재 여부 확인
  if (!rows || rows.length === 0) {
    return new Response(
      JSON.stringify({ success: false, message: "로그인 실패" }),
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  // ✅ 이 부분은 성공일 때만 실행
  const user = rows[0];

  return new Response(
    JSON.stringify({
      success: true,
      users: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// src/app/api/login/route.js
import { db } from "@/lib/db";

export async function POST(req) {
  const { email, password } = await req.json();

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (rows.length === 0) {
    return new Response(
      JSON.stringify({ success: false, message: "로그인 실패" }),
      {
        status: 401,
      }
    );
  }
  const user = rows[0]; // 여기 꼭 추가
  return new Response(
    JSON.stringify({
      success: true,
      users: {
        id: user.id,
        email: user.email,
        name: user.name, // name 컬럼이 있다면
      },
    }),
    { status: 200 }
  );
}

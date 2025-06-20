// src/app/api/login/route.js
import { db } from "@/lib/db";

// POST 요청 처리
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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

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

// OPTIONS 요청 처리 (CORS preflight)
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

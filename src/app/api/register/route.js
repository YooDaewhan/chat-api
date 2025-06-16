import { db } from "@/lib/db";

export async function POST(req) {
  const { email, password } = await req.json();

  // 입력값 유효성 검사
  if (!email || !password) {
    return new Response(
      JSON.stringify({ success: false, message: "값이 누락됨" }),
      {
        status: 400,
      }
    );
  }

  // 이메일 중복 검사
  const [existing] = await db.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0) {
    return new Response(
      JSON.stringify({ success: false, message: "이미 존재하는 이메일" }),
      {
        status: 409,
      }
    );
  }

  // 회원 등록
  await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
    email,
    password,
  ]);

  return new Response(
    JSON.stringify({ success: true, message: "회원가입 성공" }),
    {
      status: 201,
    }
  );
}

// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("🌐 미들웨어 실행됨: ", req.nextUrl.pathname); // ✅ 꼭 있어야 함

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return res;
}

export const config = {
  matcher: "/api/:path*",
};

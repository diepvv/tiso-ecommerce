// import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export default async function middleware(req: NextRequest) {
  const sessionCartId = req.cookies.get("sessionCartId")?.value;
//   const session = await auth();

  if (!sessionCartId) {
    const newSessionCartId = randomUUID();
    console.log("Tạo sessionCartId mới:", newSessionCartId);

    const response = NextResponse.next();
    response.cookies.set("sessionCartId", newSessionCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

//   if (!session) {
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

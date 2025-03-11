// import { handlers } from "@/auth";
// export const { GET, POST } = handlers;
import { authOptions } from "@/auth";
import NextAuth from "next-auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest, ctx: any) => {
  // Read the original host from the Hostinger proxy, fallback to standard host
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host");
  
  if (host) {
    const protocol = req.headers.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https");
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
  }
  
  return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };

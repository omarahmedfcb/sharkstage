// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const authCookie = req.cookies.get("authUser");
  if (pathname == "/sign") {
    return NextResponse.redirect(`${origin}/sign/in`);
  }

  if (authCookie && pathname.startsWith("/sign")) {
    return NextResponse.redirect(`${origin}/`);
  }

  if (!authCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(`${origin}/sign/in`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign", "/sign/:path*", "/dashboard/:path*"],
};

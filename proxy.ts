import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/vi", request.url));
  }

  const firstSegment = pathname.split("/")[1];
  const locale = firstSegment === "en" ? "en" : "vi";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-kaios-locale", locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


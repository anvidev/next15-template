import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export async function middleware(request: NextRequest) {
// const handleI18nRouting = createMiddleware(routing);
// const response = handleI18nRouting(request);

// const session = await auth.api.getSession({
//   headers: await headers(),
// });
//
// if (!session) {
//   return NextResponse.redirect(new URL("/sign-in", request.url));
// }

//   return NextResponse.next();
// }

// export const config = {
//   runtime: "nodejs",
//   matcher: ["/", "/(de|en)/:path*"],
// };

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

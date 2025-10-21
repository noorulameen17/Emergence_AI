import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  ignoredRoutes: ["/((?!api|trpc))(_next|.+..+)(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|api|trpc).*)", "/"],
};

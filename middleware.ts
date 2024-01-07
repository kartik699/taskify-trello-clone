import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: ["/", "/api/webhook"],
    afterAuth(auth, req) {
        // if user is signed in and on a public route, redirect to org selection or org page and not on public route
        if (auth.userId && auth.isPublicRoute) {
            let path = "/select-org";

            if (auth.orgId) {
                path = `/organization/${auth.orgId}`;
            }

            const orgSelection = new URL(path, req.url);

            return NextResponse.redirect(orgSelection);
        }

        // if user is not signed in, redirect to sign in
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        // if user doesn't have an org, redirect to org selection
        if (
            auth.userId &&
            !auth.orgId &&
            req.nextUrl.pathname !== "/select-org"
        ) {
            const orgSelection = new URL("/select-org", req.url);
            return NextResponse.redirect(orgSelection);
        }
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

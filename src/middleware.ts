// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = url.searchParams.get("access");
    const cookie = req.cookies.get("expo-access")?.value;

    // When the QR param is present and correct:
    if (token && token === process.env.EXPO_ACCESS_TOKEN) {
        console.log("✅ Token match, setting cookie...");
        const res = NextResponse.redirect(`${url.origin}${url.pathname}`);

        res.cookies.set({
            name: "expo-access",
            value: "true",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            secure: false,
        });
        return res;
    }

    // If cookie already present, just proceed
    if (cookie === "true") {
        return NextResponse.next();
    }

    // Default – continue as normal
    return NextResponse.next();
}

// Apply only to your order route
export const config = {
    matcher: ["/exhibitor/order", "/exhibitor/order/:path*"],
};

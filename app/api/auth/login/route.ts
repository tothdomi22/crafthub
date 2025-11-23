import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await response.json();

    // Check if login was successful AND cookies were set
    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    const setCookieHeaders = response.headers.getSetCookie();

    // Verify JWT cookie exists in response
    const hasJwtCookie = setCookieHeaders.some(
      cookie =>
        cookie.startsWith("accessToken=") && !cookie.includes("accessToken=;"),
    );

    if (!hasJwtCookie) {
      console.error("Login succeeded but JWT cookie was not set");
      return NextResponse.json(
        {detail: "Authentication failed - no session created"},
        {status: 500},
      );
    }

    // Create Next.js response
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward ALL Set-Cookie headers from FastAPI
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

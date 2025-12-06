import {NextResponse} from "next/server";

export async function POST() {
  try {
    // Call FastAPI logout endpoint
    const response = await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
      method: "POST",
    });

    const data = await response.json();

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

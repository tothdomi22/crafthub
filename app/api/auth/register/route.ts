import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    const {email, password} = JSON.parse(body);

    const loginResponse = await fetch(
      `${process.env.API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      },
    );

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json(loginData, {status: loginResponse.status});
    }

    // Get cookies from login response
    const setCookieHeaders = loginResponse.headers.getSetCookie();

    // Verify JWT cookie exists
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

    // Create response with login data (or registration data, your choice)
    const nextResponse = NextResponse.json(loginData, {
      status: 200,
    });

    // Forward ALL Set-Cookie headers from login
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

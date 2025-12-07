import {NextResponse} from "next/server";

export async function DELETE(request: Request) {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });
    return nextResponse;
  } catch (error) {
    console.error("Error deleting a user:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

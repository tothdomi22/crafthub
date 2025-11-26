import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      `${process.env.API_BASE_URL}/admin/main-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        body: body,
      },
    );

    const data = await response.json();

    // Check if login was successful AND cookies were set
    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    // Create Next.js response

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error during main category creation:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

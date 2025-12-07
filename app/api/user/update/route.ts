import {NextResponse} from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        {detail: "You must provide a body"},
        {status: 400},
      );
    }

    const response = await fetch(`${process.env.API_BASE_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error updating a user:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

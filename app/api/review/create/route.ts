import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const {searchParams} = new URL(request.url);
    const purchaseRequestId = Number(searchParams.get("purchaseRequestId"));
    if (!purchaseRequestId) {
      return NextResponse.json(
        {message: "Missing required query parameter"},
        {status: 400},
      );
    }
    if (!body) {
      return NextResponse.json(
        {detail: "You must provide a body"},
        {status: 400},
      );
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/review/${purchaseRequestId}`,
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

    if (!response.ok) {
      return NextResponse.json(data, {status: response.status});
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

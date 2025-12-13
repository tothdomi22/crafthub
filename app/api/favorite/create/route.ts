import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const listingId = Number(searchParams.get("listingId"));
    if (!listingId) {
      return NextResponse.json(
        {message: "Missing required query parameter"},
        {status: 400},
      );
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/favorite/${listingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
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
    console.error("Error creating a favorite:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

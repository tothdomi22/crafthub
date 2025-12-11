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
    const backendUrl = `${process.env.API_BASE_URL}/purchase-request/${listingId}`;
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {message: errorData.message || "Failed to create purchase request"},
        {status: response.status},
      );
    }
    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error("Error creating purchase request:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

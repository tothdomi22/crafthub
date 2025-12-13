import {NextResponse} from "next/server";

export async function DELETE(request: Request) {
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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {message: errorData.message || "Favorite deletion failed"},
        {status: response.status},
      );
    }

    if (response.status === 204) {
      return NextResponse.json({status: 204});
    }

    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error("Error deleting a favorite:", error);
    return NextResponse.json({detail: "Internal server error"}, {status: 500});
  }
}

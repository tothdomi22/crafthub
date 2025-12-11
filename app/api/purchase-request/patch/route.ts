import {NextResponse} from "next/server";

export async function PATCH(request: Request) {
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
    const backendUrl = `${process.env.API_BASE_URL}/purchase-request/${purchaseRequestId}`;
    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type":
          request.headers.get("content-type") || "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: body,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {message: errorData.message || "Failed to patch purchase request"},
        {status: response.status},
      );
    }
    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error("Error patching purchase request:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

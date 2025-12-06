import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const backendUrl = `${process.env.API_BASE_URL}/conversation/list`;
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {message: errorData.message || "Failed to get conversations"},
        {status: response.status},
      );
    }
    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error("Error getting conversations:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

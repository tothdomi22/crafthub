import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const page = searchParams.get("page");
    if (!id || !page) {
      return NextResponse.json(
        {message: "Missing required query parameter"},
        {status: 400},
      );
    }
    const backendUrl = `${process.env.API_BASE_URL}/listing/list/${id}?page=${page}`;
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
        {message: errorData.message || "Failed to list listing by id"},
        {status: response.status},
      );
    }
    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error("Error listing listing by id:", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}

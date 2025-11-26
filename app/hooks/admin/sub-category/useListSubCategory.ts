export default async function () {
  const response = await fetch("/api/admin/sub-category/list", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

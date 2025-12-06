export default async function useListMyListings() {
  const response = await fetch("/api/listing/my-list", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

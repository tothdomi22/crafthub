export default async function useListListings() {
  const response = await fetch("/api/listing/list", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

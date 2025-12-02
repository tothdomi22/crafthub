export default async function useListListingById(id: string) {
  const response = await fetch(`/api/listing/list-by-id?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

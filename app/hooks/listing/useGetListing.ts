export default async function useGetListing(id: string) {
  const response = await fetch(`/api/listing/get?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

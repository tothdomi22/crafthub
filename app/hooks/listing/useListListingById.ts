export default async function useListListingById(
  id: string,
  pageParam: number,
) {
  const response = await fetch(
    `/api/listing/list-by-id?id=${id}&page=${pageParam}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

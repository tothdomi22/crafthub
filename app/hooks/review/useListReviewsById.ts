export default async function useListReviewsById(id: string | number) {
  const response = await fetch(`/api/review/list-by-id?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

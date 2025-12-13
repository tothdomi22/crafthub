export default async function useListFavorite() {
  const response = await fetch("/api/favorite/list", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

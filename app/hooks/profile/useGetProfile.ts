export default async function useGetProfile(id: string | number) {
  const response = await fetch(`/api/profile/get?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

export default async function useListUnread() {
  const response = await fetch("/api/notification/list-unread", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

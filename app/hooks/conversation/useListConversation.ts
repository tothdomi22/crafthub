export default async function useListConversation() {
  const response = await fetch("/api/conversation/list", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

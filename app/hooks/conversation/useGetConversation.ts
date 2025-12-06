export default async function getConversation(id: string) {
  const response = await fetch(`/api/conversation/get?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

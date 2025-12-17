export default async function getConversation(id: string | number) {
  const response = await fetch(`/api/conversation/get?id=${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}

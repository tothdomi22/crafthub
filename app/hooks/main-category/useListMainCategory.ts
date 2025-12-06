const useListMainCategory = async () => {
  const response = await fetch("/api/main-category/list", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export default useListMainCategory;

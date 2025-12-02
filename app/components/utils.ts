export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

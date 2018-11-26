export default {
  formatDate,
};

function formatDate(d) {
  const date = new Date(d);
  return `${date.toLocaleDateString()} à ${date.toLocaleTimeString()}`;
}

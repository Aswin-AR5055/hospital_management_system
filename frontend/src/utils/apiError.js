export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.join(", ");
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  const firstValue = Object.values(data)[0];

  if (Array.isArray(firstValue)) {
    return firstValue.join(", ");
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}

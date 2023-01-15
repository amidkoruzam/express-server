export const apiResponse = (data, error) => ({
  data,
  error,
  type: Boolean(error) ? "error" : "success",
});

export const handleErrors = response => {
  if(!response.ok) {
    return Promise.reject(response.status);
  }
  let jsonContentType = response.headers
    && response.headers.get("Content-Type")
    && response.headers.get("Content-Type").includes("json");
  return jsonContentType ? response.json() : Promise.resolve();
}

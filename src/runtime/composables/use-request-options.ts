export function useRequestOptions() {
  let headers: Record<string, string> = {};
  const setHeaders = (newHeaders: Record<string, string>) => {
    headers = newHeaders;
  };
  const getHeaders = () => {
    return headers;
  };

  return {
    getHeaders,
    headers,
    setHeaders,
  };
}

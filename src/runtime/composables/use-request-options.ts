import { ref } from 'vue';

const headers = ref<Record<string, string>>({});

export function useRequestOptions() {
  const setHeaders = (newHeaders: Record<string, string>) => {
    headers.value = newHeaders;
  };

  return {
    headers,
    setHeaders,
  };
}

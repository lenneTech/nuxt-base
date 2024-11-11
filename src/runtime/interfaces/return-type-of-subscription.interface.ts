import type { Ref } from 'vue';

export interface ReturnTypeOfSubscription<T> {
  data: Ref<T | null>;
  error: Ref<null | string>;
  loading: Ref<boolean>;
  start: () => void;
  stop: () => void;
}

import type { Ref } from 'vue';

export interface ReturnTypeOfSubscription<T> {
  data: Ref<null | T>;
  error: Ref<null | string>;
  loading: Ref<boolean>;
  start: () => void;
  stop: () => void;
}

import { defineStore, ref } from "#imports";
import { Helper } from "../../classes/helper.class";

export const useSchemaStore = defineStore("schema", () => {
  const schema = ref<any>(null);

  function setValue(v: any) {
    schema.value = Helper.deepFreeze(JSON.parse(JSON.stringify(v)));
  }

  return { schema, setValue };
});

import { defineStore, ref } from "#imports";

export const useSchemaStore = defineStore("schema", () => {
  // Refs
  const schema = ref<string>(null);

  function setSchema(newSchema: string) {
    schema.value = JSON.stringify(newSchema);
  }

  return {
    schema,
    setSchema,
  };
});

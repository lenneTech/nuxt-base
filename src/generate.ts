import { generate } from "@graphql-codegen/cli";
import { Types } from "@graphql-codegen/plugin-helpers";

export default async function generateGraphQLTypes(schemaUrl: string) {
  const config: Types.Config = {
    schema: schemaUrl,
    ignoreNoDocuments: true,
    generates: {
      [process.cwd() + "/src/types/schema.d.ts"]: {
        plugins: ["typescript"],
      },
    },
  };

  return await generate(config, false);
}

export async function generateComposables() {
  // get all queries and mutations and subscriptions
  // Create composables
}

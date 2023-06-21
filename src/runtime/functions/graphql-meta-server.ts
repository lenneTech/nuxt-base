import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { addTemplate, findPath, tryUseNuxt } from "@nuxt/kit";
import {
  GraphQLSchema,
  buildClientSchema,
  getIntrospectionQuery,
} from "graphql";
import { readFile } from "node:fs/promises";
import { ofetch } from "ofetch";
import { GraphQLMeta } from "../classes/graphql-meta.class";

export async function getSchemaByIntrospection(uri: string) {
  const { data } = await ofetch(uri, {
    method: "POST",
    body: JSON.stringify({
      query: getIntrospectionQuery({ descriptions: false }),
      variables: {},
    }),
  });

  return data;
}

export async function getSchemaServer(
  source: string,
  forceCreate = false
): Promise<GraphQLSchema> {
  let schema;
  const nuxt = tryUseNuxt();

  console.log("getSchemaServer", source);

  if (
    await findPath(`base/schema.json`, { cwd: nuxt.options.buildDir }, "file")
  ) {
    const file = (
      await readFile(nuxt.options.buildDir + `/base/schema.json`)
    ).toString();
    schema = new GraphQLSchema(JSON.parse(file));
  } else if (source.startsWith("http")) {
    const result = await getSchemaByIntrospection(source);
    schema = buildClientSchema(result);
  } else {
    schema = await loadSchema(source, {
      loaders: [new GraphQLFileLoader()],
    });
  }

  console.log(schema);

  if (!(await findPath(`base/schema.json`))) {
    addTemplate({
      write: true,
      filename: `base/schema.json`,
      getContents: () => JSON.stringify(schema) || "",
    });
  }

  return schema;
}

export async function getMetaServer(schemaPath: string): Promise<GraphQLMeta> {
  const schema = await getSchemaServer(schemaPath);

  // Return result
  return new GraphQLMeta(schema);
}

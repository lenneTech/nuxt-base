import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { ofetch } from 'ofetch';
import { GraphQLMeta } from '../classes/graphql-meta.class';

export async function loadMeta(
  config: Partial<{ public: { host: string; schema?: string } }>,
): Promise<GraphQLMeta> {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  return new Promise(async (resolve, reject) => {
    const { data: result } = await ofetch(config.public.host, {
      method: 'POST',
      body: JSON.stringify({
        query: getIntrospectionQuery({ descriptions: false }),
        variables: {},
      }),
      signal: controller.signal,
      onRequestError: (e) => {
        reject(e);
      },
    });

    const schema = buildClientSchema(result);

    resolve(new GraphQLMeta(schema));
  });
}

export async function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

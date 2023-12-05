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

/**
 * Hash a string with SHA-256
 * see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function hash(string: string): Promise<string> {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

/**
 * Hash passwords in object
 * All (deep) entries with the key 'password' and a string as value are hashed
 */
export async function hashPasswords<T = unknown>(element: T): Promise<T> {
  if (Array.isArray(element)) {
    return await Promise.all(element.map((item) => hashPasswords(item)));
  } else if (typeof element === 'object') {
    for (const [key, value] of Object.entries(element)) {
      if (key === 'password' && value && typeof value === 'string') {
        element[key] = await hash(value);
      } else {
        element[key] = await hashPasswords(value);
      }
    }
  }
  return element;
}

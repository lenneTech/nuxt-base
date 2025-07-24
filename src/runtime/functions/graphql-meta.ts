import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { sha256 } from 'js-sha256';
import { ofetch } from 'ofetch';

import type { GraphQLMeta } from '../../generate';

import { useGraphQLMeta } from '../composables/use-graphql-meta';

/**
 * Hash a string with SHA-256
 */
export async function hash(string: string): Promise<string> {
  return sha256(string);
}

/**
 * Hash passwords in object
 * All (deep) entries with the key 'password' and a string as value are hashed
 */
export async function hashPasswords<T = unknown>(element: T): Promise<T> {
  if (!element) {
    return element;
  } else if (Array.isArray(element)) {
    return (await Promise.all(element.map((item) => hashPasswords(item)))) as T;
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

export async function loadMeta(config: Partial<{ public: { host: string; schema?: string } }>): Promise<GraphQLMeta> {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  return new Promise(async (resolve, reject) => {
    const { data: result } = await ofetch(config.public?.gqlHost, {
      body: JSON.stringify({
        query: getIntrospectionQuery({ descriptions: false }),
        variables: {},
      }),
      method: 'POST',
      onRequestError: (e) => {
        reject(e);
      },
      signal: controller.signal,
    });

    const schema = buildClientSchema(result);

    resolve(useGraphQLMeta(schema));
  });
}

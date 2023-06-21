import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import { ofetch } from "ofetch";
import { GraphQLMeta } from "../classes/graphql-meta.class";
import { GraphQLType } from "../classes/graphql-type.class";
import { Helper } from "../classes/helper.class";
import { GraphQLEnum } from "../enums/graphql-enum.class";

export async function loadMeta(
  config: Partial<{ public: { host: string; schema?: string } }>
) {
  let schema;

  if (!config.public.schema) {
    const { data: result } = await ofetch(config.public.host, {
      method: "POST",
      body: JSON.stringify({
        query: getIntrospectionQuery({ descriptions: false }),
        variables: {},
      }),
    });

    schema = buildClientSchema(result);
  } else {
    schema = await loadSchema(config.public.schema, {
      loaders: [new GraphQLFileLoader()],
    });
  }

  return new GraphQLMeta(schema);
}

/**
 * Prepare arguments for GraphQL request
 */
export async function prepareArguments(
  args: any,
  options: {
    allowed?: GraphQLType;
    level?: number;
    levelKey?: string;
    parent?: string;
    schemaArgs?: string[];
    usedArgs?: string[];
    variables?: { [key: string]: { type: string; value: any } };
  } = {}
): Promise<{
  argsString: string;
  schemaArgs: string[];
  usedArgs: string[];
  variables: { [key: string]: { type: string; value: any } };
}> {
  // Init config variables
  const { allowed, levelKey, level, parent, schemaArgs, usedArgs, variables } =
    {
      allowed: null,
      levelKey: "",
      level: 1,
      parent: "",
      schemaArgs: [],
      usedArgs: [],
      variables: {},
      ...options,
    };

  // Check args
  if (args === undefined || args === null) {
    return { argsString: "", schemaArgs, usedArgs, variables };
  }

  // Init args
  const result = [];

  // Process array
  if (Array.isArray(args)) {
    const allowedKeys = allowed ? Object.keys(allowed.fields) : null;
    for (const item of args) {
      let key = null;
      if (allowed) {
        if (!allowedKeys || allowedKeys.length < 1) {
          break;
        }
        key = allowedKeys.shift();
      }

      // Process value
      result.push(
        (
          await prepareArguments(item, {
            allowed: key ? allowed.fields[key] : null,
            levelKey: key,
            level: level + 1,
            parent: parent + key + ".",
            schemaArgs,
            usedArgs,
            variables,
          })
        ).argsString
      );
    }

    // Encapsulation of the array result
    if (result.length) {
      // Complete result, encapsulated via round brackets
      if (level === 1) {
        return {
          argsString: "(" + result.join(", ") + ")",
          schemaArgs,
          usedArgs,
          variables,
        };
      }

      // Deeper result part, encapsulated via square brackets
      else {
        return {
          argsString: "[" + result.join(", ") + "]",
          schemaArgs,
          usedArgs,
          variables,
        };
      }
    }
  }

  // Process object
  else if (typeof args === "object") {
    // Check for Upload type for variable handling
    if (allowed?.type === "Upload") {
      const name = levelKey + "_" + Helper.getUID(6);
      variables[name] = {
        type: allowed.type + (allowed.isRequired ? "!" : ""),
        value: args,
      };
      return { argsString: "$" + name, schemaArgs, usedArgs, variables };
    }

    // Check object is empty
    if (
      args &&
      Object.keys(args).length === 0 &&
      Object.getPrototypeOf(args) === Object.prototype
    ) {
      return { argsString: "{}", schemaArgs, usedArgs, variables };
    }

    // Process all object entries
    for (const [key, value] of Object.entries(args)) {
      // Init data for current entry
      const currentKey = parent + key;
      schemaArgs.push(currentKey);

      // If the allowed key handling is enabled and the current key is not included in the list of allowed keys,
      // the current key will be skipped
      if (allowed && !allowed.fields[key]) {
        continue;
      }

      // Skip value if not exists
      if (value === undefined) {
        continue;
      }

      // Set null e.g. for resetting
      if (value === null) {
        result.push(key + ":" + null);
        continue;
      }

      // Add current key to metadata
      usedArgs.push(currentKey);

      // Process GraphQLEnum
      if (value instanceof GraphQLEnum) {
        result.push(key + ":" + value.value);
        continue;
      }

      if (key === "password") {
        result.push(key + ":" + `"${await hash(value as string)}"`);
        continue;
      }

      // Process array
      else if (Array.isArray(value)) {
        let argumentsString: string = key + ": [";
        for (const val of value) {
          argumentsString += (
            await prepareArguments(val, {
              allowed: allowed.fields[key],
              levelKey: key,
              level: level + 1,
              parent: currentKey + ".",
              schemaArgs,
              usedArgs,
              variables,
            })
          ).argsString;
        }
        argumentsString += "]";
        result.push(argumentsString);
        continue;
      }

      // Prepare additional result string
      let additionalResult = key + ": ";

      // Value is a date object
      if (
        typeof value === "object" &&
        Object.prototype.toString.call(value) === "[object Date]"
      ) {
        additionalResult += `"""${(value as Date).toString()}"""`;
      }

      // Value is a string
      else if (typeof value === "string") {
        // Enum (doesn't need quotation marks)
        if (allowed.fields[key].isEnum) {
          additionalResult += value;
        }

        // String
        else {
          additionalResult += `"${value
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")}"`;
        }
      }

      // Value is a simple boolean or a number
      else if (typeof value === "boolean" || typeof value === "number") {
        additionalResult += value;
      }

      // Others
      else {
        const prepareOptions = {
          allowed: allowed.fields[key],
          levelKey: key,
          level: level + 1,
          parent: currentKey + ".",
          schemaArgs,
          usedArgs,
          variables,
        };
        try {
          additionalResult += (await prepareArguments(value, prepareOptions))
            .argsString;
        } catch (e) {
          console.error(
            "Error during preparing arguments",
            value,
            prepareOptions
          );
          throw e;
        }
      }

      // Push deeper part into result array
      result.push(additionalResult);
    }

    // Encapsulation of the object result
    if (result.length) {
      // Complete result, encapsulated via round brackets
      if (level === 1) {
        return {
          argsString: "(" + result.join(", ") + ")",
          schemaArgs,
          usedArgs,
          variables,
        };
      }

      // Deeper result part, encapsulated via curly brackets
      else {
        return {
          argsString: "{" + result.join(", ") + "}",
          schemaArgs,
          usedArgs,
          variables,
        };
      }
    }
  }

  // Prepare and process other / unknown values as JSON
  else {
    return {
      argsString: JSON.stringify(args),
      schemaArgs,
      usedArgs,
      variables,
    };
  }
}

/**
 * Prepare fields for GraphQL request
 */
export async function prepareFields(
  fields: any,
  options: {
    allowed?: GraphQLType;
    schemaFields?: string[];
    usedFields?: string[];
    parent?: string;
    spaces?: number;
    tab?: number;
  } = {}
): Promise<{
  schemaFields: string[];
  fieldsString: string;
  usedFields: string[];
}> {
  // Config
  const { allowed, parent, schemaFields, spaces, tab, usedFields } = {
    allowed: null,
    parent: "",
    schemaFields: [],
    spaces: 2,
    tab: 1,
    usedFields: [],
    ...options,
  };

  // Init fields string
  let fieldsString = "";

  // Check fields
  if (!fields) {
    return { fieldsString, schemaFields, usedFields };
  }

  // Process string
  if (typeof fields === "string") {
    if (allowed && !allowed.fields[fields]) {
      return { fieldsString, schemaFields, usedFields };
    }
    return {
      fieldsString: "\n" + " ".repeat(spaces).repeat(tab) + fields,
      schemaFields,
      usedFields,
    };
  }

  // Process array
  else if (Array.isArray(fields)) {
    for (const item of fields) {
      if (typeof item === "object") {
        fieldsString =
          fieldsString +
          (
            await prepareFields(item, {
              allowed, // item is object or array
              parent,
              spaces,
              schemaFields,
              tab: tab + 1,
              usedFields,
            })
          ).fieldsString;
        continue;
      }
      const currentPath = parent + item;
      schemaFields.push(currentPath);
      if (allowed && !allowed.fields[item]) {
        continue;
      }
      usedFields.push(currentPath);
      fieldsString =
        fieldsString +
        (
          await prepareFields(item, {
            allowed: null, // item is string
            parent: currentPath + ".",
            spaces,
            schemaFields,
            tab: tab + 1,
            usedFields,
          })
        ).fieldsString;
    }
  }

  // Process object
  else if (typeof fields === "object") {
    for (const [key, val] of Object.entries(fields)) {
      const currentPath = parent + key;
      schemaFields.push(currentPath);
      if (allowed && !allowed.fields[key]) {
        continue;
      }
      usedFields.push(currentPath);
      if (typeof val !== "object" || !Object.keys(val).length) {
        fieldsString =
          fieldsString + "\n" + " ".repeat(spaces).repeat(tab) + key;
      } else {
        fieldsString =
          fieldsString +
          "\n" +
          " ".repeat(spaces).repeat(tab) +
          key +
          " " +
          "{" +
          (
            await prepareFields(val, {
              allowed: allowed.fields[key], // val is object or array
              parent: currentPath + ".",
              spaces,
              schemaFields,
              tab: tab + 1,
              usedFields,
            })
          ).fieldsString +
          "\n" +
          " ".repeat(spaces).repeat(tab) +
          "}";
      }
    }
  }

  // Return result
  return { fieldsString, schemaFields, usedFields };
}

export async function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function graphQLTypeToStringArray(
  graphQLType: GraphQLType,
  current = "",
  result = [],
  cacheNode = []
) {
  if (!graphQLType) {
    return result;
  }
  if (current?.includes(".")) {
    cacheNode.push(current.split(".")[1]);
  } else if (current) {
    cacheNode.push(current);
  }
  for (const key of Object.keys(graphQLType.fields)) {
    if (current === key || cacheNode.includes(key)) {
      continue;
    }
    graphQLTypeToStringArray(
      graphQLType.fields[key],
      current ? current + "." + key : key,
      result,
      cacheNode
    );
  }
  return result;
}

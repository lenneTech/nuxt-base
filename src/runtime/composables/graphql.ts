import { IGraphQLOptions } from "../../interfaces/graphql-options.interface";

const config = useRuntimeConfig()

export async function useGraphQL(
  method: string,
  options: IGraphQLOptions = {}
) {
    console.log('bifi');
//   // Check parameters
//   if (!method) {
//     return;
//   }

//   // Get config
//   const config = {
//     arguments: null,
//     fields: null,
//     log: false,
//     model: null,
//     ...options,
//   };

//   // Convert class to Object for arguments
//   if (typeof config.arguments === "function") {
//     config.arguments = new config.arguments();
//   }

//   // Convert class to Object for fields
//   if (typeof config.fields === "function") {
//     config.fields = new config.fields();
//   }

//   // Log
//   if (config.log) {
//     console.log({ config });
//   }

//   // Get meta
//   const meta = await getMeta(config.graphqlHost);
//   // Set GraphQLRequestType automatically
//   if (!config.type) {
//     const types = meta.getRequestTypesViaMethod(method);
//     if (!types?.length) {
//       console.log("No GraphQLRequestType detected");
//       return;
//     }
//     config.type = types[0] as GraphQLRequestType;
//     if (config.type) {
//       console.log("No GraphQLRequestType detected");
//       return;
//     }
//     if (types.length > 1) {
//       // eslint-disable-next-line no-console
//       console.debug(
//         "GraphQLRequestType " + config.type + " used for " + method,
//         types
//       );
//     }
//   }

//   // Prepare fields
//   let fields;
//   let allowedFields;

//   // Log meta
//   if (config.log) {
//     console.log({ meta });
//   }

//   if (config.fields) {
//     allowedFields = meta.getFields(method, { type: config.type });

//     // Log meta
//     if (config.log) {
//       console.log({ allowedFields });
//     }

//     const fieldsData = this.prepareFields(config.fields, {
//       allowed: allowedFields,
//     });

//     fields = fieldsData.fieldsString;
//   }

//   if (fields && !fields.startsWith("{")) {
//     fields = "{" + fields + "\n}";
//   }

//   // Log fields
//   if (config.log) {
//     console.log({ fields });
//   }

//   // Get allowed args
//   const allowedArgs = meta.getArgs(method, { type: config.type });

//   // Log allowed args
//   if (config.log) {
//     console.log({ allowedArgs });
//   }

//   const argsData = await prepareArguments(config.arguments, {
//     allowed: allowedArgs,
//   });

//   // Log args data
//   if (config.log) {
//     argsData.usedArgs.sort();
//     argsData.schemaArgs.sort();
//     const filtered = argsData.schemaArgs.filter(
//       (field) => !argsData.usedArgs.includes(field)
//     );
//     const unused = this.graphQLTypeToStringArray(allowedArgs)
//       .sort()
//       .filter((field) => !argsData.usedArgs.includes(field));
//     console.log({ argsData, filtered, unused });
//   }

//   let args = argsData?.argsString || "";
//   if (args === "{}") {
//     args = "";
//   }

//   // Log
//   if (config.log) {
//     console.log({ graphQL: method, args, fields, type: config.type });
//   }

//   // Prepare request
//   const request: any = {};

//   // Prepare GraphQL
//   const gQlFuncBody = fields
//     ? " {\n" + method + args + fields + "\n}"
//     : " {\n" + method + args + "\n}";
//   let gQlBody = config.type + gQlFuncBody;

//   // Handling for variables (e.g. for file uploads)
//   if (Object.keys(argsData.variables).length) {
//     // Preparations
//     request.variables = {};
//     let multipart = false;

//     // Add surrounding
//     gQlBody = config.type + " Request(";
//     for (const [key, item] of Object.entries(argsData.variables)) {
//       gQlBody += "\n$" + key + ":" + item.type + ",";
//       request.variables[key] = item.value;
//       if (item.type.startsWith("Upload")) {
//         multipart = true;
//       }
//     }
//     gQlBody = gQlBody.slice(0, -1) + "\n)" + gQlFuncBody;

//     // Set Multipart
//     if (multipart) {
//       request.context = {
//         useMultipart: true,
//       };
//     }
//   }
//   const documentNode = gql(gQlBody);

//   // Log
//   if (config.log) {
//     console.log({ documentNode });
//   }

//   // Set document node
//   request[config.type] = documentNode;

//   // Log
//   if (config.log) {
//     console.log({ request });
//   }

//   let func;
//   if (config.type === GraphQLRequestType.MUTATION) {
//     func = "mutate";
//     request[config.type] = documentNode;
//   } else if (config.type === GraphQLRequestType.SUBSCRIPTION) {
//     func = "subscribe";
//     request.query = documentNode;
//   } else {
//     func = config.type;
//     request[config.type] = documentNode;
//   }

//   let data;
//   switch (config.type) {
//     case GraphQLRequestType.MUTATION:
//       data = await useMutation(request.mutate, request.variables);
//       break;
//     case GraphQLRequestType.SUBSCRIPTION:
//       data = await useSubscription(request.query, request.variables);
//       break;
//     case GraphQLRequestType.QUERY:
//       data = await useQuery(request.query, request.variables);
//       break;
//   }

//   return data;
}
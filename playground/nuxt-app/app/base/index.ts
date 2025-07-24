import type { InputFields } from '#base-types/fields';
import type { AsyncData, AsyncDataOptions } from 'nuxt/app';

import { type GraphqlError, type ReturnTypeOfSubscription, gqlAsyncQuery, gqlMutation, gqlQuery, gqlSubscription } from '#imports';

import type {
  Auth,
  AuthSignInInput,
  AuthSignUpInput,
  CoreAuthModel,
  CoreHealthCheckResult,
  FileInfo,
  FilterInput,
  FindAndCountTodosResult,
  FindAndCountUsersResult,
  Meta,
  SortInput,
  Todo,
  TodoCreateInput,
  TodoInput,
  User,
  UserCreateInput,
  UserInput,
} from './default';

export const useHealthCheckQuery = (fields?: InputFields<CoreHealthCheckResult>[] | null, log?: boolean): Promise<{ data: CoreHealthCheckResult; error: GraphqlError | null }> =>
  gqlQuery<CoreHealthCheckResult>('healthCheck', { fields, log });
export const useAsyncHealthCheckQuery = (
  fields?: InputFields<CoreHealthCheckResult>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<CoreHealthCheckResult, Error>> => gqlAsyncQuery<CoreHealthCheckResult>('healthCheck', { asyncDataOptions, fields, log });
export const useFindAndCountUsersQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<FindAndCountUsersResult>[] | null,
  log?: boolean,
): Promise<{ data: FindAndCountUsersResult; error: GraphqlError | null }> => gqlQuery<FindAndCountUsersResult>('findAndCountUsers', { fields, log, variables });
export const useAsyncFindAndCountUsersQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<FindAndCountUsersResult>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<FindAndCountUsersResult, Error>> => gqlAsyncQuery<FindAndCountUsersResult>('findAndCountUsers', { asyncDataOptions, fields, log, variables });
export const useFindUsersQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<User>[] | null,
  log?: boolean,
): Promise<{ data: User[]; error: GraphqlError | null }> => gqlQuery<User[]>('findUsers', { fields, log, variables });
export const useAsyncFindUsersQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<User>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<User[], Error>> => gqlAsyncQuery<User[]>('findUsers', { asyncDataOptions, fields, log, variables });
export const useGetUserQuery = (variables: { id: string }, fields?: InputFields<User>[] | null, log?: boolean): Promise<{ data: User; error: GraphqlError | null }> =>
  gqlQuery<User>('getUser', { fields, log, variables });
export const useAsyncGetUserQuery = (
  variables: { id: string },
  fields?: InputFields<User>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<User, Error>> => gqlAsyncQuery<User>('getUser', { asyncDataOptions, fields, log, variables });
export const useGetVerifiedStateQuery = (variables: { token: string }, log?: boolean): Promise<{ data: boolean; error: GraphqlError | null }> =>
  gqlQuery<boolean>('getVerifiedState', { fields: null, log, variables });
export const useAsyncGetVerifiedStateQuery = (variables: { token: string }, log?: boolean, asyncDataOptions?: AsyncDataOptions): Promise<AsyncData<boolean, Error>> =>
  gqlAsyncQuery<boolean>('getVerifiedState', { asyncDataOptions, fields: null, log, variables });
export const useRequestPasswordResetMailQuery = (variables: { email: string }, log?: boolean): Promise<{ data: boolean; error: GraphqlError | null }> =>
  gqlQuery<boolean>('requestPasswordResetMail', { fields: null, log, variables });
export const useAsyncRequestPasswordResetMailQuery = (variables: { email: string }, log?: boolean, asyncDataOptions?: AsyncDataOptions): Promise<AsyncData<boolean, Error>> =>
  gqlAsyncQuery<boolean>('requestPasswordResetMail', { asyncDataOptions, fields: null, log, variables });
export const useGetMetaQuery = (fields?: InputFields<Meta>[] | null, log?: boolean): Promise<{ data: Meta; error: GraphqlError | null }> =>
  gqlQuery<Meta>('getMeta', { fields, log });
export const useAsyncGetMetaQuery = (fields?: InputFields<Meta>[] | null, log?: boolean, asyncDataOptions?: AsyncDataOptions): Promise<AsyncData<Meta, Error>> =>
  gqlAsyncQuery<Meta>('getMeta', { asyncDataOptions, fields, log });
export const useGetFileInfoQuery = (
  variables: { filename: string },
  fields?: InputFields<FileInfo>[] | null,
  log?: boolean,
): Promise<{ data: FileInfo; error: GraphqlError | null }> => gqlQuery<FileInfo>('getFileInfo', { fields, log, variables });
export const useAsyncGetFileInfoQuery = (
  variables: { filename: string },
  fields?: InputFields<FileInfo>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<FileInfo, Error>> => gqlAsyncQuery<FileInfo>('getFileInfo', { asyncDataOptions, fields, log, variables });
export const useFindAndCountTodosQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<FindAndCountTodosResult>[] | null,
  log?: boolean,
): Promise<{ data: FindAndCountTodosResult; error: GraphqlError | null }> => gqlQuery<FindAndCountTodosResult>('findAndCountTodos', { fields, log, variables });
export const useAsyncFindAndCountTodosQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<FindAndCountTodosResult>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<FindAndCountTodosResult, Error>> => gqlAsyncQuery<FindAndCountTodosResult>('findAndCountTodos', { asyncDataOptions, fields, log, variables });
export const useFindTodosQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<Todo>[] | null,
  log?: boolean,
): Promise<{ data: Todo[]; error: GraphqlError | null }> => gqlQuery<Todo[]>('findTodos', { fields, log, variables });
export const useAsyncFindTodosQuery = (
  variables: { filter?: FilterInput; limit?: number; offset?: number; samples?: number; skip?: number; sort?: SortInput[]; take?: number },
  fields?: InputFields<Todo>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<Todo[], Error>> => gqlAsyncQuery<Todo[]>('findTodos', { asyncDataOptions, fields, log, variables });
export const useGetTodoQuery = (variables: { id: string }, fields?: InputFields<Todo>[] | null, log?: boolean): Promise<{ data: Todo; error: GraphqlError | null }> =>
  gqlQuery<Todo>('getTodo', { fields, log, variables });
export const useAsyncGetTodoQuery = (
  variables: { id: string },
  fields?: InputFields<Todo>[] | null,
  log?: boolean,
  asyncDataOptions?: AsyncDataOptions,
): Promise<AsyncData<Todo, Error>> => gqlAsyncQuery<Todo>('getTodo', { asyncDataOptions, fields, log, variables });
export const useLogoutMutation = (variables: { allDevices?: boolean }, log?: boolean): Promise<{ data: boolean; error: GraphqlError }> =>
  gqlMutation<boolean>('logout', { fields: null, log, variables });
export const useRefreshTokenMutation = (fields?: InputFields<CoreAuthModel>[] | null, log?: boolean): Promise<{ data: CoreAuthModel; error: GraphqlError }> =>
  gqlMutation<CoreAuthModel>('refreshToken', { fields, log });
export const useSignInMutation = (variables: { input: AuthSignInInput }, fields?: InputFields<Auth>[] | null, log?: boolean): Promise<{ data: Auth; error: GraphqlError }> =>
  gqlMutation<Auth>('signIn', { fields, log, variables });
export const useSignUpMutation = (variables: { input: AuthSignUpInput }, fields?: InputFields<Auth>[] | null, log?: boolean): Promise<{ data: Auth; error: GraphqlError }> =>
  gqlMutation<Auth>('signUp', { fields, log, variables });
export const useCreateUserMutation = (variables: { input: UserCreateInput }, fields?: InputFields<User>[] | null, log?: boolean): Promise<{ data: User; error: GraphqlError }> =>
  gqlMutation<User>('createUser', { fields, log, variables });
export const useDeleteUserMutation = (variables: { id: string }, fields?: InputFields<User>[] | null, log?: boolean): Promise<{ data: User; error: GraphqlError }> =>
  gqlMutation<User>('deleteUser', { fields, log, variables });
export const useResetPasswordMutation = (variables: { password: string; token: string }, log?: boolean): Promise<{ data: boolean; error: GraphqlError }> =>
  gqlMutation<boolean>('resetPassword', { fields: null, log, variables });
export const useUpdateUserMutation = (
  variables: { id: string; input: UserInput },
  fields?: InputFields<User>[] | null,
  log?: boolean,
): Promise<{ data: User; error: GraphqlError }> => gqlMutation<User>('updateUser', { fields, log, variables });
export const useVerifyUserMutation = (variables: { token: string }, log?: boolean): Promise<{ data: boolean; error: GraphqlError }> =>
  gqlMutation<boolean>('verifyUser', { fields: null, log, variables });
export const useDeleteFileMutation = (variables: { filename: string }, fields?: InputFields<FileInfo>[] | null, log?: boolean): Promise<{ data: FileInfo; error: GraphqlError }> =>
  gqlMutation<FileInfo>('deleteFile', { fields, log, variables });
export const useUploadFileMutation = (variables: { file: any }, fields?: InputFields<FileInfo>[] | null, log?: boolean): Promise<{ data: FileInfo; error: GraphqlError }> =>
  gqlMutation<FileInfo>('uploadFile', { fields, log, variables });
export const useUploadFilesMutation = (variables: { files: any[] }, log?: boolean): Promise<{ data: boolean; error: GraphqlError }> =>
  gqlMutation<boolean>('uploadFiles', { fields: null, log, variables });
export const useCreateTodoMutation = (variables: { input: TodoCreateInput }, fields?: InputFields<Todo>[] | null, log?: boolean): Promise<{ data: Todo; error: GraphqlError }> =>
  gqlMutation<Todo>('createTodo', { fields, log, variables });
export const useDeleteTodoMutation = (variables: { id: string }, fields?: InputFields<Todo>[] | null, log?: boolean): Promise<{ data: Todo; error: GraphqlError }> =>
  gqlMutation<Todo>('deleteTodo', { fields, log, variables });
export const useUpdateTodoMutation = (
  variables: { id: string; input: TodoInput },
  fields?: InputFields<Todo>[] | null,
  log?: boolean,
): Promise<{ data: Todo; error: GraphqlError }> => gqlMutation<Todo>('updateTodo', { fields, log, variables });
export const useErrorTodoMutation = (variables: { id: string }, fields?: InputFields<Todo>[] | null, log?: boolean): Promise<{ data: Todo; error: GraphqlError }> =>
  gqlMutation<Todo>('errorTodo', { fields, log, variables });
export const useUserCreatedSubscription = (fields?: InputFields<User>[] | null, log?: boolean): Promise<ReturnTypeOfSubscription<User>> =>
  gqlSubscription<User>('userCreated', { fields, log });
export const useTodoCreatedSubscription = (fields?: InputFields<Todo>[] | null, log?: boolean): Promise<ReturnTypeOfSubscription<Todo>> =>
  gqlSubscription<Todo>('todoCreated', { fields, log });

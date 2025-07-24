export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never } | T;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  /** Any scalar type */
  Any: { input: any; output: any };
  Boolean: { input: boolean; output: boolean };
  /** Date custom scalar type */
  Date: { input: any; output: any };
  Float: { input: number; output: number };
  ID: { input: string; output: string };
  Int: { input: number; output: number };
  /** JSON scalar type. Information on the exact schema of the JSON object is contained in the description of the field. */
  JSON: { input: any; output: any };
  String: { input: string; output: string };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
}

/** Authentication data */
export interface Auth {
  /** Refresh token */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** JavaScript Web Token (JWT) */
  token?: Maybe<Scalars['String']['output']>;
  /** User who signed in */
  user: User;
}

/** Sign-in input */
export interface AuthSignInInput {
  /** Device description */
  deviceDescription?: InputMaybe<Scalars['String']['input']>;
  /** Device ID (is created automatically if it is not set) */
  deviceId?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email: Scalars['String']['input'];
  /** Password */
  password: Scalars['String']['input'];
}

/** Sign-up input */
export interface AuthSignUpInput {
  /** Device description */
  deviceDescription?: InputMaybe<Scalars['String']['input']>;
  /** Device ID (is created automatically if it is not set) */
  deviceId?: InputMaybe<Scalars['String']['input']>;
  /** Email */
  email: Scalars['String']['input'];
  /** firstName */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** lastName */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password */
  password: Scalars['String']['input'];
}

/** Combination of multiple filters via logical operator */
export interface CombinedFilterInput {
  /** Filters to combine via logical operator */
  filters: Array<FilterInput>;
  /** Logical Operator to combine filters */
  logicalOperator: LogicalOperatorEnum;
}

/** [Comparison Operators](https://docs.mongodb.com/manual/reference/operator/query-comparison/) for filters */
export enum ComparisonOperatorEnum {
  EQ = 'EQ',
  GT = 'GT',
  GTE = 'GTE',
  IN = 'IN',
  LT = 'LT',
  LTE = 'LTE',
  NE = 'NE',
  NIN = 'NIN',
  REGEX = 'REGEX',
}

/** CoreAuth */
export interface CoreAuthModel {
  /** Refresh token */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** JavaScript Web Token (JWT) */
  token?: Maybe<Scalars['String']['output']>;
  /** Current user */
  user: CoreUserModel;
}

/** Health check result */
export interface CoreHealthCheckResult {
  /** The details object contains information of every health indicator */
  details: Scalars['JSON']['output'];
  /** The error object contains information of each health indicator which is of status “down” */
  error?: Maybe<Scalars['JSON']['output']>;
  /** The info object contains information of each health indicator which is of status “up” */
  info?: Maybe<Scalars['JSON']['output']>;
  /** The overall status of the Health Check */
  status: Scalars['String']['output'];
}

/** User */
export interface CoreUserModel {
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** Email of the user */
  email?: Maybe<Scalars['String']['output']>;
  /** First name of the user */
  firstName?: Maybe<Scalars['String']['output']>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Last name of the user */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Roles of the user */
  roles?: Maybe<Array<Scalars['String']['output']>>;
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** Username of the user */
  username?: Maybe<Scalars['String']['output']>;
  /** Verification state of the user */
  verified?: Maybe<Scalars['Boolean']['output']>;
  /** Verified date */
  verifiedAt?: Maybe<Scalars['Date']['output']>;
}

/** Information about file */
export interface FileInfo {
  /** The size of each chunk in bytes. GridFS divides the document into chunks of size chunkSize, except for the last, which is only as large as needed. The default size is 255 kilobytes (kB) */
  chunkSize?: Maybe<Scalars['Float']['output']>;
  /** Content type */
  contentType?: Maybe<Scalars['String']['output']>;
  /** Name of the file */
  filename?: Maybe<Scalars['String']['output']>;
  /** ID of the file */
  id: Scalars['String']['output'];
  /** The size of the document in bytes */
  length?: Maybe<Scalars['Float']['output']>;
  /** The date the file was first stored */
  uploadDate?: Maybe<Scalars['Date']['output']>;
}

/** Input for filtering. The `singleFilter` will be ignored if the `combinedFilter` is set. */
export interface FilterInput {
  /** Combination of multiple filters via logical operator */
  combinedFilter?: InputMaybe<CombinedFilterInput>;
  /** Filter for a single property */
  singleFilter?: InputMaybe<SingleFilterInput>;
}

/** Result of find and count Todos */
export interface FindAndCountTodosResult {
  /** Found Todos */
  items: Array<Todo>;
  /** Total count (skip/offset and limit/take are ignored in the count) */
  totalCount: Scalars['Float']['output'];
}

/** Result of find and count */
export interface FindAndCountUsersResult {
  /** Found users */
  items: Array<User>;
  /** Total count (skip/offset and limit/take are ignored in the count) */
  totalCount: Scalars['Float']['output'];
}

/** Logical operators to combine filters */
export enum LogicalOperatorEnum {
  AND = 'AND',
  NOR = 'NOR',
  OR = 'OR',
}

/** Metadata of API */
export interface Meta {
  /** Environment of API */
  environment: Scalars['String']['output'];
  /** Package name of API */
  package: Scalars['String']['output'];
  /** Title of API */
  title: Scalars['String']['output'];
  /** Version of API */
  version: Scalars['String']['output'];
}

export interface Mutation {
  /** Create a new Todo */
  createTodo: Todo;
  /** Create a new user */
  createUser: User;
  deleteFile: FileInfo;
  /** Delete existing Todo */
  deleteTodo: Todo;
  /** Delete existing user */
  deleteUser: User;
  /** error Todo */
  errorTodo: Todo;
  /** Logout user (from specific device) */
  logout: Scalars['Boolean']['output'];
  /** Refresh tokens (for specific device) */
  refreshToken: CoreAuthModel;
  /** Set new password for user with token */
  resetPassword: Scalars['Boolean']['output'];
  /** Sign in and get JWT token */
  signIn: Auth;
  /** Sign up user and get JWT token */
  signUp: Auth;
  /** Update existing Todo */
  updateTodo: Todo;
  /** Update existing user */
  updateUser: User;
  uploadFile: FileInfo;
  uploadFiles: Scalars['Boolean']['output'];
  /** Verify user with email */
  verifyUser: Scalars['Boolean']['output'];
}

export interface MutationCreateTodoArgs {
  input: TodoCreateInput;
}

export interface MutationCreateUserArgs {
  input: UserCreateInput;
}

export interface MutationDeleteFileArgs {
  filename: Scalars['String']['input'];
}

export interface MutationDeleteTodoArgs {
  id: Scalars['String']['input'];
}

export interface MutationDeleteUserArgs {
  id: Scalars['String']['input'];
}

export interface MutationErrorTodoArgs {
  id: Scalars['String']['input'];
}

export interface MutationLogoutArgs {
  allDevices?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface MutationResetPasswordArgs {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
}

export interface MutationSignInArgs {
  input: AuthSignInInput;
}

export interface MutationSignUpArgs {
  input: AuthSignUpInput;
}

export interface MutationUpdateTodoArgs {
  id: Scalars['String']['input'];
  input: TodoInput;
}

export interface MutationUpdateUserArgs {
  id: Scalars['String']['input'];
  input: UserInput;
}

export interface MutationUploadFileArgs {
  file: Scalars['Upload']['input'];
}

export interface MutationUploadFilesArgs {
  files: Array<Scalars['Upload']['input']>;
}

export interface MutationVerifyUserArgs {
  token: Scalars['String']['input'];
}

export interface Query {
  /** Find Todos (via filter) */
  findAndCountTodos: FindAndCountTodosResult;
  /** Find users (via filter) */
  findAndCountUsers: FindAndCountUsersResult;
  /** Find Todos (via filter) */
  findTodos: Array<Todo>;
  /** Find users (via filter) */
  findUsers: Array<User>;
  getFileInfo?: Maybe<FileInfo>;
  /** Get Meta */
  getMeta: Meta;
  /** Get Todo with specified ID */
  getTodo: Todo;
  /** Get user with specified ID */
  getUser: User;
  /** Get verified state of user with token */
  getVerifiedState: Scalars['Boolean']['output'];
  /** Get health check result */
  healthCheck: CoreHealthCheckResult;
  /** Request new password for user with email */
  requestPasswordResetMail: Scalars['Boolean']['output'];
}

export interface QueryFindAndCountTodosArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryFindAndCountUsersArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryFindTodosArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryFindUsersArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryGetFileInfoArgs {
  filename: Scalars['String']['input'];
}

export interface QueryGetTodoArgs {
  id: Scalars['String']['input'];
}

export interface QueryGetUserArgs {
  id: Scalars['String']['input'];
}

export interface QueryGetVerifiedStateArgs {
  token: Scalars['String']['input'];
}

export interface QueryRequestPasswordResetMailArgs {
  email: Scalars['String']['input'];
}

/** Input for a configuration of a filter */
export interface SingleFilterInput {
  /** Convert value to ObjectId */
  convertToObjectId?: InputMaybe<Scalars['Boolean']['input']>;
  /** Name of the property to be used for the filter */
  field: Scalars['String']['input'];
  /** Process value as reference */
  isReference?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Negate operator](https://docs.mongodb.com/manual/reference/operator/query/not/) */
  not?: InputMaybe<Scalars['Boolean']['input']>;
  /** [Comparison operator](https://docs.mongodb.com/manual/reference/operator/query-comparison/) */
  operator: ComparisonOperatorEnum;
  /** [Options](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_options) for [REGEX](https://docs.mongodb.com/manual/reference/operator/query/regex/) operator */
  options?: InputMaybe<Scalars['String']['input']>;
  /** Value of the property */
  value: Scalars['JSON']['input'];
}

/** Sorting the returned elements */
export interface SortInput {
  /** Field that is to be used for sorting */
  field: Scalars['String']['input'];
  /** SortInput order of the field */
  order: SortOrderEnum;
}

/** SortInput order of items */
export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface Subscription {
  todoCreated: Todo;
  userCreated: User;
}

/** Todo */
export interface Todo {
  /** Assigne of Todo */
  assigne?: Maybe<User>;
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<User>;
  /** Deadline of Todo */
  deadline?: Maybe<Scalars['Float']['output']>;
  /** Description of Todo */
  description?: Maybe<Scalars['String']['output']>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Name of Todo */
  name: Scalars['String']['output'];
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who updated the object */
  updatedBy?: Maybe<User>;
}

/** Input data to create a new Todo */
export interface TodoCreateInput {
  /** AssigneId of Todo */
  assigne?: InputMaybe<Scalars['String']['input']>;
  /** Deadline of Todo */
  deadline?: InputMaybe<Scalars['Float']['input']>;
  /** Description of Todo */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Name of Todo */
  name: Scalars['String']['input'];
}

/** Input data to update an existing Todo */
export interface TodoInput {
  /** AssigneId of Todo */
  assigne?: InputMaybe<Scalars['String']['input']>;
  /** Deadline of Todo */
  deadline?: InputMaybe<Scalars['Float']['input']>;
  /** Description of Todo */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Name of Todo */
  name?: InputMaybe<Scalars['String']['input']>;
}

/** User */
export interface User {
  /** URL to avatar file of the user */
  avatar?: Maybe<Scalars['String']['output']>;
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<Scalars['String']['output']>;
  /** Email of the user */
  email?: Maybe<Scalars['String']['output']>;
  /** First name of the user */
  firstName?: Maybe<Scalars['String']['output']>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Last name of the user */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Roles of the user */
  roles?: Maybe<Array<Scalars['String']['output']>>;
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who last updated the object */
  updatedBy?: Maybe<Scalars['String']['output']>;
  /** Username of the user */
  username?: Maybe<Scalars['String']['output']>;
  /** Verification state of the user */
  verified?: Maybe<Scalars['Boolean']['output']>;
  /** Verified date */
  verifiedAt?: Maybe<Scalars['Date']['output']>;
}

/** User input to create a new user */
export interface UserCreateInput {
  /** Email of the user */
  email: Scalars['String']['input'];
  /** First name of the user */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the user */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password of the user */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Roles of the user */
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Username / alias of the user */
  username?: InputMaybe<Scalars['String']['input']>;
}

/** User input */
export interface UserInput {
  /** Email of the user */
  email?: InputMaybe<Scalars['String']['input']>;
  /** First name of the user */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the user */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password of the user */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Roles of the user */
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Username / alias of the user */
  username?: InputMaybe<Scalars['String']['input']>;
}

export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Any scalar type */
  Any: { input: any; output: any; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  /** JSON scalar type. Information on the exact schema of the JSON object is contained in the description of the field. */
  JSON: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
}

/** AboutMe */
export interface AboutMe {
  /** Visibility of AboutMe */
  aboutMeVisibility?: Maybe<VisibilityEnum>;
  /** Activity of AboutMe */
  activity?: Maybe<ActivityEnum>;
  /** Drink of AboutMe */
  drink?: Maybe<DrinkEnum>;
  /** Location of AboutMe */
  location?: Maybe<LocationEnum>;
  /** Outfit of AboutMe */
  outfit?: Maybe<OutfitEnum>;
}

/** Input data to update an existing AboutMe */
export interface AboutMeInput {
  /** Visibility of AboutMe */
  aboutMeVisibility?: InputMaybe<VisibilityEnum>;
  /** Activity of AboutMe */
  activity?: InputMaybe<ActivityEnum>;
  /** Drink of AboutMe */
  drink?: InputMaybe<DrinkEnum>;
  /** Location of AboutMe */
  location?: InputMaybe<LocationEnum>;
  /** Outfit of AboutMe */
  outfit?: InputMaybe<OutfitEnum>;
}

/** Enum of user activity */
export enum ActivityEnum {
  COUCH = 'COUCH',
  SPORT = 'SPORT'
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
  /** Gender of the user */
  gender?: InputMaybe<GenderEnum>;
  /** lastName */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password */
  password: Scalars['String']['input'];
}

/** Enum of branch in which the company operates */
export enum BranchEnum {
  IT = 'IT'
}

/** Combination of multiple filters via logical operator */
export interface CombinedFilterInput {
  /** Filters to combine via logical operator */
  filters: Array<FilterInput>;
  /** Logical Operator to combine filters */
  logicalOperator: LogicalOperatorEnum;
}

/** Company */
export interface Company {
  /** Branches of Company */
  branches: Array<Scalars['String']['output']>;
  /** CompanyForms of Company */
  companyForms: Array<Scalars['String']['output']>;
  /** CompanyType of Company */
  companyType: Scalars['String']['output'];
  /** Description of Company */
  description: Scalars['String']['output'];
  /** Location of Company */
  location: Location;
  /** Logo of Company */
  logo?: Maybe<Scalars['String']['output']>;
  /** Name of Company */
  name: Scalars['String']['output'];
  /** Website of Company */
  website: Scalars['String']['output'];
}

/** Enum of form in which the company operates */
export enum CompanyFormEnum {
  START_UP = 'START_UP'
}

/** Input data to update an existing Company */
export interface CompanyInput {
  /** Branches of Company */
  branches?: InputMaybe<Array<BranchEnum>>;
  /** CompanyForms of Company */
  companyForms?: InputMaybe<Array<CompanyFormEnum>>;
  /** CompanyType of Company */
  companyType?: InputMaybe<CompanyTypeEnum>;
  /** Description of Company */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Location of Company */
  location?: InputMaybe<LocationInput>;
  /** Logo of Company */
  logo?: InputMaybe<Scalars['String']['input']>;
  /** Name of Company */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Website of Company */
  website?: InputMaybe<Scalars['String']['input']>;
}

/** Enum of company type */
export enum CompanyTypeEnum {
  INDUSTRY = 'INDUSTRY'
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
  REGEX = 'REGEX'
}

/** Contact */
export interface Contact {
  /** Contact user */
  contact: User;
  /** Created of Contact */
  created: Scalars['Float']['output'];
  /** Message of Contact */
  message?: Maybe<Scalars['String']['output']>;
  /** Status of Contact */
  status: Scalars['String']['output'];
  /** Updated of Contact */
  updated?: Maybe<Scalars['Float']['output']>;
}

/** Input data to update an existing Contact */
export interface ContactInput {
  /** Id of Contact */
  contact?: InputMaybe<Scalars['String']['input']>;
  /** Created of Contact */
  created?: InputMaybe<Scalars['Float']['input']>;
  /** Message of Contact */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Status of Contact */
  status?: InputMaybe<ContactStatusEnum>;
  /** Updated of Contact */
  updated?: InputMaybe<Scalars['Float']['input']>;
}

/** Enum for contact status of the user */
export enum ContactStatusEnum {
  REQUESTED = 'REQUESTED',
  REQUESTED_BY = 'REQUESTED_BY'
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

/** Favourite drink of user as enum */
export enum DrinkEnum {
  BEER = 'BEER',
  COFFEE = 'COFFEE',
  MILK = 'MILK',
  TEA = 'TEA',
  WATER = 'WATER',
  WINE = 'WINE'
}

/** Event */
export interface Event {
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<User>;
  /** Description of Event */
  description?: Maybe<Scalars['String']['output']>;
  /** EndDateTime of Event */
  endDateTime: Scalars['Date']['output'];
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Image of Event */
  image?: Maybe<Scalars['String']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Link of Event */
  link: Scalars['String']['output'];
  /** StartDateTime of Event */
  startDateTime: Scalars['Date']['output'];
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Title of Event */
  title: Scalars['String']['output'];
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who updated the object */
  updatedBy?: Maybe<User>;
}

/** Input data to create a new Event */
export interface EventCreateInput {
  /** DateTime of Event */
  dateTime: Scalars['Float']['input'];
  /** Description of Event */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Image of Event */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Link of Event */
  link: Scalars['String']['input'];
  /** Title of Event */
  title: Scalars['String']['input'];
}

/** Input data to update an existing Event */
export interface EventInput {
  /** DateTime of Event */
  dateTime?: InputMaybe<Scalars['Float']['input']>;
  /** Description of Event */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Image of Event */
  image?: InputMaybe<Scalars['String']['input']>;
  /** Link of Event */
  link?: InputMaybe<Scalars['String']['input']>;
  /** Title of Event */
  title?: InputMaybe<Scalars['String']['input']>;
}

/** Faq */
export interface Faq {
  /** Answer of Faq */
  answer: Scalars['String']['output'];
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<User>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Order of Faq */
  order?: Maybe<Scalars['Float']['output']>;
  /** Question of Faq */
  question: Scalars['String']['output'];
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who updated the object */
  updatedBy?: Maybe<User>;
}

/** Input data to create a new Faq */
export interface FaqCreateInput {
  /** Answer of Faq */
  answer: Scalars['String']['input'];
  /** Order of Faq */
  order?: InputMaybe<Scalars['Float']['input']>;
  /** Question of Faq */
  question: Scalars['String']['input'];
}

/** Input data to update an existing Faq */
export interface FaqInput {
  /** Answer of Faq */
  answer?: InputMaybe<Scalars['String']['input']>;
  /** Order of Faq */
  order?: InputMaybe<Scalars['Float']['input']>;
  /** Question of Faq */
  question?: InputMaybe<Scalars['String']['input']>;
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

/** Result of find and count Events */
export interface FindAndCountEventsResult {
  /** Found Events */
  items: Array<Event>;
  /** Total count (skip/offset and limit/take are ignored in the count) */
  totalCount: Scalars['Float']['output'];
}

/** Result of find and count Faqs */
export interface FindAndCountFaqsResult {
  /** Found Faqs */
  items: Array<Faq>;
  /** Total count (skip/offset and limit/take are ignored in the count) */
  totalCount: Scalars['Float']['output'];
}

/** Result of find and count Skills */
export interface FindAndCountSkillsResult {
  /** Found Skills */
  items: Array<Skill>;
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

/** Gender of the user as enum */
export enum GenderEnum {
  DIVERSE = 'DIVERSE',
  FEMALE = 'FEMALE',
  MALE = 'MALE'
}

/** Location */
export interface Location {
  /** City of Location */
  city: Scalars['String']['output'];
  /** Lat of Location */
  lat?: Maybe<Scalars['Float']['output']>;
  /** Long of Location */
  long?: Maybe<Scalars['Float']['output']>;
  /** Street of Location */
  street: Scalars['String']['output'];
  /** Zip of Location */
  zip: Scalars['String']['output'];
}

/** User preferred location as enum */
export enum LocationEnum {
  CITY = 'CITY',
  VILLAGE = 'VILLAGE'
}

/** Input data to update an existing Location */
export interface LocationInput {
  /** City of Location */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Lat of Location */
  lat?: InputMaybe<Scalars['Float']['input']>;
  /** Long of Location */
  long?: InputMaybe<Scalars['Float']['input']>;
  /** Street of Location */
  street?: InputMaybe<Scalars['String']['input']>;
  /** Zip of Location */
  zip?: InputMaybe<Scalars['String']['input']>;
}

/** Logical operators to combine filters */
export enum LogicalOperatorEnum {
  AND = 'AND',
  NOR = 'NOR',
  OR = 'OR'
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
  /** Create a new Event */
  createEvent: Event;
  /** Create a new Faq */
  createFaq: Faq;
  /** Create a new Skill */
  createSkill: Skill;
  /** Create a new user */
  createUser: User;
  /** Delete existing Event */
  deleteEvent: Event;
  /** Delete existing Faq */
  deleteFaq: Faq;
  deleteFile: FileInfo;
  /** Delete existing Skill */
  deleteSkill: Skill;
  /** Delete existing user */
  deleteUser: User;
  /** Send feedback */
  feedback: Scalars['Boolean']['output'];
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
  /** Update existing Event */
  updateEvent: Event;
  /** Update existing Faq */
  updateFaq: Faq;
  /** Update existing Skill */
  updateSkill: Skill;
  /** Update existing user */
  updateUser: User;
  uploadFile: FileInfo;
  uploadFiles: Scalars['Boolean']['output'];
  /** Verify user with email */
  verifyUser: Scalars['Boolean']['output'];
}


export interface MutationCreateEventArgs {
  input: EventCreateInput;
}


export interface MutationCreateFaqArgs {
  input: FaqCreateInput;
}


export interface MutationCreateSkillArgs {
  input: SkillCreateInput;
}


export interface MutationCreateUserArgs {
  input: UserCreateInput;
}


export interface MutationDeleteEventArgs {
  id: Scalars['String']['input'];
}


export interface MutationDeleteFaqArgs {
  id: Scalars['String']['input'];
}


export interface MutationDeleteFileArgs {
  filename: Scalars['String']['input'];
}


export interface MutationDeleteSkillArgs {
  id: Scalars['String']['input'];
}


export interface MutationDeleteUserArgs {
  id: Scalars['String']['input'];
}


export interface MutationFeedbackArgs {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  message: Scalars['String']['input'];
  subject: Scalars['String']['input'];
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


export interface MutationUpdateEventArgs {
  id: Scalars['String']['input'];
  input: EventInput;
}


export interface MutationUpdateFaqArgs {
  id: Scalars['String']['input'];
  input: FaqInput;
}


export interface MutationUpdateSkillArgs {
  id: Scalars['String']['input'];
  input: SkillInput;
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

/** User preferred outfit as enum */
export enum OutfitEnum {
  BUSINESS = 'BUSINESS',
  CASUAL = 'CASUAL'
}

export interface Query {
  /** Find Events (via filter) */
  findAndCountEvents: FindAndCountEventsResult;
  /** Find Faqs (via filter) */
  findAndCountFaqs: FindAndCountFaqsResult;
  /** Find Skills (via filter) */
  findAndCountSkills: FindAndCountSkillsResult;
  /** Find users (via filter) */
  findAndCountUsers: FindAndCountUsersResult;
  /** Find Events (via filter) */
  findEvents: Array<Event>;
  /** Find Faqs (via filter) */
  findFaqs: Array<Faq>;
  /** Find Skills (via filter) */
  findSkills: Array<Skill>;
  /** Find users (via filter) */
  findUsers: Array<User>;
  /** Get Event with specified ID */
  getEvent: Event;
  /** Get Faq with specified ID */
  getFaq: Faq;
  getFileInfo?: Maybe<FileInfo>;
  /** Get Meta */
  getMeta: Meta;
  /** Get user with specified ID */
  getProfile: User;
  /** Get Skill with specified ID */
  getSkill: Skill;
  /** Get user with specified ID */
  getUser: User;
  /** Get verified state of user with token */
  getVerifiedState: Scalars['Boolean']['output'];
  /** Get health check result */
  healthCheck: CoreHealthCheckResult;
  /** Request new password for user with email */
  requestPasswordResetMail: Scalars['Boolean']['output'];
}


export interface QueryFindAndCountEventsArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}


export interface QueryFindAndCountFaqsArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}


export interface QueryFindAndCountSkillsArgs {
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


export interface QueryFindEventsArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}


export interface QueryFindFaqsArgs {
  filter?: InputMaybe<FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  samples?: InputMaybe<Scalars['Float']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
}


export interface QueryFindSkillsArgs {
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


export interface QueryGetEventArgs {
  id: Scalars['String']['input'];
}


export interface QueryGetFaqArgs {
  id: Scalars['String']['input'];
}


export interface QueryGetFileInfoArgs {
  filename: Scalars['String']['input'];
}


export interface QueryGetProfileArgs {
  id: Scalars['String']['input'];
}


export interface QueryGetSkillArgs {
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

/** SearchConfig */
export interface SearchConfig {
  /** Branches of SearchConfig */
  branches?: Maybe<Array<Scalars['String']['output']>>;
  /** CompanyForms of SearchConfig */
  companyForms?: Maybe<Array<Scalars['String']['output']>>;
  /** CompanyTypes of SearchConfig */
  companyTypes?: Maybe<Array<Scalars['String']['output']>>;
  /** Distance of SearchConfig */
  distance?: Maybe<Scalars['Float']['output']>;
  /** Skills of SearchConfig */
  skills?: Maybe<Array<Scalars['String']['output']>>;
}

/** Input data to update an existing SearchConfig */
export interface SearchConfigInput {
  /** Branches of SearchConfig */
  branches?: InputMaybe<Array<BranchEnum>>;
  /** CompanyForms of SearchConfig */
  companyForms?: InputMaybe<Array<CompanyFormEnum>>;
  /** CompanyTypes of SearchConfig */
  companyTypes?: InputMaybe<Array<CompanyTypeEnum>>;
  /** Distance of SearchConfig */
  distance?: InputMaybe<Scalars['Float']['input']>;
  /** Skills of SearchConfig */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
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

/** Skill */
export interface Skill {
  /** Count of Skill */
  count: Scalars['Float']['output'];
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<User>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Name of Skill */
  name: Scalars['String']['output'];
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Updated date */
  updatedAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who updated the object */
  updatedBy?: Maybe<User>;
}

/** Input data to create a new Skill */
export interface SkillCreateInput {
  /** Count of Skill */
  count: Scalars['Float']['input'];
  /** Name of Skill */
  name: Scalars['String']['input'];
}

/** Input data to update an existing Skill */
export interface SkillInput {
  /** Count of Skill */
  count?: InputMaybe<Scalars['Float']['input']>;
  /** Name of Skill */
  name?: InputMaybe<Scalars['String']['input']>;
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
  DESC = 'DESC'
}

export interface Subscription {
  eventCreated: Event;
  faqCreated: Faq;
  skillCreated: Skill;
  userCreated: User;
}

/** Title of the user as enum */
export enum TitleEnum {
  DR = 'DR',
  PROF = 'PROF'
}

/** User */
export interface User {
  /** Things about the user */
  aboutMe?: Maybe<AboutMe>;
  /** URL to avatar file of the user */
  avatar?: Maybe<Scalars['String']['output']>;
  /** Company the user is working for */
  company?: Maybe<Company>;
  /** Contacts of the user */
  contacts?: Maybe<Array<Contact>>;
  /** Created date */
  createdAt?: Maybe<Scalars['Date']['output']>;
  /** ID of the user who created the object */
  createdBy?: Maybe<Scalars['String']['output']>;
  /** Description of the user */
  description?: Maybe<Scalars['String']['output']>;
  /** Email of the user */
  email?: Maybe<Scalars['String']['output']>;
  /** First name of the user */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Gender of user */
  gender?: Maybe<Scalars['String']['output']>;
  /** ID of the persistence object */
  id?: Maybe<Scalars['ID']['output']>;
  /** Job title of the user */
  jobTitle?: Maybe<Scalars['String']['output']>;
  /** Labels of the object */
  labels?: Maybe<Array<Scalars['String']['output']>>;
  /** Last name of the user */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Likes for the user */
  likes?: Maybe<Array<User>>;
  /** Likes count of the user */
  likesCount?: Maybe<Scalars['Float']['output']>;
  /** Phone number of the user */
  phone?: Maybe<Scalars['String']['output']>;
  /** Roles of the user */
  roles?: Maybe<Array<Scalars['String']['output']>>;
  /** Search configuration of the user */
  searchConfig?: Maybe<SearchConfig>;
  /** Skills of the user */
  skills?: Maybe<Array<Scalars['String']['output']>>;
  /** Tags for the object */
  tags?: Maybe<Array<Scalars['String']['output']>>;
  /** Title of user */
  title?: Maybe<Scalars['String']['output']>;
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
  /** Things about the user */
  aboutMe?: InputMaybe<AboutMeInput>;
  /** Company the user is working for */
  company?: InputMaybe<CompanyInput>;
  /** Contacts of the user */
  contacts?: InputMaybe<Array<ContactInput>>;
  /** Description of the user */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Email of the user */
  email: Scalars['String']['input'];
  /** First name of the user */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Gender of the user */
  gender?: InputMaybe<GenderEnum>;
  /** Job title of the user */
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the user */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Likes for the user */
  likes?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Password of the user */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Phone number of the user */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Roles of the user */
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search configuration of the user */
  searchConfig?: InputMaybe<SearchConfigInput>;
  /** Skills of the user */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Title of the user */
  title?: InputMaybe<TitleEnum>;
  /** Username / alias of the user */
  username?: InputMaybe<Scalars['String']['input']>;
}

/** User input */
export interface UserInput {
  /** Things about the user */
  aboutMe?: InputMaybe<AboutMeInput>;
  /** Avatar of the user */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** Company the user is working for */
  company?: InputMaybe<CompanyInput>;
  /** Contacts of the user */
  contacts?: InputMaybe<Array<ContactInput>>;
  /** Description of the user */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Email of the user */
  email?: InputMaybe<Scalars['String']['input']>;
  /** First name of the user */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Gender of the user */
  gender?: InputMaybe<GenderEnum>;
  /** Job title of the user */
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the user */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Likes for the user */
  likes?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Password of the user */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Phone number of the user */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Roles of the user */
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Search configuration of the user */
  searchConfig?: InputMaybe<SearchConfigInput>;
  /** Skills of the user */
  skills?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Title of the user */
  title?: InputMaybe<TitleEnum>;
  /** Username / alias of the user */
  username?: InputMaybe<Scalars['String']['input']>;
}

/** Enum of visibility states */
export enum VisibilityEnum {
  ALL = 'ALL',
  ME = 'ME',
  REGISTERED = 'REGISTERED'
}

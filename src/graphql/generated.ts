import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Client = {
  __typename?: 'Client';
  active: Scalars['Boolean']['output'];
  credit_balance?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type CreateClientInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createClient?: Maybe<Client>;
  createOrganization?: Maybe<Organization>;
  deleteClient?: Maybe<Scalars['Boolean']['output']>;
  deleteOrganization?: Maybe<Scalars['Boolean']['output']>;
  updateClient?: Maybe<Client>;
  updateOrganization?: Maybe<Organization>;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateOrganizationArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateClientArgs = {
  input: UpdateClientInput;
};


export type MutationUpdateOrganizationArgs = {
  input?: InputMaybe<UpdateOrganizationInput>;
};

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getClient?: Maybe<Client>;
  getClients: Array<Client>;
};


export type QueryGetClientArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateClientInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrganizationInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type GetClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsQuery = { __typename?: 'Query', getClients: Array<{ __typename?: 'Client', id: string, name: string, email?: string | null, phone?: string | null, credit_balance?: number | null, active: boolean }> };


export const GetClientsDocument = gql`
    query GetClients {
  getClients {
    id
    name
    email
    phone
    credit_balance
    active
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetClients(variables?: GetClientsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetClientsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetClientsQuery>({ document: GetClientsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetClients', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
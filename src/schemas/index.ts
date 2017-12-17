import { makeExecutableSchema } from 'graphql-tools';

import { usersSchema } from './users.schema';
import { profilesSchema } from './profiles.schema';
import { communitiesSchema } from './communities.schema';
import { postsSchema } from './posts.schema';

import JSONScalar from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';

export const baseSchema = `
  scalar DateTime
  scalar JSON
  interface Node {
    id: ID!
  }
  type Query {
    node(id: ID!): Node
  }
  schema {
    query: Query
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [
    baseSchema,
    usersSchema,
    profilesSchema,
    postsSchema,
    communitiesSchema,
  ],
  resolvers: {
    DateTime: GraphQLDateTime,
    JSON: JSONScalar,
  },
});

import { makeExecutableSchema } from 'graphql-tools';
import { Kind } from 'graphql/language';

import { usersSchema } from './users.schema';

export const rootSchema = `
  schema {
    query: Query
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [usersSchema],
  resolvers: {
    Date: {
      __parseValue(value) {
        return new Date(value); // value from the client
      },
      __serialize(value) {
        return value.getTime(); // value sent to the client
      },
      __parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    },
  },
});

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // cors: {
    //   origin: ['http://localhost:5173'],
    //   credentials: true
    // },
    context: async ({ req }) => {
      const ip = req.socket.remoteAddress ?? 'unknown';
      return { ip };
    }
  });

  console.info(`Mock GraphQL Server ready at ${url}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

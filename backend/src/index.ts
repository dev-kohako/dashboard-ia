import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schemas/auth.schema'
import { resolvers } from './resolvers/auth.resolver'
import { createContext } from './utils/context'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext
})

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Servidor GraphQL rodando em ${url}`)
})

import { ApolloServer } from 'apollo-server'
import { createContext } from './utils/context'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'

const port = process.env.PORT || 4000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext
})

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Servidor GraphQL rodando em ${url}`)
})

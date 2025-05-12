import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
  } from "@apollo/client";
  import { setContext } from "@apollo/client/link/context";
  import { isTokenExpired } from "@/lib/jwt";
  
  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
  });
  
  export function createApolloClient(token?: string | null) {
    const authLink = setContext((_, { headers }) => {
      const expired = token && isTokenExpired(token);
      return {
        headers: {
          ...headers,
          ...(token && !expired ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    });
  
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: "network-only" },
        query: { fetchPolicy: "network-only" },
      },
    });
  }
  
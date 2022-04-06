import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  useQuery,
  split,
} from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { cache } from "../graphql/clientConfig";
import * as ws from "ws";

// export const createApolloClient = () => {
//   const link = new HttpLink({
//     uri: "http://localhost:4000/graphql",
//     headers: {
//       authorization: UserId(),
//     },
//   });
//   return new ApolloClient({
//     link,
//     cache: new InMemoryCache(),
//   });
// };

type UserContext = {
  createApolloClient: () => ApolloClient<any>;
  registerUser: () => string;
  cache: InMemoryCache;
  userId: null | string;
  client?: ApolloClient<any>;
};
export const useProvideUser = (): UserContext => {
  const [userId, setUserId] = useState(null);

  const createApolloClient = () => {
    console.log("process.env.BACKEND_URL", process.env.BACKEND_URL);
    const linkUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:4000/graphql"
        : process.env.BACKEND_URL + "/graphql";
    const httpLink = createUploadLink({
      uri: linkUri,
      headers: getUserHeaders(),
    });
    const wsUri =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:4000/graphql"
        : process.env.BACKEND_URL.replace(/^https/, "wss") + "/graphql";
    const wsLink = process.browser
      ? new WebSocketLink({
          uri: wsUri,
          options: {
            reconnect: true,
            connectionParams: {
              authToken: userId,
            },
          },
        })
      : null;
    const splitLink = process.browser
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          httpLink
        )
      : httpLink;

    return new ApolloClient({
      link: splitLink,
      cache,
    });
  };

  const getUserHeaders = () => {
    if (!userId) return null;
    return {
      authorization: userId,
    };
  };

  const registerUser = () => {
    let fetchedUserId = localStorage.getItem("authorization");
    if (!fetchedUserId) {
      fetchedUserId = uuidv4();
      // fetchedUserId = "6a3a2967-0258-4caf-8fef-f844c060b2f2";
      localStorage.setItem("authorization", fetchedUserId);
    }
    setUserId(fetchedUserId);
    return fetchedUserId;
  };

  return { createApolloClient, registerUser, cache, userId };
};

const userContext = createContext<null | UserContext>(null);

export function UserProvider({ children }) {
  const user = useProvideUser();
  const client = user.createApolloClient();
  return (
    <userContext.Provider value={{ ...user, client }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </userContext.Provider>
  );
}

export const useUser = () => {
  return useContext(userContext);
};

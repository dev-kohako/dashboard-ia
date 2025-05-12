"use client";

import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { createApolloClient } from "@/lib/apollo/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from "@/stores/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();

  const client = createApolloClient(token);

  return (
    <ApolloProvider client={client}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ApolloProvider>
  );
}

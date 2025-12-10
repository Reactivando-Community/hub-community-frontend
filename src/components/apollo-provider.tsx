'use client';

import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

import { getApolloClient } from '@/lib/apollo-client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  const client = getApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

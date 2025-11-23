"use client";

import React, {useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

export default function QueryProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

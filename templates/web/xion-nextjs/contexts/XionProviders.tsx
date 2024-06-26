"use client";
import { AbstraxionProvider } from "@/components/Abstraxion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function XionProviders({ children }: { children: React.ReactNode }) {

  const seatContractAddress = "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka";

  return (
    <QueryClientProvider client={queryClient}>
      <AbstraxionProvider
        config={{
          contracts: [seatContractAddress],
          restUrl: "https://xion-test-priv-rest.kingnodes.com/",
          rpcUrl: "https://xion-test-priv-rpc.kingnodes.com/",
        }}
      >
        {children}
      </AbstraxionProvider>
    </QueryClientProvider>
  );
}

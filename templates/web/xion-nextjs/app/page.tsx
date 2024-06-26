"use client";

import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";
import { useAppContext } from "@/contexts/AppProvider";

export default function Page(): JSX.Element {

  const { openXionChainModal, disconnectXion, userAddress, client, isConnecting } = useAppContext();

  return (
    <main className="m-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter text-white">
        ABSTRAXION
      </h1>
      <Button
        fullWidth
        onClick={() => {
          openXionChainModal();
        }}
        structure="base"
      >
        {userAddress ? (
          <div className="flex items-center justify-center text-black text-xs">{userAddress}</div>
        ) : (
          "CONNECT"
        )}
      </Button>
      {client ? (
        <>
          <Button
            fullWidth
            onClick={() => {
              disconnectXion();
            }}
            structure="base"
          >
            LOGOUT
          </Button>
        </>
      ) : null}
    </main>
  );
}
import { createContext, PropsWithChildren, useState, useContext, useMemo, useCallback, useEffect } from "react";
import { isNil } from "lodash";
import { useAbstraxionAccount } from "@/hooks/xion/useAbstraxionAccount";
import { useModal } from "@/hooks/xion/useModal";
import { useAbstraxionSigningClient } from "@/hooks/xion/useAbstraxionSigningClient";
import { Abstraxion } from "@/components/Abstraxion";

export type AppContextState = {
    client: any;
    userAddress?: string;
    isConnecting: boolean;
    disconnectXion: () => void;
    openXionChainModal: () => void;
}

const AppContext = createContext<AppContextState>({
    client: undefined,
    userAddress: undefined,
    isConnecting: false,
    disconnectXion: () => { },
    openXionChainModal: () => { }
});

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const [, setAbstraxionOpen] = useModal();

    const { data: xionData } = useAbstraxionAccount();

    const { client, signArb, logout } = useAbstraxionSigningClient();

    const [userAddress, setUserAddress] = useState<string>();

    const [isConnecting, setIsConnecting] = useState<boolean>(false);


    const disconnectXion = useCallback(() => {
        setUserAddress(undefined);
        setAbstraxionOpen(false);
        logout?.();
    }, [])


    const openXionChainModal = useCallback(() => {
        setIsConnecting(true);

        setAbstraxionOpen(true);
    }, [])

    const value = useMemo<AppContextState>(() => ({
        client,
        userAddress,
        isConnecting,
        disconnectXion,
        openXionChainModal
    }), [
        client,
        userAddress,
        isConnecting,
        disconnectXion,
        openXionChainModal
    ])

    useEffect(() => {
        // setAbstraxionOpen(true);
    }, [])

    useEffect(() => {
        if (!isNil(xionData)) {
            setUserAddress(xionData.bech32Address);
        }
    }, [xionData]);

    return (
        <AppContext.Provider value={value}>
            {children}

            <Abstraxion
                onClose={() => { }}
            />
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
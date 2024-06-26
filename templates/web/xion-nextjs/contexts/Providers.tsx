"use client";

import React, { FC, PropsWithChildren } from "react";
import AppProvider from "./AppProvider";
import { XionProviders } from "./XionProviders";




const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <XionProviders>
      <AppProvider>
        {children}
      </AppProvider>
    </XionProviders>
  );
};

export default Providers;

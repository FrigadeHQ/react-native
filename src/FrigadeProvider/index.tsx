import React, {createContext, FC, useState} from "react";
import {SWRConfig} from "swr";
import {Text} from "react-native";

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string,
  children?: React.ReactNode
}

export const FrigadeContext = createContext<IFrigadeContext>({
  publicApiKey: '',
});


export const FrigadeProvider: FC<IFrigadeContext> = ({
                                                       publicApiKey,
                                                       userId,
                                                       children
                                                     }) => {
  return (
    <SWRConfig
      value={{
        /* ... */
      }}
    >
      <FrigadeContext.Provider value={{
        publicApiKey, userId
      }}>
        {children}
      </FrigadeContext.Provider>
    </SWRConfig>
  )
}
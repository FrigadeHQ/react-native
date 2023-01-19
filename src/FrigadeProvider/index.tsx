import React, {createContext, FC, useState} from "react";
import {SWRConfig} from "swr";
import {DataFetcher} from "../DataFetcher";

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string,
  setUserId: (userId?: string) => void
  children?: React.ReactNode
}

export interface FrigadeProviderProps {
  publicApiKey: string
  userId?: string,
  children?: React.ReactNode
}

export const FrigadeContext = createContext<IFrigadeContext>({
  publicApiKey: '',
  setUserId: () => {
  }
});


export const FrigadeProvider: FC<FrigadeProviderProps> = ({
                                                            publicApiKey,
                                                            userId,
                                                            children
                                                          }) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(userId === undefined ? null : userId);

  return (
    <SWRConfig
      value={{
        /* ... */
      }}
    >
      <FrigadeContext.Provider value={{
        publicApiKey, userId: userIdValue, setUserId: setUserIdValue
      }}>
        {children}
        <DataFetcher/>
      </FrigadeContext.Provider>
    </SWRConfig>
  )
}

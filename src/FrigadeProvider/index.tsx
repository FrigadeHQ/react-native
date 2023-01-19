import React, {createContext, FC, useState} from "react";
import {SWRConfig} from "swr";
import {DataFetcher} from "../DataFetcher";
import {Flow} from "../api/flows";

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string,
  setUserId: (userId?: string) => void,
  flows: Flow[],
  setFlows: (flows: Flow[]) => void,
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
  },
  flows: [],
  setFlows: () => {

  }
});


export const FrigadeProvider: FC<FrigadeProviderProps> = ({
                                                            publicApiKey,
                                                            userId,
                                                            children
                                                          }) => {
  const [userIdValue, setUserIdValue] = useState<string | null>(userId === undefined ? null : userId);
  const [flows, setFlows] = useState<Flow[]>([]);

  return (
    <SWRConfig
      value={{
        /* ... */
      }}
    >
      <FrigadeContext.Provider value={{
        publicApiKey, userId: userIdValue, setUserId: setUserIdValue, setFlows, flows: flows
      }}>
        {children}
        <DataFetcher/>
      </FrigadeContext.Provider>
    </SWRConfig>
  )
}

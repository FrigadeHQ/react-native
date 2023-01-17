import React, {createContext, FC, useState} from "react";
import {SWRConfig} from "swr";

export interface IFrigadeContext {
  publicApiKey: string
  userId?: string,
  setUserId: (userId?: string) => void
  children?: React.ReactNode
}

export const FrigadeContext = createContext<IFrigadeContext>({
  publicApiKey: '',
  setUserId: () => {
  }
});


export const FrigadeProvider: FC<IFrigadeContext> = ({
                                                       publicApiKey,
                                                       userId,
                                                       children
                                                     }) => {
  const [userIdValue, setUserIdValue] = useState<string>(userId === undefined ? null : userId);

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
      </FrigadeContext.Provider>
    </SWRConfig>
  )
}
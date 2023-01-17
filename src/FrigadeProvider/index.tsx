import React, {createContext, useState} from "react";
import {SWRConfig} from "swr";

export interface IFrigadeContext {
  apiKey: string
  userId?: string
}

export const FrigadeContext = createContext<IFrigadeContext>({
  apiKey: '',
});

/**
 * We make component for manage business logic between children components and context
 * @param children
 * @returns {*}
 * @constructor
 */
const FrigadeProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState(null);

  return (
    <SWRConfig
      value={{
        /* ... */
      }}
    >
    <FrigadeContext.Provider value={{
      apiKey, userId
    }}>
      {children}
    </FrigadeContext.Provider>
    </SWRConfig>
  )
}


export default FrigadeContext;
export { FrigadeProvider };
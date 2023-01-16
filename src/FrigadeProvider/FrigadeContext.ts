import { createContext } from 'react';

export interface IFrigadeContext {
  apiKey?: string
}

export const FrigadeContext = createContext<IFrigadeContext>({

})
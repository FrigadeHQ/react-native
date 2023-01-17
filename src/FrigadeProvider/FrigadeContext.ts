import { createContext } from 'react';

export interface IFrigadeContext {
  apiKey: string
  userId?: string
}

export const FrigadeContext = createContext<IFrigadeContext>({
  apiKey: ''
});

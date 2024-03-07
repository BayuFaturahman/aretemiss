import React, {createContext, ReactNode, useContext} from 'react';
import type RootStore from './Store.bootstrap';

export const StoreContext = createContext<RootStore>({} as RootStore);

export const useStores = (): RootStore => useContext(StoreContext);

export type StoreComponentProps = {
  store: RootStore;
  children: ReactNode;
};

export const StoreProvider: React.FC<StoreComponentProps> = ({
  store,
  children,
}) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

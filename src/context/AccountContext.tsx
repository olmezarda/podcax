import React, { createContext, ReactNode, useContext } from 'react';

type AccountType = 'creator' | 'listener'

const AccountContext = createContext<AccountType>('listener')

export const AccountProvider = ({ accountType, children }: { accountType: AccountType; children: ReactNode }) => (
  <AccountContext.Provider value={accountType}>{children}</AccountContext.Provider>
)

export const useAccountType = () => useContext(AccountContext)

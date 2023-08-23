import { useState, createContext } from "react";

// Account interface
export interface IAccountInfo {
  id: number;
  username: string;
  password: string;
  address: {
    province: string;
    city: string;
    zipcode: string;
  };
  isLogined: boolean;
}

// Local storage's key
export const local_account_info_key = "local_account_info";

// Load Local Storage's Data
export const LoadLocalAccountInfo = () => {
  let account_list: IAccountInfo[] = [];
  const local_account_info = localStorage.getItem(local_account_info_key);
  if (local_account_info) {
    const account_info_json = JSON.parse(local_account_info);
    if (account_info_json) {
      account_list = account_info_json;
    }
  }
  return account_list;
};

// Save Local Storage's Data
export const SaveLocalStorage = (new_account_state: IAccountInfo[]) => {
  localStorage.setItem(
    local_account_info_key,
    JSON.stringify(new_account_state)
  );
};

// Export Login Info to Other components
export function AccountService() {
  // Check Account is logged or not
  const HasLoginedAccount = () => {
    return account_state.some((account) => account.isLogined);
  };
  // Get Current Account
  const GetCurrentAccount = () => {
    return account_state.find((account) => account.isLogined);
  };
  // Get Current Account's Index
  const GetCurrentAccountIndex = () => {
    return account_state.findIndex((account) => account.isLogined === true);
  };
  // Check Duplicate Username
  const HasDuplicatedUsername = (new_username: string) => {
    return account_state.some((account) => account.username === new_username);
  };

  const [account_state, setAccountState] = useState(LoadLocalAccountInfo());
  return {
    account_state,
    setAccountState,
    HasLoginedAccount,
    GetCurrentAccount,
    GetCurrentAccountIndex,
    HasDuplicatedUsername,
  };
}

export interface IAccountService {
  account_state: IAccountInfo[];
  setAccountState: React.Dispatch<React.SetStateAction<IAccountInfo[]>>;
  HasLoginedAccount: () => boolean;
  GetCurrentAccount: () => IAccountInfo | undefined;
  GetCurrentAccountIndex: () => number;
  HasDuplicatedUsername: (new_username: string) => boolean;
}

export const AccountContext = createContext<null | IAccountService>(null);

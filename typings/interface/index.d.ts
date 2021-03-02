export as namespace Myze;

export interface NewAccount {
  id?: number;
  name: string;
  balance: number;
  type: string;
}

export interface NewTransaction {
  id?: number;
  account_id: number;
  category_id?: number;
  date: string;
  description: string;
  type: string;
  amount: number;
  vendor: Vendor;
}

export interface Account {
  readonly id: number;
  readonly name: string;
  balance: number;
  readonly type: string;
  readonly transactions: { [key: string]: { [key: number]: Transaction } };
  readonly recurring: Array<object>;
}

export interface Transaction {
  readonly id: number;
  readonly account_id: number;
  readonly category_id?: number;
  readonly date: string;
  readonly description: string;
  readonly type: string;
  readonly amount: number;
  readonly vendor: Vendor;
}

export interface Vendor {
  readonly id: number;
  readonly name: string;
}

export interface AccountStoreState {
  initialized: boolean;
  accounts: { [key: number]: Account };
  accountsByType?: Object;
  groupedTransactionsByAccount: Object;
}

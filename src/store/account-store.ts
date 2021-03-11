import AccountApi from "@/api/AccountApi.js";
import RecurringApi from "@/api/RecurringApi";
import dayjs from "dayjs";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/api/TransactionApi";
import { createVendor, addVendor } from "@/store/vendor";
import { reactive, readonly, computed, ComputedRef } from "vue";

class AccountStore {
  state: Myze.AccountStoreState;
  accountTypes: Object;
  availableBalance: ComputedRef<number>;
  getTransactionsByDate: ComputedRef;

  constructor() {
    this.state = reactive({
      initialized: false,
      accounts: {},
      accountsByType: null,
      groupedTransactionsByAccount: {},
    });

    this.accountTypes = readonly({
      CHEQUING: "Chequing",
      SAVINGS: "Savings",
      TFSA: "Tax-Free Savings Account",
      MORTGAGE: "Mortgages",
      LOAN: "Loans",
      RRSP: "Retirement Savings Plan",
      RESP: "Education Savings Plan",
    });

    this.state.accountsByType = computed(() => {
      let _accountsByType = {};

      if (
        this.state.accounts !== null &&
        Object.keys(this.state.accounts).length > 0
      ) {
        for (let idx in this.state.accounts) {
          let account = this.state.accounts[idx];

          if (!_accountsByType[account.type]) {
            _accountsByType[account.type] = {
              label: this.accountTypes[account.type],
              balance: 0,
              accounts: [],
            };
          }

          _accountsByType[account.type].balance += parseInt(account.balance);
          _accountsByType[account.type].accounts.push(account);
        }
      }

      return _accountsByType;
    });

    this.availableBalance = computed(() => {
      let availableBalance = 0;

      if (
        this.state.accounts !== null &&
        Object.keys(this.state.accounts).length > 0
      ) {
        for (let idx in this.state.accounts) {
          let account = this.state.accounts[idx];
          availableBalance += parseInt(account.balance);
        }
      }

      return availableBalance;
    });
  }

  async loadAccounts() {
    if (!this.state.initialized) {
      const response = await AccountApi.getAccounts();
      this.setAccounts(response.data);
      this.state.initialized = true;
    }
  }

  async saveTransactions(
    accountId: number,
    date: string,
    transactions: Array<Myze.NewTransaction>
  ) {
    let vendorsAdded = {};

    for (let t of transactions) {
      if (t.vendor.name.length === 0) {
        continue;
      }

      t.date = dayjs(date).format("YYYY-MM-DD");
      t.account_id = accountId;

      if (vendorsAdded[t.vendor.name]) {
        t.vendor = vendorsAdded[t.vendor.name];
      } else if (t.vendor.id === null) {
        // Create a new vendor using the provided name
        t.vendor = await createVendor(t.vendor.name);
        vendorsAdded[t.vendor.name] = t.vendor;
      }

      if (t.id > 0) {
        await updateTransaction(t.id, t);
      } else {
        // Update the original state
        const response = await createTransaction(t);
        t.id = response.data;
      }

      if (!this.getAccount(accountId).transactions[t.date]) {
        this.getAccount(accountId).transactions[t.date] = {};
      }

      // If the transaction already exists, let's remove the previous amount
      if (this.getAccount(accountId).transactions[t.date][t.id]) {
        this.removeTransactionFromAccountBalance(this.getAccount(accountId), t);
      }

      this.getAccount(accountId).transactions[t.date][
        t.id
      ] = t as Myze.Transaction;

      this.addTransactionToAccountBalance(this.getAccount(accountId), t);
    }
  }

  removeTransactionFromAccountBalance(
    account: Myze.Account,
    transaction: Myze.Transaction
  ) {
    if (transaction.type === Myze.TransactionType.Debit) {
      account.balance += transaction.amount;
    } else {
      account.balance -= transaction.amount;
    }
  }

  addTransactionToAccountBalance(
    account: Myze.Account,
    transaction: Myze.Transaction
  ) {
    if (transaction.type === Myze.TransactionType.Debit) {
      account.balance -= transaction.amount;
    } else {
      account.balance += transaction.amount;
    }
  }

  async removeTransaction(transaction: Myze.Transaction) {
    // Delete the transaction from DB
    await deleteTransaction(transaction.id);
    const account = this.getAccount(transaction.account_id);

    // Update the account balance
    if (transaction.type === Myze.TransactionType.Debit) {
      account.balance += transaction.amount;
    } else {
      account.balance -= transaction.amount;
    }

    // If there's only one transaction left for this date, let's delete it all, otherwise we will delete the transaction
    if (Object.keys(account.transactions[transaction.date]).length === 1) {
      delete account.transactions[transaction.date];
    } else {
      delete account.transactions[transaction.date][transaction.id];
    }
  }

  setAccounts(accounts: { [key: number]: Myze.Account }) {
    for (let accountId in accounts) {
      this.state.accounts[accountId] = accounts[accountId] as Myze.Account;
    }
  }

  getAccount(id: number): Myze.Account {
    return this.state.accounts[id];
  }

  async createAccount(newAccount: Myze.NewAccount): Promise<Myze.Account> {
    const response = await AccountApi.createAccount(newAccount);

    const account: Myze.Account = {
      id: response.data.account_id,
      ...newAccount,
      transactions: {},
      recurring: [],
    };

    this.state.accounts[account.id] = account;

    return account;
  }

  async saveRecurring(
    newRecurring: Myze.NewRecurring
  ): Promise<Myze.Recurring> {
    const response = await RecurringApi.createRecurring(newRecurring);

    if (response.data.vendor_id) {
      newRecurring.vendor = {
        id: response.data.vendor_id,
        name: newRecurring.vendor.name,
      };

      addVendor(newRecurring.vendor);
    }

    const recurring: Myze.Recurring = {
      id: response.data.recurring_id,
      ...newRecurring,
    };

    this.state.accounts[recurring.account_id].recurring[
      recurring.id
    ] = recurring;

    return recurring;
  }

  async deleteAccount(accountId: number) {
    await AccountApi.deleteAccount(accountId);
    delete this.state.accounts[accountId];
  }
}

export const accountStore = new AccountStore();

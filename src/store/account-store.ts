import AccountApi from "@/api/AccountApi.js";
import RecurringApi from "@/api/RecurringApi";
import { reactive, readonly, computed, ComputedRef } from "vue";
import { realm } from "@/realm";

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

          _accountsByType[account.type].balance += parseInt(
            account.current_balance
          );
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
          availableBalance += parseInt(account.current_balance);
        }
      }

      return availableBalance;
    });
  }

  async loadAccounts() {
    if (!this.state.initialized) {
      const accounts = await realm.collections.accounts.aggregate([
        {
          $match: {
            users: realm.currentUser.value.id,
            deleted: false,
          },
        },
        {
          $lookup: {
            from: "recurring",
            localField: "_id",
            foreignField: "account_id",
            as: "recurring",
          },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "_id",
            foreignField: "account_id",
            as: "transactions",
          },
        },
      ]);

      accounts.forEach((account) => {
        const mappedRecurring = {};

        account.recurring.forEach((r) => {
          mappedRecurring[r._id.toString()] = r;
        });

        account.recurring = mappedRecurring;

        const mappedTransactions = {};

        account.transactions.forEach((t) => {
          mappedTransactions[t._id.toString()] = t;
        });

        account.transactions = mappedTransactions;

        this.state.accounts[account._id.toString()] = account;
      });

      this.state.initialized = true;
    }
  }

  async saveTransaction(transaction) {
    const accountId = transaction.account_id.toString();

    // Create the vendor if it doesn't exist
    if (transaction.vendor.id === null) {
      // Create the vendor account
      const res = await realm.collections.vendors.insertOne({
        userId: realm.currentUser.value.id,
        name: transaction.vendor.name,
      });

      transaction.vendor.id = res.insertedId.toString();
    }

    if (transaction.hasOwnProperty("_id")) {
      await realm.collections.transactions.updateOne(
        {
          _id: transaction._id,
        },
        transaction
      );

      let existingTransaction = this.state.accounts[accountId].transactions[
        transaction._id.toString()
      ];

      // If the transaction already exists, let's remove the previous amount
      if (existingTransaction) {
        this.removeTransactionFromAccountBalance(
          this.getAccount(accountId),
          existingTransaction
        );
      }
    } else {
      const response = await realm.collections.transactions.insertOne(
        transaction
      );

      transaction._id = response.insertedId;
    }

    this.state.accounts[accountId].transactions[
      transaction._id.toString()
    ] = transaction;

    this.addTransactionToAccountBalance(
      this.getAccount(accountId),
      transaction
    );

    await realm.collections.accounts.updateOne(
      {
        _id: this.getAccount(accountId)._id,
      },
      {
        $set: {
          current_balance: this.getAccount(accountId).current_balance,
        },
      }
    );
  }

  async addTransactionToAccountBalance(
    account: Myze.Account,
    transaction: Myze.Transaction
  ) {
    if (transaction.type === "DEBIT") {
      account.current_balance -= transaction.amount;
    } else {
      account.current_balance += transaction.amount;
    }
  }

  async removeTransactionFromAccountBalance(
    account: Myze.Account,
    transaction: Myze.Transaction
  ) {
    if (transaction.type === "DEBIT") {
      account.current_balance += transaction.amount;
    } else {
      account.current_balance -= transaction.amount;
    }
  }

  async removeTransaction(transaction: Myze.Transaction) {
    // Delete the transaction from DB

    await realm.collections.transactions.updateOne(
      {
        _id: transaction._id,
      },
      {
        $set: {
          deleted: true,
        },
      }
    );

    const account = this.getAccount(transaction.account_id.toString());

    // Update the account balance
    this.removeTransactionFromAccountBalance(account, transaction);

    await realm.collections.accounts.updateOne(
      {
        _id: account._id,
      },
      {
        $set: {
          current_balance: account.current_balance,
        },
      }
    );
    // If there's only one transaction left for this date, let's delete it all, otherwise we will delete the transaction
    delete account.transactions[transaction._id.toString()];
  }

  getAccount(id: number): Myze.Account {
    return this.state.accounts[id];
  }

  async createAccount(newAccount: Myze.NewAccount): Promise<Myze.Account> {
    const account: Myze.Account = {
      ...newAccount,
      current_balance: newAccount.starting_balance,
      users: [realm.currentUser.value.id],
      deleted: false,
    };

    const res = await realm.collections.accounts.insertOne(account);

    account._id = res.insertedId;
    account.transactions = {};
    account.recurring = {};

    this.state.accounts[account._id.toString()] = account;

    return account;
  }

  async saveRecurring(newRecurring): Promise<Myze.Recurring> {
    // Create the vendor if it doesn't exist
    if (newRecurring.vendor.id === null) {
      // Create the vendor account
      const res = await realm.collections.vendors.insertOne({
        userId: realm.currentUser.value.id,
        name: newRecurring.vendor.name,
      });

      newRecurring.vendor.id = res.insertedId.toString();
    }

    if (newRecurring.hasOwnProperty("_id")) {
      // Update
      await realm.collections.recurring.updateOne(
        {
          _id: newRecurring._id,
        },
        newRecurring
      );

      this.state.accounts[newRecurring.account_id.toString()].recurring[
        newRecurring._id.toString()
      ] = {
        ...newRecurring,
      };
    } else {
      // Create

      const response = await realm.collections.recurring.insertOne(
        newRecurring
      );

      this.state.accounts[newRecurring.account_id.toString()].recurring[
        response.insertedId.toString()
      ] = {
        _id: response.insertedId,
        ...newRecurring,
      };
    }
  }

  async removeRecurring(recurring: Myze.Recurring) {
    await realm.collections.recurring.updateOne(
      {
        _id: recurring._id,
      },
      {
        $set: {
          deleted: false,
        },
      }
    );

    delete this.state.accounts[recurring.account_id.toString()].recurring[
      recurring._id.toString()
    ];
  }

  async deleteAccount(accountId: string) {
    await realm.collections.accounts.updateOne(
      {
        _id: accountId,
      },
      {
        $set: {
          deleted: false,
        },
      }
    );

    delete this.state.accounts[accountId];
  }
}

export const accountStore = new AccountStore();

import AccountApi from "@/api/AccountApi.js";
import { reactive, readonly, computed } from "vue";

class AccountStore {
  constructor() {
    this.state = reactive({
      initialized: false,
      accounts: {},
      accountsByType: null,
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


  setAccounts(accounts) {
    this.state.accounts = accounts;
  }

  getAccount(id) {
    return this.state.accounts[id];
  }

  async createAccount(newAccount) {
    // Add the vendor to the DB
    const response = await AccountApi.createAccount(newAccount);

    // Update the vendor id
    newAccount.id = response.data;

    // Add the vendor to the accountState
    this.state.accounts[newAccount.id] = newAccount;

    // Return the newly created vendor
    return newAccount;
  }
}

export const accountStore = new AccountStore();

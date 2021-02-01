import AccountApi from "@/api/AccountApi.js";
import TransactionApi from "@/api/TransactionApi.js";
import { reactive } from "vue";

const state = reactive({
  accounts: {},
});

function setAccounts(vendors) {
  state.vendors = vendors;
}

async function loadAccounts() {
  const response = await AccountApi.getAccounts();
  setAccounts(response.data);
}

async function createAccount(newAccount) {
  // Add the vendor to the DB
  const response = await AccountApi.createVendor(newAccount);

  // Update the vendor id
  newAccount.id = response.data;

  // Add the vendor to the state
  state.accounts[newAccount.id] = newAccount;

  // Return the newly created vendor
  return newAccount;
}

async function addTransaction(transaction) {}

async function updateTransaction(transaction) {}

function getAccounts() {
  return state.accounts;
}

export { getVendors, loadAccounts, createAccount };

import axios from "./AuthAxios.js";

// Returns account id
export function createAccount(accountData) {
  return axios.post("/accounts", accountData);
}

export function deleteAccount(accountId) {
  return axios.delete("/accounts", {
    data: {
      id: accountId,
    },
  });
}

export function getAccounts() {
  return axios.get("/accounts");
}

export function getAccount(accountId) {
  return axios.get(`/accounts/${accountId}`).catch((err) => false);
}

export default {
  createAccount,
  getAccounts,
  getAccount,
  deleteAccount,
};

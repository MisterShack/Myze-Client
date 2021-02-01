import axios from "./AuthAxios.js";

export function createTransaction(data) {
  return axios.post("/transactions", data);
}

export function updateTransaction(id, data) {
  return axios.put("/transactions/" + id, data);
}

export default {
  createTransaction,
  updateTransaction,
};

import { AxiosResponse } from "axios";
import axios from "./AuthAxios.js";

export function createTransaction(
  data: Myze.NewTransaction
): Promise<AxiosResponse<any>> {
  return axios.post("/transactions", data);
}

export function updateTransaction(
  id: number,
  data: Myze.Transaction
): Promise<AxiosResponse<any>> {
  return axios.put("/transactions/" + id, data);
}

export function deleteTransaction(id: number): Promise<AxiosResponse<any>> {
  return axios.delete("/transactions", {
    data: {
      id,
    },
  });
}

export default {
  createTransaction,
  updateTransaction,
};

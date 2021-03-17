import { AxiosResponse } from "axios";
import axios from "./AuthAxios.js";

export function createRecurring(
  data: Myze.NewRecurring
): Promise<AxiosResponse<any>> {
  return axios.post("/recurring", data);
}

export function updateRecurring(
  id: number,
  data: Myze.Recurring
): Promise<AxiosResponse<any>> {
  return axios.put("/recurring/" + id, data);
}

export function deleteRecurring(id: number): Promise<AxiosResponse<any>> {
  return axios.delete("/recurring", {
    data: {
      id,
    },
  });
}

export default {
  createRecurring,
  updateRecurring,
  deleteRecurring,
};

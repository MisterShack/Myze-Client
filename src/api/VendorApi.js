import axios from "./AuthAxios.js";

export function createVendor(vendorName) {
  return axios.post("/vendors", {
    name: vendorName,
  });
}

export function getVendors() {
  return axios.get(`/vendors`);
}

export default {
  createVendor,
  getVendors,
};

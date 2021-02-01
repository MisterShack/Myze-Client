import VendorApi from "@/api/VendorApi.js";
import { reactive } from "vue";

const state = reactive({
  vendors: {},
});

function setVendors(vendors) {
  state.vendors = vendors;
}

async function loadVendors() {
  const response = await VendorApi.getVendors();
  setVendors(response.data);
}

async function createVendor(name) {
  const vendor = {
    id: null,
    name,
  };

  // Add the vendor to the DB
  const response = await VendorApi.createVendor(name);

  // Update the vendor id
  vendor.id = response.data;

  // Add the vendor to the state
  state.vendors[vendor.id] = vendor;

  // Return the newly created vendor
  return vendor;
}

function getVendors() {
  return state.vendors;
}

export { getVendors, loadVendors, createVendor };

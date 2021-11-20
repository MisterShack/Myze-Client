import { reactive } from "vue";
import { supabase } from "./supabase";

export const store = reactive({
  loading: true,
  user: {},
  accounts: [],
  vendors: [],
  async createVendor(vendorName) {
    const { data, error } = await supabase.from("vendors").insert([
      {
        user_id: store.user.id,
        name: vendorName,
      },
    ]);

    const newVendor = {
      id: data[0].id,
      name: vendorName,
    };

    // Add the new vendor to the store
    store.vendors.push(newVendor);

    return newVendor;
  },
  async upsertTransaction(transaction) {
    // If this is a new vendor, let's save it
    if (transaction.vendors.id == null) {
      // Create new Vendor
      const newVendor = await store.createVendor(transaction.vendors.name);

      // Update the vendor id for the transaction
      transaction.vendors.id = newVendor.id;
    }

    // Let's remove our vendor object and just use the vendor id
    transaction.vendor_id = transaction.vendors.id;
    delete transaction.vendors;

    // Save our transaction data to the DB
    const {
      data: transactionInsertData,
      error: transactionError,
    } = await supabase.from("transactions").upsert([transaction]);

    if (transactionError) {
      alert(transactionError);
    }

    return transactionInsertData[0].id;
  },
  async upsertRecurring(recurring) {
    // If this is a new vendor, let's save it
    if (recurring.vendors.id == null) {
      // Create new Vendor
      const newVendor = await store.createVendor(recurring.vendors.name);

      // Update the vendor id for the transaction
      recurring.vendors.id = newVendor.id;
    }

    // Let's update the vendor id
    recurring.vendor_id = recurring.vendors.id;

    // Since the `vendors` property is a relation, it's not recognized as a column, so let's remove it before inserting.
    const recurringToInsert = {
      ...recurring,
    };

    delete recurringToInsert.vendors;

    // Save our transaction data to the DB
    const {
      data: recurringInsertData,
      error: recurringError,
    } = await supabase.from("recurring").upsert([recurringToInsert]);

    if (recurringError) {
      alert(recurringError);
    }

    recurring = {
      ...recurring,
      ...recurringInsertData[0],
    };

    // Let's add/update the recurring information in the store to allow the reactive nature take effect
    store.accounts[recurring.account_id].recurring[recurring.id] = recurring;

    return recurring.id;
  },
  async removeRecurring(recurring) {
    const { data, error } = await supabase
      .from("recurring")
      .update({ deleted: true })
      .eq("id", recurring.id);

    if (error) {
      alert(error);
    }

    delete store.accounts[recurring.account_id].recurring[recurring.id];
  },
  async loadData() {
    if (store.user) {
      const { data: accounts, error: accountError } = await supabase
        .from("accounts")
        .select(`*`)
        .eq("deleted", false);

      accounts.forEach((account) => {
        account.recurring = {};
        store.accounts[account.id] = account;
      });

      const { data: recurring, error: recurringError } = await supabase
        .from("recurring")
        .select(
          `
        *,
        vendors(id, name)
      `
        )
        .eq("deleted", false);

      recurring.forEach((r) => {
        store.accounts[r.account_id].recurring[r.id] = r;
      });

      const { data: vendors, error: vendorsError } = await supabase
        .from("vendors")
        .select("id, name")
        .eq("user_id", store.user.id);

      store.vendors = vendors;
    } else {
      store.accounts = [];
      store.recurring = [];
      store.vendors = [];
    }

    store.loading = false;
  },
});
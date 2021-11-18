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
        user_id: supabase.auth.user().id,
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

    console.log("Transaction Inserted", transactionInsertData);

    return transactionInsertData[0].id;
  },
  async loadData() {
    if (store.user) {
      const { data: accounts, error: accountError } = await supabase
        .from("accounts")
        .select();

      accounts.forEach((account) => {
        store.accounts[account.id] = account;
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

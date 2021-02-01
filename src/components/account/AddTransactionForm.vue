<template>
  <div class="my-5">
    <label
      for="transaction_date"
      class="block text-sm leading-5 font-medium text-gray-700"
      >Date</label
    >
    <div class="mt-1 relative rounded-md shadow-sm">
      <DatePicker
        :selectedDate="selectedDate"
        @select-date="selectDate"
        Required
      ></DatePicker>
    </div>
  </div>

  <Collapsible v-for="(transaction, key) in state.transactions" :key="key">
    <template #title>
      <span>{{
        transaction.vendor.name.length > 0
          ? transaction.vendor.name
          : "New Transaction"
      }}</span>
      <span>{{ getFormattedTransactionAmount(transaction) }}</span>
    </template>

    <div class="mb-5">
      <label
        for="t_vendor"
        class="block text-sm leading-5 font-medium text-gray-700"
        >Vendor</label
      >
      <VendorDropdown
        :vendors="state.vendors"
        v-model:selectedVendor="transaction.vendor"
      />
    </div>

    <div class="mb-5">
      <label
        for="t_amount"
        class="block text-sm leading-5 font-medium text-gray-700"
        >Amount</label
      >
      <div class="mt-1 relative rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span class="text-gray-500 sm:text-sm sm:leading-5">$</span>
        </div>
        <input
          class="form-input block w-full pl-6 pr-3 py-2 sm:text-sm sm:leading-5"
          placeholder="0.00"
          id="t_amount"
          type="number"
          step="0.01"
          name="StartingBalance"
          :value="transaction.amount / 100"
          @input="transaction.amount = Math.max($event.target.value, 0) * 100"
        />
      </div>
    </div>

    <div>
      <label
        for="t_vendor"
        class="block text-sm leading-5 font-medium text-gray-700"
        >Description</label
      >
      <div class="mt-1 relative rounded-md shadow-sm">
        <textarea
          class="form-input block w-full px-3 py-2"
          v-model="transaction.description"
        ></textarea>
      </div>
    </div>

    <MyzeButton
      class="mt-5"
      theme="Danger"
      @click="removeTransaction(transaction)"
      >Delete</MyzeButton
    >
  </Collapsible>

  <div class="flex justify-between align-middle">
    <MyzeButton theme="Success" @click="addTransaction('DEBIT')"
      >Add Debit</MyzeButton
    >
    <MyzeButton type="Success" @click="addTransaction('CREDIT')"
      >Add Credit</MyzeButton
    >
    <MyzeButton type="Success" @click="save">Save</MyzeButton>
  </div>
</template>

<style scoped>
  .form-input {
    background-color: #fff;
    border-color: #d2d6dc;
    border-width: 1px;
    border-radius: 0.375rem;
  }
</style>

<script>
  import { reactive, watch } from "vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import Collapsible from "@/components/forms/Collapsible.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";
  import { createVendor, getVendors } from "@/store/vendor";
  import {
    createTransaction,
    updateTransaction,
  } from "@/api/TransactionApi.js";
  import dayjs from "dayjs";

  export default {
    props: {
      accountId: {
        type: Number,
        required: true,
      },
      transactions: {
        type: Array,
        default: () => [],
      },
      selectedDate: String,
    },
    components: { DatePicker, Collapsible, VendorDropdown, MyzeButton },
    emits: ["save-transactions", "close"],
    setup(props, { emit }) {
      const state = reactive({
        transactions: [],
        vendors: getVendors(),
      });

      watch(
        () => props.transactions,
        (transactions) => {
          state.transactions = transactions;
        }
      );

      function addTransaction(type) {
        state.transactions.push({
          amount: 0,
          vendor: {
            id: null,
            name: "",
          },
          type: type,
          description: "",
        });
      }

      function getFormattedTransactionAmount(transaction) {
        let formattedAmount = `$${(transaction.amount / 100).toFixed(2)}`;

        if (transaction.type === "DEBIT" && transaction.amount > 0) {
          formattedAmount = "-" + formattedAmount;
        }

        return formattedAmount;
      }

      function selectDate(date) {
        state.selectedDate = date;
        refreshTransactions();
      }

      function refreshTransactions() {
        // TODO - Get Transactions for specific day
        state.transactions = [];
      }

      function removeTransaction(transaction) {
        // Delete Transaction from API
        let transactionIdx = state.transactions.indexOf(transaction);
        state.transactions.splice(transactionIdx, 1);
      }

      async function save() {
        let transactionsSaved = [];
        let vendorsAdded = {};

        for (let t of state.transactions) {
          if (t.vendor.name.length === 0) {
            continue;
          }

          t.date = dayjs(state.selectedDate).format("YYYY-MM-DD");
          t.accountId = props.accountId;

          if (vendorsAdded[t.vendor.name]) {
            t.vendor = vendorsAdded[t.vendor.name];
          } else if (t.vendor.id === null) {
            // Create a new vendor using the provided name
            t.vendor = await createVendor(t.vendor.name);

            vendorsAdded[t.vendor.name] = t.vendor;
          }

          if (t.id > 0) {
            updateTransaction(t.id, t);
          } else {
            // Update the original state
            t.id = await createTransaction(t);
          }

          // Track our original transaction as it has the correct amount.
          transactionsSaved.push(t);
        }

        emit("save-transactions", transactionsSaved);
        emit("close");
      }

      return {
        state,
        addTransaction,
        refreshTransactions,
        removeTransaction,
        getFormattedTransactionAmount,
        save,
        selectDate,
      };
    },
  };
</script>

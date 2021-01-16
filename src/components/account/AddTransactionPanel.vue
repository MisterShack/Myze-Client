<template>
  <Panel>
    <template #title>Add Transactions</template>
    <div class="my-5">
      <label
        for="transaction_date"
        class="block text-sm leading-5 font-medium text-gray-700"
        >Date</label
      >
      <div class="mt-1 relative rounded-md shadow-sm">
        <DatePicker
          :selectedDate="state.selectedDate"
          @select-date="selectDate()"
          Required
        ></DatePicker>
      </div>
    </div>

    <Collapsible
      v-for="(transaction, key) in state.transactions"
      :key="key"
      :active="transaction === state.activeTransaction"
    >
      <template #title>
        <span>{{
          transaction.vendor.name.length > 0
            ? transaction.vendor.name
            : "New Transaction"
        }}</span>
        <span>${{ transaction.amount }}</span>
      </template>

      <div class="mb-5">
        <label
          for="t_vendor"
          class="block text-sm leading-5 font-medium text-gray-700"
          >Vendor</label
        >
        <VendorDropdown
          :vendors="state.vendors"
          :selectedVendor="transaction.vendor"
          @select-vendor="transaction.vendor = $event"
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
            v-model.number="transaction.amount"
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

      <MyzeButton class="mt-5" theme="Danger">Delete</MyzeButton>
    </Collapsible>

    <div class="flex justify-between align-middle">
      <MyzeButton theme="Success" @click="addDebit()">Add Debit</MyzeButton>
      <MyzeButton type="Success" @click="addCredit()">Add Credit</MyzeButton>
      <MyzeButton type="Success" @click="save()">Save</MyzeButton>
    </div>
  </Panel>
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
  import { reactive } from "vue";
  import Panel from "@/components/Panel.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import Collapsible from "@/components/forms/Collapsible.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";
  export default {
    props: {
      accountId: Number,
      transactions: [Array, null],
      selectedDate: {
        type: [Date, null],
        default: () => new Date(),
      },
    },
    components: { DatePicker, Collapsible, VendorDropdown, MyzeButton, Panel },
    emits: ["delete-transaction"],
    setup(props, context) {
      const state = reactive({
        transactions: props.transactions || [],
        selectedDate: props.selectedDate,
        activeTransaction: null,
        vendors: [
          {
            id: 67,
            name: "Amazon",
          },
          {
            id: 102,
            name: "Microsoft",
          },
        ],
      });

      function addDebit() {
        state.activeTransaction = {
          amount: 0,
          vendor: {
            id: null,
            name: "",
          },
          type: "DEBIT",
          description: "",
        };
        state.transactions.push(state.activeTransaction);
      }

      function addCredit() {
        state.activeTransaction = {
          amount: 0,
          vendor: {
            id: null,
            name: "",
          },
          type: "CREDIT",
          description: "",
        };
        state.transactions.push(state.activeTransaction);
      }

      function selectDate(date) {
        state.selectedDate = date;
        refreshTransactions();
      }

      function refreshTransactions() {
        state.transactions = [];
      }

      function removeTransaction() {
        // Delete Transaction from API

        let transactionIdx = state.transactions.indexOf(
          state.activeTransaction
        );
        state.transactions.splice(transactionIdx, 1);

        context.emit("delete-transaction", state.activeTransaction);

        if (state.transactions.length > 0) {
          state.activeTransaction =
            state.transactions[state.transactions.length - 1];
        } else {
          state.activeTransaction = null;
        }
      }

      function save() {
        console.log(state.transactions);
        // let transactionsSaved = [];
        // let vendorsAdded = {};

        // for (let transaction of state.transactions) {
        //   if (transaction.vendor.name.length === 0) {
        //     continue;
        //   }

        //   if (vendorsAdded[transaction.vendor.name]) {
        //     transaction.vendor = vendorsAdded[transaction.vendor.name];
        //   } else if (transaction.vendor.id === null) {
        //     transaction.vendor.id = 0; //TODO Implement vendor repo insert and return ID
        //     vendorsAdded[transaction.vendor.name] = transaction.vendor;
        //   }

        // transaction.date = state.selectedDate;

        //   if (transaction.id > 0) {
        //     // UPDATE Transaction
        //   } else {
        //     transaction.accountId = props.accountId;
        //     transaction.id = 0; //TODO Implement transaction report insert and return ID
        //   }

        //   transactionsSaved.push(transaction);
        // }

        // context.emit("save-transactions", transactionsSaved);
        // state.show = false;
      }

      return {
        state,
        addDebit,
        addCredit,
        refreshTransactions,
        removeTransaction,
        save,
        selectDate,
      };
    },
  };
</script>

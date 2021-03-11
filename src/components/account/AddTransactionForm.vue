<template>
  <div class="my-5">
    <label
      for="transaction_date"
      class="block text-sm leading-5 font-medium text-gray-700"
      >Date</label
    >
    <div class="mt-1 relative rounded-md shadow-sm">
      <DatePicker
        :selectedDate="state.selectedDate"
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
      <span>${{ (transaction.amount / 100).toFixed(2) }}</span>
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

    <MyzeButton class="mt-5" theme="Danger" @click="removeTransaction(key)"
      >Delete</MyzeButton
    >
  </Collapsible>

  <div class="flex justify-between align-middle">
    <MyzeButton theme="Success" @click="addTransaction('DEBIT')"
      >Add Debit</MyzeButton
    >
    <MyzeButton theme="Success" @click="addTransaction('CREDIT')"
      >Add Credit</MyzeButton
    >
    <MyzeButton theme="Success" @click="save">Save</MyzeButton>
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
  import { getVendors } from "@/store/vendor";
  import { accountStore } from "@/store/account-store.ts";

  import Collapsible from "@/components/forms/Collapsible.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";

  export default {
    props: {
      account: {
        type: Object,
        required: true,
      },
      selectedDate: String,
    },
    components: { DatePicker, Collapsible, VendorDropdown, MyzeButton },
    emits: ["close"],
    setup(props, { emit }) {
      const state = reactive({
        vendors: getVendors(),
        selectedDate: props.selectedDate,
        transactions: [],
        transactionsByDate: props.account.transactions,
      });

      watch(
        () => props.selectedDate,
        (selectedDate) => {
          selectDate(selectedDate);
        }
      );

      function refreshTransactions() {
        state.transactions = [];

        if (state.transactionsByDate[state.selectedDate]) {
          Object.values(state.transactionsByDate[state.selectedDate]).forEach(
            (transaction) => {
              state.transactions.push(
                Object.fromEntries(Object.entries(transaction))
              );
            }
          );
        }
      }

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

      function selectDate(date) {
        state.selectedDate = date;
        refreshTransactions();
      }

      async function removeTransaction(transactionIdx) {
        // Remove from DB, and local store
        await accountStore.removeTransaction(
          state.transactions[transactionIdx]
        );

        // Remove from this panel list
        state.transactions.splice(transactionIdx, 1);
      }

      // TODO - Move to a service/store file
      async function save() {
        await accountStore.saveTransactions(
          props.account.id,
          state.selectedDate,
          state.transactions
        );
        emit("close");
      }

      return {
        state,
        addTransaction,
        removeTransaction,
        save,
        selectDate,
      };
    },
  };
</script>

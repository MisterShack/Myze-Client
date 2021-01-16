<template>
  <div class="bg-blue-100 text-blue-900 shadow-md rounded-lg py-3 px-4 mb-5">
    <p class="text-md font-bold">Recurring Suggestion</p>
    <p class="text-sm">
      We noticed that you have multiple transactions from David's Tea for
      $15.99. Click here to make this a recurring transaction.
    </p>
  </div>

  <div class="bg-white shadow-md rounded-lg p-6 pb-1">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide mb-3">Transactions</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
        @click="openTransactionPanel(new Date())"
      >
        Add
      </button>
    </div>
    <ul class="my-6">
      <template
        v-for="(transactions, date) in state.transactionsByDate"
        :key="date"
      >
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          {{ date }}
        </li>
        <li class="mb-5" @click="openTransactionPanel(transactions.Key)">
          <ul>
            <li
              v-for="(transaction, key) in transactions"
              :key="key"
              class="py-1 flex items-center justify-between text-gray-600"
            >
              <div>
                <p>{{ transaction.vendor.name }}</p>
                <p class="text-xs text-gray-400">
                  {{ transaction.description }}
                </p>
              </div>
              <span class="text-lg">{{ transaction.formattedAmount }}</span>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
  <TransactionPanel
    :show="state.showTransactionPanel"
    @close="state.showTransactionPanel = false"
  />
</template>

<script>
  import { reactive } from "vue";
  import TransactionPanel from "@/components/account/AddTransactionPanel.vue";

  export default {
    props: {
      accountId: Number,
      transactions: [Array, null],
    },
    components: { TransactionPanel },
    setup() {
      const state = reactive({
        selectedDate: null,
        transactionsByDate: [],
        showTransactionPanel: false,
      });

      function openTransactionPanel(date) {
        state.selectedDate = date;
        state.showTransactionPanel = true;
      }

      return {
        state,
        openTransactionPanel,
      };
    },
  };
</script>

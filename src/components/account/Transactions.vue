<template>
  <div
    v-if="notifications.length > 0"
    class="bg-blue-100 text-blue-900 shadow-md rounded-lg py-3 px-4 mb-5"
  >
    <p class="text-md font-bold">Recurring Suggestion</p>

    <p class="text-sm">
      We noticed that you have multiple transactions from David's Tea for
      $15.99. Click here to make this a recurring transaction.
    </p>
  </div>

  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide">Transactions</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
        @click="openTransactionPanel('2021-01-26')"
      >
        Add Transaction
      </button>
    </div>
    <p v-if="transactions.length === 0" class="text-center text-gray-500 py-10">
      No transactions to display!
    </p>
    <ul v-else class="my-6">
      <template v-for="(transactions, date) in transactionsByDate" :key="date">
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          {{ date }}
        </li>
        <li class="mb-5" @click="openTransactionPanel(date)">
          <ul>
            <li
              v-for="transaction in transactions"
              :key="`Transaction_${transaction.id}`"
              class="py-1 flex items-center justify-between text-gray-600"
            >
              <div>
                <p>{{ transaction.vendor.name }}</p>
                <p class="text-xs text-gray-400">
                  {{ transaction.description }}
                </p>
              </div>
              <span class="text-lg"
                >$ {{ (transaction.amount / 100).toFixed(2) }}</span
              >
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>

  <Panel
    :active="state.showTransactionPanel"
    @close="state.showTransactionPanel = false"
  >
    <template #title>Add Transactions</template>
    <AddTransactionForm
      :accountId="accountId"
      :transactions="state.selectedTransactions"
      :selectedDate="state.selectedDate"
      @save-transactions="addSavedTransactions($event)"
    />
  </Panel>
</template>

<script>
  import { computed, reactive, watch } from "vue";
  import { getVendors } from "@/store/vendor";
  import Panel from "@/components/Panel.vue";
  import AddTransactionForm from "@/components/account/AddTransactionForm.vue";

  export default {
    props: {
      accountId: Number,
      transactions: {
        type: Array,
        default: [],
      },
      notifications: {
        type: Array,
        default: [],
      },
    },
    components: { Panel, AddTransactionForm },
    setup(props) {
      const state = reactive({
        selectedDate: null,
        selectedTransactions: [],
        showTransactionPanel: false,
        vendors: getVendors(),
      });

      const transactionsByDate = computed(() => {
        let transactionsByDate = {};

        props.transactions.forEach((t) => {
          if (!transactionsByDate[t.date]) {
            transactionsByDate[t.date] = [];
          }

          transactionsByDate[t.date].push(t);
        });

        return transactionsByDate;
      });

      function openTransactionPanel(date) {
        state.selectedTransactions = [];

        if (transactionsByDate.value[date]) {
          transactionsByDate.value[date].forEach((t) =>
            state.selectedTransactions.push({ ...t })
          );
        }

        state.selectedDate = date;
        state.showTransactionPanel = true;
      }

      function addSavedTransactions(savedTransactions) {
        console.log(savedTransactions);
      }

      return {
        state,
        addSavedTransactions,
        openTransactionPanel,
        transactionsByDate,
      };
    },
  };
</script>

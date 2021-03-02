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
        @click="openTransactionPanel(new Date().toISOString().substring(0, 10))"
      >
        Add Transaction
      </button>
    </div>
    <p
      v-if="state.transactionsByDate === 0"
      class="text-center text-gray-500 py-10"
    >
      No transactions to display!
    </p>
    <ul v-else class="my-6">
      <template v-for="date in state.sortedTransactionDates" :key="date">
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          {{ date }}
        </li>
        <li class="mb-5" @click="openTransactionPanel(date)">
          <ul>
            <li
              v-for="transaction in state.transactionsByDate[date]"
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
    <template v-slot="scope">
      <AddTransactionForm
        :account="account"
        :selectedDate="state.selectedDate"
        @close="scope.close"
      />
    </template>
  </Panel>
</template>

<script>
  import { reactive, computed, watch } from "vue";
  import { getVendors } from "@/store/vendor";
  import { accountStore } from "@/store/account-store.ts";

  import Panel from "@/components/Panel.vue";
  import AddTransactionForm from "@/components/account/AddTransactionForm.vue";

  export default {
    props: {
      account: {
        required: true,
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
        showTransactionPanel: false,
        vendors: getVendors(),
        transactionsByDate: props.account.transactions,
        sortedTransactionDates: [],
      });

      watch(
        () => props.account.transactions,
        (transactions) => (state.transactionsByDate = transactions)
      );

      accountStore.loadAccounts().then(() => {
        state.sortedTransactionDates = computed(() =>
          Object.keys(state.transactionsByDate).sort(
            (a, b) => new Date(b) - new Date(a)
          )
        );
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

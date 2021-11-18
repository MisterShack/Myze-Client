<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide">Transactions</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
        @click="openTransactionPanel()"
      >
        Add Transaction
      </button>
    </div>
    <p
      v-if="Object.keys(transactionsByDate).length === 0"
      class="text-center text-gray-500 py-10"
    >
      No transactions to display!
    </p>
    <ul v-else class="my-6">
      <template v-for="date in sortedTransactionDates" :key="date">
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          {{ dayjs(date).format("MMMM DD") }}
        </li>
        <li class="mb-5">
          <ul>
            <li
              v-for="transaction in transactionsByDate[date]"
              :key="`Transaction_${transaction.id}`"
              class="py-1 flex items-center justify-between text-gray-600"
              @click="openTransactionPanel(transaction._id.toString())"
            >
              <div>
                <p>{{ transaction.vendor.name }}</p>
                <p class="text-xs text-gray-400">
                  {{ transaction.description }}
                </p>
              </div>
              <span class="text-lg">{{
                new Currency(
                  transaction.amount /
                    ((account.type === "CREDIT_CARD" &&
                      transaction.type === "CREDIT") ||
                    (account.type !== "CREDIT_CARD" &&
                      transaction.type === "DEBIT")
                      ? -100
                      : 100)
                ).format()
              }}</span>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>

  <Panel v-model:active="state.showTransactionPanel">
    <template #title
      >{{ state.transactionToEdit ? "Edit" : "Add" }} Transaction</template
    >
    <template v-slot="scope">
      <AddTransactionForm
        :account="account"
        :vendors="vendors"
        :transactionId="state.transactionToEdit"
        @close="scope.close"
      />
    </template>
  </Panel>
</template>

<script>
  import { reactive, computed } from "vue";
  import Currency from "@/helpers/Currency";
  import dayjs from "dayjs";

  import Panel from "@/components/Panel.vue";
  import AddTransactionForm from "@/components/account/AddTransactionForm.vue";

  export default {
    props: {
      account: {
        required: true,
      },
      vendors: {
        type: Object,
        required: true,
      },
    },
    components: { Panel, AddTransactionForm },
    setup(props) {
      const state = reactive({
        transactionToEdit: null,
        showTransactionPanel: false,
        transactions: props.account.transactions,
      });

      const sortedTransactionDates = computed(() =>
        Object.keys(transactionsByDate.value).sort(
          (a, b) => new Date(b) - new Date(a)
        )
      );

      const transactionsByDate = computed(() => {
        const transactionsByDate = {};

        Object.values(state.transactions).forEach((t) => {
          if (!transactionsByDate[t.date]) {
            transactionsByDate[t.date] = {};
          }

          transactionsByDate[t.date][t._id.toString()] = t;
        });

        return transactionsByDate;
      });

      function openTransactionPanel(transactionId) {
        state.transactionToEdit = transactionId;
        state.showTransactionPanel = true;
      }

      return {
        state,
        sortedTransactionDates,
        transactionsByDate,
        openTransactionPanel,
        Currency,
        dayjs,
      };
    },
  };
</script>

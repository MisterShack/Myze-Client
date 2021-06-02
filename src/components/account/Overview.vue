<template>
  <div
    v-if="Object.keys(notifications).length > 0"
    class="bg-green-100 text-green-900 shadow-md rounded-lg py-3 px-4 mb-5"
  >
    <p class="text-md font-bold">Keep it up!</p>
    <p class="text-sm">
      Your cash flow was up $587 in December compared to November. Go even
      higher this month!
    </p>
  </div>

  <div
    class="flex space-y-5 lg:space-y-0 flex-col lg:space-x-5 lg:flex-row lg:justify-between lg:items-baseline mb-10"
  >
    <div
      class="bg-yellow-50 h-auto lg:flex-1 border border-yellow-300 pt-4 px-6"
    >
      <h2 class="text-lg text-yellow-900 tracking-wide mb-3">
        Upcoming Transactions
        <span class="text-xs text-gray-600">(Next four weeks)</span>
      </h2>
      <p
        v-if="Object.values(state.futureTransactions).length === 0"
        class="text-center pt-5 pb-10 text-yellow-900"
      >
        No upcoming transactions!
      </p>
      <ul v-else class="my-6">
        <template v-for="date in orderedFutureTransactionDates" :key="date">
          <li
            class="text-yellow-800 text-sm border-b border-yellow-800 pb-1 border-opacity-30"
          >
            {{ dayjs(date).format("MMMM D") }}
          </li>
          <li
            v-for="(transaction, key) in state.futureTransactions[date]"
            :key="`${date}_${key}`"
          >
            <ul>
              <li
                class="py-1 mb-2 flex items-center justify-between text-gray-600"
              >
                <span>{{ transaction.vendor.name }}</span>
                <span class="text-lg">{{
                  new Currency(
                    transaction.amount /
                      ((transaction.type === "DEBIT" &&
                        account.type === "CREDIT_CARD") ||
                      (transaction.type === "CREDIT" &&
                        account.type !== "CREDIT_CARD")
                        ? 100
                        : -100)
                  ).format()
                }}</span>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
    <div
      class="bg-light-blue-50 h-auto lg:flex-1 border border-blue-200 pt-4 px-6"
    >
      <h2 class="text-lg text-light-blue-900 tracking-wide mb-3">
        Latest Transactions
      </h2>
      <p
        v-if="Object.keys(state.account.transactions).length === 0"
        class="text-center pt-5 pb-10 text-gray-500"
      >
        No transactions to display
      </p>
      <ul v-else class="my-6">
        <template
          v-for="(transactions, date) in latestTransactions"
          :key="date"
        >
          <li
            class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
          >
            {{ dayjs(date).format("MMMM D") }}
          </li>
          <li>
            <ul class="mb-5">
              <li
                v-for="transaction in transactions"
                :key="transaction._id.toString()"
                class="py-1 flex items-center justify-between text-gray-600"
              >
                <span>{{ transaction.vendor.name }}</span>
                <span class="text-lg">{{
                  new Currency(
                    transaction.amount /
                      ((transaction.type === "DEBIT" &&
                        account.type === "CREDIT_CARD") ||
                      (transaction.type === "CREDIT" &&
                        account.type !== "CREDIT_CARD")
                        ? 100
                        : -100)
                  ).format()
                }}</span>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
  import { computed, reactive, watch } from "vue";

  import dayjs from "dayjs";
  import Currency from "@/helpers/Currency";
  import RecurringService from "@/services/RecurringService.ts";

  export default {
    props: {
      account: {
        type: Object,
        required: true,
      },
      notifications: {
        type: Object,
        default: {},
      },
    },
    setup(props) {
      const state = reactive({
        account: props.account,
        futureTransactions: RecurringService.generateFutureTransactions(
          props.account._id.toString(),
          dayjs()
            .add(4, "week")
            .format("YYYY-MM-DD")
        ),
      });

      const orderedFutureTransactionDates = computed(() =>
        Object.keys(state.futureTransactions).sort()
      );

      watch(
        () => props.account,
        (account) => {
          state.account = account;
          state.futureTransactions = RecurringService.generateFutureTransactions(
            props.account._id.toString(),
            dayjs()
              .add(2, "week")
              .format("YYYY-MM-DD")
          );
        }
      );

      const latestTransactions = computed(() => {
        let latestTransactions = {};
        let numberOfTransactions = 5;

        let transactions = Object.values(props.account.transactions)
          .reverse()
          .slice(0, numberOfTransactions);

        transactions.forEach((t) => {
          if (!latestTransactions[t.date]) {
            latestTransactions[t.date] = {};
          }

          latestTransactions[t.date][t._id.toString()] = t;
        });

        return latestTransactions;
      });

      return {
        state,
        latestTransactions,
        Currency,
        dayjs,
        orderedFutureTransactionDates,
      };
    },
  };
</script>

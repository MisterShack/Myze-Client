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
    v-else
    class="flex space-y-5 flex-col lg:space-x-5 lg:flex-row lg:justify-between lg:items-baseline"
  >
    <div class="bg-white h-auto lg:flex-1 shadow-md rounded-lg p-6 pb-0">
      <h2 class="text-lg tracking-wide mb-3">Upcoming</h2>
      <p
        v-if="Object.values(state.futureTransactions).length === 0"
        class="text-center pt-5 pb-10 text-gray-500"
      >
        No upcoming transactions!
      </p>
      <ul v-else class="my-6">
        <template
          v-for="(transactions, date) in state.futureTransactions"
          :key="date"
        >
          <li
            class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
          >
            {{ date }}
          </li>
          <li
            v-for="(transaction, key) in transactions"
            :key="`${date}_${key}`"
          >
            <ul>
              <li
                class="py-1 mb-2 flex items-center justify-between text-gray-600"
              >
                <span>{{ transaction.vendor.name }}</span>
                <span class="text-lg">{{
                  new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(transaction.amount / 100)
                }}</span>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
    <div class="bg-white h-auto lg:flex-1 shadow-md rounded-lg p-6 pb-0">
      <h2 class="text-lg tracking-wide mb-3">Latest</h2>
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
            {{ date }}
          </li>
          <li>
            <ul class="mb-5">
              <li
                v-for="transaction in transactions"
                :key="transaction._id.toString()"
                class="py-1 mb-2 flex items-center justify-between text-gray-600"
              >
                <span>{{ transaction.vendor.name }}</span>
                <span class="text-lg">{{
                  new Intl.NumberFormat("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  }).format(transaction.amount / 100)
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

        let transactions = Object.values(props.account.transactions).slice(
          0,
          numberOfTransactions
        );

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
      };
    },
  };
</script>

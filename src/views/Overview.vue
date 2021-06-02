<template>
  <PageHeader class="inline-block pb-5">
    Overview
  </PageHeader>
  <p v-if="state.loading" class="text-gray-500">Loading...</p>
  <div
    v-else-if="Object.keys(accountStore.state.accountsByType).length === 0"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p class="text-2xl font-bold">No accounts found!</p>
    <p class="mt-5">
      Please go to your
      <router-link class="text-yellow-600" to="/accounts">accounts</router-link>
      page to add one!
    </p>
  </div>
  <template v-else>
    <div class="my-5">
      <p class="text-gray-800 text-4xl md:text-3xl">
        {{ new Currency(accountStore.availableBalance.value / 100).format() }}
      </p>
      <p class="text-sm text-gray-500">Available</p>
    </div>

    <div class="h-auto lg:w-2/3 lg:flex-1 pt-4 my-5">
      <h2 class="text-2xl font-medium text-gray-800 mb-3">
        Last Transactions
      </h2>
      <ul>
        <template
          v-for="(transactions, date) in latestTransactions"
          :key="date"
        >
          <li class=" mt-5">
            {{ dayjs(date).format("MMMM DD") }}
          </li>
          <li class="border-b last:border-b-0">
            <ul class="mb-5 border-gray-200">
              <li
                v-for="t in transactions"
                :key="t._id.toString()"
                class="py-3 my-2 flex items-center justify-between text-lg font-medium text-gray-700"
              >
                <span>{{ t.vendor.name }}</span>
                <span>{{
                  new Currency(
                    t.amount /
                      ((t.type === "DEBIT" &&
                        accountStore.state.accounts[t.account_id].type ===
                          "CREDIT_CARD") ||
                      (t.type === "CREDIT" &&
                        accountStore.state.accounts[t.account_id].type !==
                          "CREDIT_CARD")
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
  </template>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import dayjs from "dayjs";
  import { reactive } from "vue";
  import { accountStore } from "@/store/account-store";
  import Currency from "@/helpers/Currency";
  import PageHeader from "@/components/PageHeader.vue";

  export default defineComponent({
    components: { PageHeader },
    setup() {
      const state = reactive({
        loading: true,
      });

      accountStore.loadAccounts().then(() => {
        state.loading = false;
      });

      const latestTransactions = computed(() => {
        let latestTransactions = [];
        let latestTransactionsByDate = {};

        // Group the last five transactions for each account
        Object.values(accountStore.state.accounts).forEach(
          (a) =>
            (latestTransactions = [
              ...latestTransactions,
              ...Object.values(a.transactions)
                .reverse()
                .slice(0, 5),
            ])
        );

        // Sort the transactions by date
        latestTransactions.sort((a, b) => {
          if (a.date === b.date) return 0;

          return a.date < b.date ? 1 : -1;
        });

        // Group the transactions by date
        latestTransactions.slice(0, 5).forEach((t) => {
          if (!latestTransactionsByDate[t.date]) {
            latestTransactionsByDate[t.date] = [];
          }

          latestTransactionsByDate[t.date].push(t);
        });

        return latestTransactionsByDate;
      });

      const accountNamesById = computed(() => {
        let accountNames = {};

        Object.values(accountStore.state.accounts).forEach(
          (a) => (accountNames[a._id.toString()] = a.name)
        );

        return accountNames;
      });

      return {
        state,
        accountStore,
        Currency,
        latestTransactions,
        accountNamesById,
        dayjs,
      };
    },
  });
</script>

<template>
  <PageHeader class=" inline-block pb-5">
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
    <div>
      <p class="text-lg font-thin ">Available</p>
      <p class="text-light-blue-700 text-4xl md:text-3xl">
        {{ new Currency(accountStore.availableBalance.value / 100).format() }}
      </p>
    </div>
    <div></div>
    <div
      class="bg-light-blue-50 h-auto lg:flex-1 border border-blue-200 pt-4 px-6 my-5"
    >
      <h2 class="text-lg text-light-blue-900 tracking-wide mb-3">Latest</h2>
      <ul class="my-6">
        <template
          v-for="(transactions, date) in latestTransactions"
          :key="date"
        >
          <li
            class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
          >
            {{ dayjs(date).format("MMMM DD") }}
          </li>
          <li>
            <ul class="mb-5">
              <li
                v-for="t in transactions"
                :key="t._id.toString()"
                class="py-1 flex items-center justify-between text-gray-600"
              >
                <span>{{ t.vendor.name }}</span>
                <span class="text-lg">{{
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

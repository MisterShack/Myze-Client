<template>
  <div v-if="state.loading">
    <p>Loading...</p>
  </div>
  <template v-else>
    <div
      class="flex flex-wrap justify-center py-10 items-center md:justify-between"
    >
      <div class="text-center mb-5 w-full md:text-left md:mb-0 md:w-auto">
        <h1 class="font-thin text-lg mb-5 md:mb-0">{{ state.account.name }}</h1>
        <h3 class="text-4xl text-light-blue-700 md:text-3xl">
          ${{ (state.account.balance / 100).toFixed(2) }}
        </h3>
      </div>
      <div class="flex space-x-4 items-center">
        <template v-for="(label, key) in navLinks" :key="key">
          <a
            v-if="key === state.activeNavigation"
            class="text-sm py-2  px-3 text-white bg-light-blue-700 rounded-md"
            >{{ label }}</a
          >
          <a
            v-else
            class="text-sm p-2 px-3 cursor-pointer opacity-60 hover:opacity-100"
            @click="state.activeNavigation = key"
            >{{ label }}</a
          >
        </template>
      </div>
    </div>

    <template v-if="!state.loading">
      <Overview
        v-if="state.activeNavigation === 'overview'"
        :account="state.account"
      />
      <Transactions
        v-if="state.activeNavigation === 'transactions'"
        :account="state.account"
      />
      <Recurring v-if="state.activeNavigation === 'recurring'" />
    </template>
  </template>
</template>

<script>
  import { reactive } from "vue";
  import { useRoute } from "vue-router";
  import { accountStore } from "@/store/account-store.ts";

  import Overview from "@/components/account/Overview.vue";
  import Transactions from "@/components/account/Transactions.vue";
  import Recurring from "@/components/account/Recurring.vue";

  export default {
    components: { Overview, Transactions, Recurring },
    setup() {
      let route = useRoute();

      const state = reactive({
        loading: true,
        activeNavigation: "overview",
        account: {},
        notifications: [],
      });

      const navLinks = {
        overview: "Overview",
        transactions: "Transactions",
        recurring: "Recurring",
        analytics: "Analytics",
        settings: "Settings",
      };

      accountStore.loadAccounts().then(() => {
        state.account = accountStore.getAccount(route.params.id);
        state.loading = false;
      });

      return {
        state,
        navLinks,
      };
    },
  };
</script>

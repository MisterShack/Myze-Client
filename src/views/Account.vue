<template>
  <div v-if="state.loading">
    <p>Loading...</p>
  </div>
  <template v-else>
    <router-link
      class="flex items-center text-gray-600 cursor-pointer mb-5"
      to="/portfolio"
    >
      <svg
        class="h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span class="pl-1">Back</span>
    </router-link>
    <div
      class="flex flex-wrap justify-center pb-10 items-center md:justify-between"
    >
      <div class="text-center mb-5 w-full md:text-left md:mb-0 md:w-auto">
        <h1 class="font-thin text-lg">{{ state.account.name }}</h1>
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
      <Recurring
        v-if="state.activeNavigation === 'recurring'"
        :account="state.account"
      />

      <Settings
        v-if="state.activeNavigation === 'settings'"
        :account="state.account"
      />
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
  import Settings from "@/components/account/Settings.vue";

  export default {
    components: { Overview, Transactions, Recurring, Settings },
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

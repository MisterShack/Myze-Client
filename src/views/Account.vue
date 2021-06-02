<template>
  <div v-if="state.loading">
    <p>Loading...</p>
  </div>
  <template v-else>
    <div class="flex flex-wrap justify-centeritems-center md:justify-between">
      <div class="text-center mb-5 w-full md:text-left md:mb-0 md:w-auto">
        <h1 class="font-thin text-lg">{{ state.account.name }}</h1>
        <h3 class="text-4xl text-light-blue-700 md:text-3xl">
          {{
            new Currency(
              state.account.current_balance /
                (state.account.type === "CREDIT_CARD" ? -100 : 100)
            ).format()
          }}
        </h3>
      </div>
      <div class="text-center mb-5 w-full md:text-left md:mb-0 md:w-auto">
        <h1 class="font-thin text-lg">
          Est. Balance ({{
            dayjs()
              .add(4, "week")
              .format("MMMM D")
          }})
        </h1>
        <h3 class="text-4xl text-light-blue-700 md:text-3xl">
          {{
            new Currency(
              futureBalance /
                (state.account.type === "CREDIT_CARD" ? -100 : 100)
            ).format()
          }}
        </h3>
      </div>
    </div>

    <div class="flex space-x-4 items-center my-10">
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

    <template v-if="!state.loading">
      <Overview
        v-if="state.activeNavigation === 'overview'"
        :account="state.account"
      />
      <Transactions
        v-if="state.activeNavigation === 'transactions'"
        :account="state.account"
        :vendors="state.vendors"
      />
      <Recurring
        v-if="state.activeNavigation === 'recurring'"
        :account="state.account"
        :vendors="state.vendors"
      />

      <Settings
        v-if="state.activeNavigation === 'settings'"
        :account="state.account"
      />
    </template>
  </template>
</template>

<script>
  import { computed, reactive, onMounted, onUnmounted } from "vue";
  import { useRoute } from "vue-router";
  import { accountStore } from "@/store/account-store.ts";
  import RecurringService from "@/services/RecurringService.ts";
  import dayjs from "dayjs";

  import Overview from "@/components/account/Overview.vue";
  import Transactions from "@/components/account/Transactions.vue";
  import Recurring from "@/components/account/Recurring.vue";
  import Settings from "@/components/account/Settings.vue";
  import Currency from "@/helpers/Currency";

  export default {
    components: { Overview, Transactions, Recurring, Settings },

    setup() {
      let route = useRoute();

      const state = reactive({
        loading: true,
        activeNavigation: "overview",
        account: {},
        vendors: {},
        notifications: [],
        scrollY: 0,
        futureTransactions: {},
      });

      onMounted(() => {
        window.addEventListener("scroll", handleScroll);
      });

      onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
      });

      function handleScroll() {
        state.scrollY = window.scrollY;
      }

      const navLinks = {
        overview: "Overview",
        transactions: "Transactions",
        recurring: "Recurring",
        analytics: "Analytics",
        settings: "Settings",
      };

      const futureBalance = computed(() => {
        let futureBalance = state.account.current_balance;

        Object.values(state.futureTransactions).forEach((transactions) => {
          transactions.forEach(
            (t) => (futureBalance += t.amount * (t.type === "DEBIT" ? -1 : 1))
          );
        });

        return futureBalance;
      });

      accountStore.loadAccounts().then(() => {
        state.account = accountStore.getAccount(route.params.id);
        state.vendors = accountStore.state.vendors;
        state.futureTransactions = RecurringService.generateFutureTransactions(
          state.account._id.toString(),
          dayjs()
            .add(4, "week")
            .format("YYYY-MM-DD")
        );
        state.loading = false;
      });

      return {
        state,
        navLinks,
        Currency,
        dayjs,
        futureBalance,
      };
    },
  };
</script>

<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <template v-else>
    <div class="flex flex-wrap justify-centeritems-center md:justify-between">
      <div class="text-center mb-5 w-full md:text-left md:mb-0 md:w-auto">
        <h1 class="font-thin text-lg">{{ account.name }}</h1>
        <h3 class="text-4xl text-light-blue-700 md:text-3xl">
          {{
            new Currency(
              account.current_balance /
                (account.type === "CREDIT_CARD" ? -100 : 100)
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
              futureBalance / (account.type === "CREDIT_CARD" ? -100 : 100)
            ).format()
          }}
        </h3>
      </div>
    </div>

    <div class="flex space-x-4 items-center my-10">
      <template v-for="(label, key) in navLinks" :key="key">
        <a
          v-if="key === activeNavigation"
          class="text-sm py-2  px-3 text-white bg-light-blue-700 rounded-md"
          >{{ label }}</a
        >
        <a
          v-else
          class="text-sm p-2 px-3 cursor-pointer opacity-60 hover:opacity-100"
          @click="activeNavigation = key"
          >{{ label }}</a
        >
      </template>
    </div>

    <template v-if="!loading">
      <Transactions
        v-if="activeNavigation === 'transactions'"
        :accountId="account.id"
      />
      <Settings
        v-if="activeNavigation === 'settings'"
        :accountId="account.id"
      />

      <Recurring
        v-if="activeNavigation === 'recurring'"
        :accountId="account.id"
      />
      <!-- <Overview v-if="activeNavigation === 'overview'" :account="account" /> -->
    </template>
  </template>
</template>

<script>
  import { computed, reactive, ref } from "vue";
  import { useRoute } from "vue-router";
  import { store } from "@/store";
  import { navLinks } from "@/helpers/Constants";

  import RecurringService from "@/services/RecurringService.js";
  import dayjs from "dayjs";

  // import Overview from "@/components/account/Overview.vue";
  import Transactions from "@/components/account/Transactions.vue";
  import Recurring from "@/components/account/Recurring.vue";
  import Settings from "@/components/account/Settings.vue";
  import Currency from "@/helpers/Currency";

  export default {
    // components: { Overview, Transactions, Recurring, Settings },
    components: { Transactions, Settings, Recurring },

    setup() {
      let route = useRoute();

      const loading = computed(() => {
        return store.loading;
      });

      const activeNavigation = ref("overview");

      const account = computed(() => store.accounts[route.params.id]);

      const vendors = computed(() => store.vendors);

      const futureTransactions = reactive({});

      // futureTransactions = RecurringService.generateFutureTransactions(
      //   account.id,
      //   dayjs()
      //     .add(4, "week")
      //     .format("YYYY-MM-DD")
      // );

      // Generate future transactions from recurring service
      const futureBalance = computed(() => {
        let futureBalance = account.value.current_balance;

        Object.values(futureTransactions).forEach((transactions) => {
          transactions.forEach(
            (t) => (futureBalance += t.amount * (t.type === "DEBIT" ? -1 : 1))
          );
        });

        return futureBalance;
      });

      return {
        loading,
        activeNavigation,
        account,
        vendors,
        futureTransactions,
        navLinks,
        Currency,
        dayjs,
        futureBalance,
      };
    },
  };
</script>

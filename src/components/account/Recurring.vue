<template>
  <div
    v-show="annualCashFlow !== 0"
    class=" shadow-md rounded-lg py-3 px-4 mb-5"
    :class="
      annualCashFlow > 0
        ? `bg-blue-100 text-blue-900`
        : `bg-yellow-100 text-yellow-900`
    "
  >
    <p class="text-md font-bold">
      {{ annualCashFlow > 0 ? "Wooo!" : "Careful!" }}
    </p>
    <p class="text-sm">
      Your annual recurring cash flow for this year is
      {{
        new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
        }).format(annualCashFlow / 100)
      }}
    </p>
  </div>

  <div class="p-6 pb-1">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide">Recurring</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
        @click="openRecurringPanel()"
      >
        Add Recurring
      </button>
    </div>
    <ul class="my-6">
      <template v-for="r in account.recurring" :key="r.id">
        <li
          class="py-1 mb-2 flex items-center justify-between text-gray-600 cursor-pointer"
          @click="openRecurringPanel(r.id)"
        >
          <div>
            <p>{{ r.vendors.name }}</p>
            <p class="text-xs text-gray-400">
              {{ getIntervalText(r) }}
            </p>
          </div>
          <span v-if="r.type === 'DEBIT'" class="text-lg">{{
            new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "CAD",
            }).format((r.amount / 100) * -1)
          }}</span>
          <span v-else class="text-lg">{{
            new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "CAD",
            }).format(r.amount / 100)
          }}</span>
        </li>
      </template>
    </ul>
  </div>

  <Panel v-model:active="showRecurringPanel">
    <template #title>Add Recurring</template>
    <template v-slot="scope">
      <AddRecurringForm
        :accountId="account.id"
        :recurringId="recurringToEdit"
        @close="scope.close"
      />
    </template>
  </Panel>
</template>

<script>
  // Core
  import { ref, computed, watch } from "vue";
  import { store } from "@/store";
  import dayjs from "dayjs";

  // Helpers
  import { recurringTypes } from "@/helpers/Constants";

  // Services
  import RecurringService from "@/services/RecurringService";

  /* Components */
  import Panel from "@/components/Panel.vue";
  import AddRecurringForm from "@/components/account/AddRecurringForm.vue";

  export default {
    props: {
      accountId: {
        type: Number,
        required: true,
      },
    },
    components: { Panel, AddRecurringForm },
    setup(props) {
      const showRecurringPanel = ref(false);
      const recurringToEdit = ref(null);
      const account = computed(() => {
        return store.accounts[props.accountId];
      });
      const annualCashFlow = ref(getAnnualCashFlow());

      watch(
        () => account.value.recurring,
        () => {
          console.log("her");
          annualCashFlow.value = getAnnualCashFlow();
        },
        { deep: true }
      );

      function getAnnualCashFlow() {
        // Since the recurring is indexed by id, let's pass just the values
        return RecurringService.generateAnnualCashFlow(
          Object.values(account.value.recurring)
        );
      }

      function openRecurringPanel(recurringId) {
        recurringToEdit.value = recurringId;
        showRecurringPanel.value = true;
      }

      function getIntervalText(recurring) {
        let interval_text = recurringTypes[recurring.interval];

        if (recurring.start_date === dayjs().format("YYYY-MM-DD")) {
          interval_text += " starting today";
        } else if (dayjs(recurring.start_date) > dayjs()) {
          interval_text +=
            " starting on " + dayjs(recurring.start_date).format("YYYY-MM-DD");
        }

        if (
          recurring.end_date !== null &&
          dayjs(recurring.end_date) > dayjs()
        ) {
          interval_text +=
            " until " + dayjs(recurring.end_date).format("YYYY-MM-DD");
        }

        return interval_text;
      }

      return {
        account,
        showRecurringPanel,
        recurringToEdit,
        annualCashFlow,
        openRecurringPanel,
        getIntervalText,
        getAnnualCashFlow,
      };
    },
  };
</script>

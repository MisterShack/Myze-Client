<template>
  <div
    class="bg-yellow-100 text-yellow-900 shadow-md rounded-lg py-3 px-4 mb-5"
  >
    <p class="text-md font-bold">Careful!</p>
    <p class="text-sm">
      Your annual recurring cash flow for this year is -$54.99. Click here to
      find out how to increase your recurring cash flow.
    </p>
  </div>

  <div class="bg-white shadow-md rounded-lg p-6 pb-1">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide">Recurring</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
        @click="openRecurringPanel()"
      >
        Add
      </button>
    </div>
    <ul class="my-6">
      <template v-for="recurring in state.recurring" :key="recurring.id">
        <li
          class="py-1 mb-2 flex items-center justify-between text-gray-600 cursor-pointer"
          @click="openRecurringPanel(recurring.id)"
        >
          <div>
            <p>{{ recurring.vendor.name }}</p>
            <p class="text-xs text-gray-400">
              {{ getIntervalText(recurring) }}
            </p>
          </div>
          <span class="text-lg"
            >${{ (recurring.amount / 100).toFixed(2) }}</span
          >
        </li>
      </template>
    </ul>
  </div>
  <Panel
    :active="state.showRecurringPanel"
    @close="state.showRecurringPanel = false"
  >
    <template #title>Add Recurring</template>
    <template v-slot="scope">
      <AddRecurringForm
        :account="account"
        :recurringId="state.recurringToEdit"
        @close="scope.close"
      />
    </template>
  </Panel>
</template>

<script>
  import { reactive } from "vue";
  import dayjs from "dayjs";
  import Panel from "@/components/Panel.vue";
  import AddRecurringForm from "@/components/account/AddRecurringForm.vue";
  export default {
    props: {
      account: {
        required: true,
      },
    },
    components: { Panel, AddRecurringForm },
    setup(props) {
      const state = reactive({
        showRecurringPanel: false,
        recurring: props.account.recurring,
        recurringToEdit: null,
      });

      const recurringTypes = {
        "1W": "Every week",
        "2W": "Every two weeks",
        "1M": "Every month",
      };

      function openRecurringPanel(recurringId) {
        state.recurringToEdit = recurringId;
        state.showRecurringPanel = true;
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
        state,
        openRecurringPanel,
        getIntervalText,
      };
    },
  };
</script>

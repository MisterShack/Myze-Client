<template>
  <div class="flex space-x-2">
    <FormField class="flex-1 mb-0">
      <template #label>Start Date</template>
      <DatePicker
        :selectedDate="recurring.start_date"
        @select-date="recurring.start_date = $event"
        required
      ></DatePicker>
    </FormField>

    <FormField class="flex-1 mb-0">
      <template #label>End Date</template>
      <DatePicker
        :selectedDate="recurring.end_date"
        @select-date="recurring.end_date = $event"
        anchor="BR"
      ></DatePicker>
    </FormField>
  </div>

  <div class="flex space-x-2">
    <FormField class="flex-1 mb-0">
      <template #label>Interval</template>
      <SelectMenu
        :options="intervalOptions"
        :selectedKey="recurring.interval"
        @select="recurring.interval = $event"
      />
    </FormField>

    <FormField class="flex-1 mb-0">
      <template #label>Type</template>
      <SelectMenu
        :options="transactionOptions"
        :selectedKey="recurring.type"
        @select="recurring.type = $event"
      />
    </FormField>
  </div>

  <FormField>
    <template #label>Vendor</template>
    <VendorDropdown
      :vendors="vendors"
      v-model:selectedVendor="recurring.vendors"
    />
  </FormField>

  <FormField>
    <template #label>Category</template>
    <VendorDropdown
      :vendors="categories"
      v-model:selectedVendor="recurring.categories"
    />
  </FormField>

  <FormField>
    <template #label>Amount</template>
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <span class="text-gray-500 sm:text-sm sm:leading-5">$</span>
    </div>
    <input
      class="border border-gray-300 rounded-md block w-full pl-6 pr-3 py-2 sm:text-sm sm:leading-5"
      placeholder="0.00"
      id="t_amount"
      type="number"
      step="0.01"
      name="StartingBalance"
      :value="recurring.amount / 100"
      @input="
        recurring.amount = Currency.createFromString($event.target.value).amount
      "
    />
  </FormField>

  <FormField>
    <template #label>Description</template>
    <textarea
      class="border border-gray-300 rounded-md block w-full px-3 py-2"
      v-model="recurring.description"
    ></textarea>
  </FormField>

  <MyzeButton
    v-if="recurring.id !== null"
    class="mt-5"
    theme="Danger"
    @click="removeRecurring"
    >Delete</MyzeButton
  >

  <MyzeButton theme="Success" @click="save">Save</MyzeButton>
</template>

<script>
  // Core
  import { ref, computed } from "vue";
  import { store } from "@/store";
  import dayjs from "dayjs";

  // Helpers
  import Currency from "@/helpers/Currency";
  import { transactionOptions } from "@/helpers/Constants";

  // Components
  import FormField from "@/components/forms/inputs/FormField.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";

  export default {
    props: {
      accountId: {
        type: Number,
        required: true,
      },
      recurringId: Number,
    },
    components: {
      DatePicker,
      VendorDropdown,
      MyzeButton,
      FormField,
      SelectMenu,
    },
    emits: ["close", "form-saved"],
    setup(props, { emit }) {
      // Setup our recurring defaults
      const recurring = ref(getDefaultRecurring());

      // Interval options for recurring transactions
      const intervalOptions = {
        "1W": "Every Week",
        "2W": "Every Two Weeks",
        "1M": "Every Month",
        "1Y": "Every Year",
        Custom: "Custom",
      };

      const account = computed(() => store.accounts[props.accountId]);

      const vendors = computed(() => store.vendors);

      const categories = computed(() => store.categories);

      function getDefaultRecurring() {
        return {
          account_id: props.accountId,
          vendors: {
            id: null,
            name: "",
          },
          categories: {
            id: null,
            name: "",
          },
          description: "",
          amount: 0,
          interval: null,
          type: null,
          start_date: dayjs().format("YYYY-MM-DD"),
          end_date: null,
        };
      }

      if (props.recurringId) {
        recurring.value = { ...account.value.recurring[props.recurringId] };
      }

      async function save() {
        await store.upsertRecurring({ ...recurring.value });
        emit("form-saved");
        emit("close");
      }

      async function removeRecurring() {
        await store.removeRecurring(recurring.value);
        emit("close");
      }

      return {
        recurring,
        transactionOptions,
        intervalOptions,
        save,
        removeRecurring,
        Currency,
        vendors,
        categories,
      };
    },
  };
</script>

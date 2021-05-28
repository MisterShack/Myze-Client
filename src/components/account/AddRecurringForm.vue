<template>
  <div class="flex space-x-2">
    <FormField class="flex-1 mb-0">
      <template #label>Start Date</template>
      <DatePicker
        :selectedDate="state.recurring.start_date"
        @select-date="state.recurring.start_date = $event"
        required
      ></DatePicker>
    </FormField>

    <FormField class="flex-1 mb-0">
      <template #label>End Date</template>
      <DatePicker
        :selectedDate="state.recurring.end_date"
        @select-date="state.recurring.end_date = $event"
        anchor="BR"
      ></DatePicker>
    </FormField>
  </div>

  <div class="flex space-x-2">
    <FormField class="flex-1 mb-0">
      <template #label>Interval</template>
      <SelectMenu
        :options="state.interval_options"
        :selectedKey="state.recurring.interval"
        @select="state.recurring.interval = $event"
      />
    </FormField>

    <FormField class="flex-1 mb-0">
      <template #label>Type</template>
      <SelectMenu
        :options="state.type_options"
        :selectedKey="state.recurring.type"
        @select="state.recurring.type = $event"
      />
    </FormField>
  </div>

  <FormField>
    <template #label>Vendor</template>
    <VendorDropdown
      :vendors="state.vendors"
      v-model:selectedVendor="state.recurring.vendor"
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
      :value="state.recurring.amount / 100"
      @input="
        state.recurring.amount = Currency.createFromString(
          $event.target.value
        ).amount
      "
    />
  </FormField>

  <FormField>
    <template #label>Description</template>
    <textarea
      class="border border-gray-300 rounded-md block w-full px-3 py-2"
      v-model="state.recurring.description"
    ></textarea>
  </FormField>

  <MyzeButton
    v-if="state.recurring.id !== null"
    class="mt-5"
    theme="Danger"
    @click="removeRecurring"
    >Delete</MyzeButton
  >

  <MyzeButton theme="Success" @click="save">Save</MyzeButton>
</template>

<script>
  import { reactive } from "vue";
  import { getVendors } from "@/store/vendor";
  import { accountStore } from "@/store/account-store.ts";
  import Currency from "@/helpers/Currency";
  import dayjs from "dayjs";

  import FormField from "@/components/forms/inputs/FormField.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";

  export default {
    props: {
      account: {
        type: Object,
        required: true,
      },
      recurringId: String,
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
      const state = reactive({
        vendors: getVendors(),
        recurring: getDefaultRecurring(),
        interval_options: {
          "1W": "Every Week",
          "2W": "Every Two Weeks",
          "1M": "Every Month",
          "1Y": "Every Year",
          Custom: "Custom",
        },
        type_options: {
          DEBIT: "Expense",
          CREDIT: "Income",
        },
      });

      function getDefaultRecurring() {
        return {
          account_id: props.account._id,
          vendor: {
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
        state.recurring = { ...props.account.recurring[props.recurringId] };
      }

      async function save() {
        await accountStore.saveRecurring(state.recurring);
        emit("form-saved");
        emit("close");
      }

      async function removeRecurring() {
        // Remove from DB, and local store
        await accountStore.removeRecurring(state.recurring);
        emit("close");
      }

      return {
        state,
        save,
        removeRecurring,
        Currency,
      };
    },
  };
</script>

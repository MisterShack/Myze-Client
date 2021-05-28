<template>
  <FormField>
    <template #label>Date</template>
    <div class="mt-1 relative rounded-md shadow-sm">
      <DatePicker
        :selectedDate="state.transaction.date"
        @select-date="selectDate"
        Required
      ></DatePicker>
    </div>
  </FormField>

  <FormField>
    <template #label>Vendor</template>
    <VendorDropdown
      :vendors="state.vendors"
      v-model:selectedVendor="state.transaction.vendor"
    />
  </FormField>

  <div class="flex -my-5">
    <FormField class="flex-1 mr-5">
      <template #label>Amount</template>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span class="text-gray-500 sm:text-sm sm:leading-5">$</span>
        </div>
        <input
          class="form-input block w-full pl-6 pr-3 py-2 sm:text-sm sm:leading-5"
          placeholder="0.00"
          id="t_amount"
          type="number"
          step="0.01"
          name="StartingBalance"
          :value="state.transaction.amount / 100"
          @input="
            state.transaction.amount = Currency.createFromString(
              $event.target.value
            ).amount
          "
        />
      </div>
    </FormField>
    <FormField class="my-0">
      <template #label>Type</template>
      <SelectMenu
        :options="state.typeOptions"
        v-model:selectedKey="state.transaction.type"
      />
    </FormField>
  </div>

  <FormField>
    <template #label>Description</template>
    <div class="mt-1 relative rounded-md shadow-sm">
      <textarea
        class="form-input block w-full px-3 py-2"
        v-model="state.transaction.description"
      ></textarea>
    </div>
  </FormField>

  <div class="flex justify-between">
    <MyzeButton theme="Success" icon="Save" @click="save">Save</MyzeButton>
    <MyzeButton
      v-if="state.transaction._id"
      theme="Danger"
      icon="Delete"
      @click="remove"
      >Delete</MyzeButton
    >
  </div>
</template>

<style scoped>
  .form-input {
    background-color: #fff;
    border-color: #d2d6dc;
    border-width: 1px;
    border-radius: 0.375rem;
  }
</style>

<script>
  import { reactive } from "vue";
  import { getVendors } from "@/store/vendor";
  import { accountStore } from "@/store/account-store.ts";
  import Currency from "@/helpers/Currency";

  import Collapsible from "@/components/forms/Collapsible.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";

  export default {
    props: {
      account: {
        type: Object,
        required: true,
      },
      transactionId: String,
    },
    components: {
      Collapsible,
      DatePicker,
      FormField,
      MyzeButton,
      SelectMenu,
      VendorDropdown,
    },
    emits: ["close"],
    setup(props, { emit }) {
      const state = reactive({
        vendors: getVendors(),
        transaction: getDefaultTransaction(),
        typeOptions: {
          DEBIT: "Expense",
          CREDIT: "Income",
        },
      });

      function getDefaultTransaction() {
        return {
          date: new Date().toISOString().substr(0, 10),
          account_id: props.account._id,
          amount: 0,
          vendor: {
            id: null,
            name: "",
          },
          type: "DEBIT",
          description: "",
        };
      }

      if (props.transactionId) {
        state.transaction = {
          ...props.account.transactions[props.transactionId],
        };
      }

      function selectDate(date) {
        state.transaction.date = date;
      }

      async function remove() {
        // Remove from DB, and local store
        await accountStore.removeTransaction(state.transaction);
        emit("close");
      }

      // TODO - Move to a service/store file
      async function save() {
        await accountStore.saveTransaction(state.transaction);
        emit("close");
      }

      return {
        state,
        remove,
        save,
        selectDate,
        Currency,
      };
    },
  };
</script>

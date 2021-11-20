<template>
  <FormField>
    <template #label>Date</template>
    <div class="mt-1 relative rounded-md shadow-sm">
      <DatePicker
        :selectedDate="transaction.date"
        @select-date="selectDate"
        Required
      ></DatePicker>
    </div>
  </FormField>

  <FormField>
    <template #label>Vendor</template>
    <VendorDropdown
      :vendors="vendors"
      v-model:selectedVendor="transaction.vendors"
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
          :value="transaction.amount / 100"
          @input="
            transaction.amount = Currency.createFromString(
              $event.target.value
            ).amount
          "
        />
      </div>
    </FormField>
    <FormField class="my-0">
      <template #label>Type</template>
      <SelectMenu
        :options="transactionOptions"
        v-model:selectedKey="transaction.type"
      />
    </FormField>
  </div>

  <FormField>
    <template #label>Description</template>
    <div class="mt-1 relative rounded-md shadow-sm">
      <textarea
        class="form-input block w-full px-3 py-2"
        v-model="transaction.description"
      ></textarea>
    </div>
  </FormField>

  <div class="flex justify-between">
    <MyzeButton theme="Success" icon="Save" @click="save">Save</MyzeButton>
    <MyzeButton
      v-if="transaction.id"
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
  // Core
  import { ref } from "vue";
  import { store } from "@/store";
  import { supabase } from "@/supabase";

  // Helpers
  import Currency from "@/helpers/Currency";
  import { transactionOptions } from "@/helpers/Constants";

  // Components
  import Collapsible from "@/components/forms/Collapsible.vue";
  import DatePicker from "@/components/forms/inputs/DatePicker.vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import VendorDropdown from "@/components/forms/inputs/VendorDropdown.vue";

  export default {
    props: {
      accountId: {
        type: Number,
        required: true,
      },
      transactionToEdit: {
        type: Object,
      },
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
      const transaction = ref(getDefaultTransaction());
      const account = ref(store.accounts[props.accountId]);
      const vendors = ref(store.vendors);

      function getDefaultTransaction() {
        return {
          date: new Date().toISOString().substr(0, 10),
          account_id: props.accountId,
          category_id: 0,
          amount: 0,
          vendors: {
            id: null,
            name: "",
          },
          type: "DEBIT",
          description: "",
        };
      }

      if (props.transactionToEdit) {
        transaction.value = {
          ...props.transactionToEdit,
        };
      }

      function selectDate(date) {
        transaction.date = date;
      }

      async function remove() {
        const { data, error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", transaction.value.id);

        emit("close");
      }

      async function save() {
        if (
          transaction.value.vendors.name.trim().length === 0 ||
          transaction.value.amount === 0
        ) {
          alert("Validation error");
          return false;
        }

        // Create or Update transaction to store. We need to pass a non-reactive object to prevent Vendor dropdown error
        await store.upsertTransaction({ ...transaction.value });

        // Let's update the account current balance
        let { data: current_balance, error } = await supabase.rpc(
          "update_account_current_balances",
          {
            accountid: account.value.id,
          }
        );

        store.accounts[account.value.id].current_balance = current_balance;

        emit("close");
      }

      return {
        transaction,
        transactionOptions,
        remove,
        save,
        selectDate,
        Currency,
        vendors,
      };
    },
  };
</script>

<template>
  <FormField>
    <template #label>Name</template>
    <input
      class="block w-full p-2 m:text-sm sm:leading-5 bg-white border border-gray-300 rounded-md "
      id="account_name"
      v-model="newAccount.name"
    />
  </FormField>

  <FormField>
    <template #label>Type</template>
    <SelectMenu
      :options="accountTypes"
      :selectedKey="newAccount.type"
      @select="newAccount.type = $event"
    />
  </FormField>

  <FormField>
    <template #label>Starting Balance</template>
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <span class="text-gray-500 sm:text-sm sm:leading-5">$</span>
    </div>
    <input
      class="block w-full p-2 pl-6 md:text-sm sm:leading-5 bg-white border border-gray-300 rounded-md"
      type="number"
      step=".01"
      :value="newAccount.starting_balance / 100"
      @input="
        newAccount.starting_balance = Currency.createFromString(
          $event.target.value
        ).amount
      "
    />
  </FormField>

  <myze-button theme="Success" @click="addAccount()">Add Account</myze-button>
</template>

<script>
  import { reactive } from "vue";
  import { supabase } from "@/supabase";

  import MyzeButton from "@/components/MyzeButton.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import { useRouter } from "vue-router";
  import Currency from "@/helpers/Currency";

  export default {
    components: { MyzeButton, FormField, SelectMenu },
    setup() {
      const newAccount = reactive({
        name: "",
        starting_balance: 0,
        users: [supabase.auth.user().id],
        type: null,
      });

      const router = useRouter();

      const accountTypes = {
        CHEQUING: "Chequing",
        CREDIT_CARD: "Credit Card",
        SAVINGS: "Savings",
        TFSA: "Tax-Free Savings",
        LOAN: "Loan",
        LOC: "Line of Credit",
        RRSP: "Retirement Savings Plan",
      };

      async function addAccount() {
        newAccount.current_balance = newAccount.starting_balance;

        // Create the account using the API and redirect to the account page
        const { data: accountsInserted, error } = await supabase
          .from("accounts")
          .insert([newAccount]);

        const insertedAccount = accountsInserted[0];

        store.accounts[insertedAccount.id] = insertedAccount;

        router.push(`/accounts/${insertedAccount.id}`);
      }

      return {
        newAccount,
        accountTypes,
        addAccount,
        Currency,
      };
    },
  };
</script>

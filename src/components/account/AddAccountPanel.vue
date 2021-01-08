<template>
  <Panel>
    <template #title>
      New Account
    </template>

    <FormField>
      <template #label>Name</template>
      <input
        class="block w-full p-2 m:text-sm sm:leading-5 bg-white border border-gray-300 rounded-md "
        id="account_name"
        v-model="state.newAccount.name"
      />
    </FormField>

    <FormField>
      <template #label>Type</template>
      <SelectMenu
        :options="accountTypes"
        :selectedKey="state.newAccount.accountType"
        @select="state.newAccount.accountType = $event"
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
        v-model="state.newAccount.startingBalance"
      />
    </FormField>

    <myze-button theme="Success" @click="addAccount()">Add Account</myze-button>
  </Panel>
</template>

<script>
  import { reactive } from "vue";
  import Panel from "@/components/Panel.vue";
  import MyzeButton from "../MyzeButton.vue";
  import FormField from "@/components/forms/FormField.vue";
  import SelectMenu from "@/components/forms/SelectMenu.vue";
  export default {
    components: { Panel, MyzeButton, FormField, SelectMenu },
    setup() {
      const state = reactive({
        newAccount: {
          name: "",
          startingBalance: 0,
          accountType: null,
        },
      });

      const accountTypes = {
        CHEQUING: "Chequing",
        SAVINGS: "Savings",
        TFSA: "Tax-Free Savings",
        LOAN: "Loan",
        LOC: "Line of Credit",
        RRSP: "Retirement Savings Plan",
      };

      function addAccount() {
        console.log(state.newAccount);
      }

      return {
        state,
        accountTypes,
        addAccount,
      };
    },
  };
</script>

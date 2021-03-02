<template>
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
      :selectedKey="state.newAccount.type"
      @select="state.newAccount.type = $event"
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
      :value="state.newAccount.balance / 100"
      @input="state.newAccount.balance = Math.max($event.target.value, 0) * 100"
    />
  </FormField>

  <myze-button theme="Success" @click="addAccount()" :disabled="!formValidated"
    >Add Account</myze-button
  >
</template>

<script>
  import { computed, reactive } from "vue";
  import MyzeButton from "@/components/MyzeButton.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";
  import SelectMenu from "@/components/forms/inputs/SelectMenu.vue";
  import { accountStore } from "@/store/account-store";
  import { useRouter } from "vue-router";

  export default {
    components: { MyzeButton, FormField, SelectMenu },
    setup() {
      const state = reactive({
        newAccount: {
          name: "",
          balance: 0,
          type: null,
        },
      });

      const router = useRouter();

      const formValidated = computed(() => {
        return (
          state.newAccount.name.length > 0 &&
          state.newAccount.accountType !== null
        );
      });

      const accountTypes = {
        CHEQUING: "Chequing",
        SAVINGS: "Savings",
        TFSA: "Tax-Free Savings",
        LOAN: "Loan",
        LOC: "Line of Credit",
        RRSP: "Retirement Savings Plan",
      };

      async function addAccount() {
        // Create the account using the API and redirect to the account page
        const account = await accountStore.createAccount(state.newAccount);
        console.log(account);
        router.push(`/portfolio/${account.id}`);
      }

      return {
        state,
        accountTypes,
        addAccount,
        formValidated,
      };
    },
  };
</script>

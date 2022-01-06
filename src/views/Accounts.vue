<template>
  <div class="flex mb-5 justify-between items-center">
    <PageHeader>Accounts</PageHeader>
    <myze-button
      v-if="Object.keys(accountsByType).length > 0"
      theme="Success"
      icon="Add"
      @click="showAddAccountPanel = true"
    >
      Account</myze-button
    >
  </div>

  <div
    v-if="Object.keys(accountsByType).length === 0"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p class="text-2xl font-bold">No accounts found!</p>
    <p class="mt-5">
      Add one using the green button below!
    </p>
    <p class="mt-5">
      <myze-button
        class="mx-auto"
        theme="Success"
        icon="Add"
        @click="showAddAccountPanel = true"
      >
        Account</myze-button
      >
    </p>
  </div>
  <template v-else>
    <div
      class="w-full lg:w-2/3 border-b last:border-b-0"
      v-for="(group, accountType) in accountsByType"
      :key="accountType"
    >
      <div class="flex items-center justify-between pt-3 text-gray-500">
        <span>
          {{ group.label }}
        </span>
        <span>
          {{
            new Currency(
              group.balance / (accountType === "CREDIT_CARD" ? -100 : 100)
            ).format()
          }}</span
        >
      </div>
      <ul>
        <li
          v-for="account in group.accounts"
          :key="account.id"
          class="py-3 text-lg font-medium text-gray-700"
        >
          <router-link
            class="flex justify-between py-3 items-center"
            :to="`/accounts/${account.id.toString()}`"
          >
            <span>{{ account.name }}</span>
            {{
              new Currency(
                account.current_balance /
                  (account.type === "CREDIT_CARD" ? -100 : 100)
              ).format()
            }}
          </router-link>
        </li>
      </ul>
    </div>
  </template>

  <Panel v-model:active="showAddAccountPanel">
    <template #title>Add Account</template>
    <AddAccountPanel />
  </Panel>
</template>

<script>
  // Core
  import { defineComponent, ref, computed } from "vue";
  import { store } from "@/store";

  // Helpers
  import { accountTypes } from "@/helpers/Constants";
  import Currency from "@/helpers/Currency";

  // Components
  import AddAccountPanel from "@/components/account/AddAccountPanel.vue";
  import MyzeButton from "../components/MyzeButton.vue";
  import PageHeader from "@/components/PageHeader.vue";
  import Panel from "@/components/Panel.vue";

  export default defineComponent({
    components: { MyzeButton, AddAccountPanel, Panel, PageHeader },

    setup() {
      const showAddAccountPanel = ref(false);
      const accountsByType = computed(() => {
        const accountsByType = {};

        Object.values(store.accounts).forEach((account) => {
          if (!accountsByType[account.type])
            accountsByType[account.type] = {
              label: accountTypes[account.type],
              balance: 0,
              accounts: [],
            };

          accountsByType[account.type].balance += account.current_balance;
          accountsByType[account.type].accounts.push(account);
        });

        return accountsByType;
      });

      return {
        accountsByType,
        showAddAccountPanel,
        Currency,
      };
    },
  });
</script>

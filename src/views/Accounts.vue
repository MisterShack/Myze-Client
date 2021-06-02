<template>
  <div class="flex mb-5 justify-between items-center">
    <PageHeader>Accounts</PageHeader>
    <myze-button
      v-if="Object.keys(accountStore.state.accountsByType).length > 0"
      theme="Success"
      icon="Add"
      @click="showAddAccountPanel()"
    >
      Account</myze-button
    >
  </div>

  <p v-if="state.loading">Loading...</p>
  <div
    v-else-if="Object.keys(accountStore.state.accountsByType).length === 0"
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
        @click="showAddAccountPanel()"
      >
        Account</myze-button
      >
    </p>
  </div>
  <template v-else>
    <div
      class="w-full lg:w-2/3 border-b last:border-b-0"
      v-for="(group, accountType) in accountStore.state.accountsByType"
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
            :to="`/accounts/${account._id.toString()}`"
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

  <Panel v-model:active="state.showAddAccountPanel">
    <template #title>Add Account</template>
    <AddAccountPanel />
  </Panel>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { reactive } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import MyzeButton from "../components/MyzeButton.vue";
  import Panel from "@/components/Panel.vue";
  import AddAccountPanel from "@/components/account/AddAccountPanel.vue";
  import { accountStore } from "@/store/account-store";
  import Currency from "@/helpers/Currency";

  export default defineComponent({
    components: { MyzeButton, AddAccountPanel, Panel, PageHeader },

    setup() {
      const state = reactive({
        loading: true,
        showAddAccountPanel: false,
      });

      function showAddAccountPanel() {
        state.showAddAccountPanel = true;
      }

      accountStore.loadAccounts().then(() => (state.loading = false));

      return {
        state,
        accountStore,
        showAddAccountPanel,
        Currency,
      };
    },
  });
</script>

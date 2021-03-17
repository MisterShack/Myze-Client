<template>
  <div class="flex py-5 justify-between items-center">
    <p class="text-3xl text-gray-600 font-light tracking-wider ">
      Portfolio
    </p>
    <myze-button theme="Success" @click="showAddAccountPanel()"
      >Account</myze-button
    >
  </div>

  <p v-if="state.loading">Loading...</p>
  <div
    v-else-if="Object.keys(accountStore.state.accountsByType).length === 0"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p class="text-2xl font-bold">No accounts found!</p>
    <p class="mt-5">Add one using the green button above to start!</p>
  </div>
  <template v-else>
    <div class="pb-5">
      <p class="text-lg font-thin ">Available</p>
      <p class="text-light-blue-700 text-4xl md:text-3xl">
        {{
          new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
          }).format(accountStore.availableBalance.value / 100)
        }}
      </p>
    </div>

    <div class="bg-white px-5 pt-2 mt-5 rounded-lg">
      <div
        v-for="group in accountStore.state.accountsByType"
        :key="group"
        class="my-5"
      >
        <div
          class="flex items-center justify-between text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          <span class="font-normal tracking-wider">
            {{ group.label }}
          </span>
          <span>
            {{
              new Intl.NumberFormat("en-CA", {
                style: "currency",
                currency: "CAD",
              }).format(group.balance / 100)
            }}</span
          >
        </div>
        <ul class="flex justify-between pb-3 items-center text-gray-700">
          <li
            v-for="account in group.accounts"
            :key="account.id"
            class="w-full "
          >
            <router-link
              class="flex justify-between py-3 items-center"
              :to="`/portfolio/${account.id}`"
            >
              <span>{{ account.name }}</span>
              {{
                new Intl.NumberFormat("en-CA", {
                  style: "currency",
                  currency: "CAD",
                }).format(account.balance / 100)
              }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </template>

  <Panel
    :active="state.showAddAccountPanel"
    @close="state.showAddAccountPanel = false"
  >
    <template #title>Add Account</template>
    <AddAccountPanel />
  </Panel>
</template>

<script>
  import { reactive } from "vue";
  import MyzeButton from "../components/MyzeButton.vue";
  import Panel from "@/components/Panel.vue";
  import AddAccountPanel from "@/components/account/AddAccountPanel.vue";
  import { accountStore } from "@/store/account-store";
  export default {
    components: { MyzeButton, AddAccountPanel, Panel },
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
      };
    },
  };
</script>

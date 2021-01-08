<template>
  <div class="md:w-4/5 w-11/12 mx-auto max-w-4xl relative">
    <div class="flex py-5 justify-between items-center">
      <p class="text-3xl text-gray-600 font-light tracking-wider ">
        Portfolio
      </p>
      <myze-button theme="Success" @click="showAddAccountPanel()"
        >Account</myze-button
      >
    </div>

    <div class="p-5 rounded-md bg-indigo-200">
      <p class="text-sm text-gray-600">Available</p>
      <p class="text-gray-700 font-medium text-4xl">
        {{ state.availableBalance }}
      </p>
    </div>

    <div
      v-for="(group, accountType) in state.accountsByType"
      :key="group"
      class="my-5 shadow-sm"
    >
      <div
        class="flex justify-between items-center font-medium p-3 rounded-md rounded-b-none bg-gray-600"
      >
        <span class="text-gray-200 font-normal tracking-wider">
          {{ accountTypes[accountType] }}
        </span>
        <span class="text-gray-100">{{ group.formattedBalance }}</span>
      </div>
      <ul class="bg-white rounded-md rounded-tl-none rounded-tr-none">
        <li v-for="account in group.accounts" :key="account.id">
          <a
            class="flex justify-between p-3 items-center"
            :href="`/portfolio/${account.id}`"
          >
            <span class="text-gray-700">{{ account.name }}</span>
            <span class="text-gray-700">{{ account.formattedBalance }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <AddAccountPanel
    :show="state.showAddAccountPanel"
    @close="state.showAddAccountPanel = false"
  />
</template>

<script>
  import { reactive } from "vue";
  import MyzeButton from "../components/MyzeButton.vue";
  import AddAccountPanel from "@/components/account/AddAccountPanel.vue";
  export default {
    components: { MyzeButton, AddAccountPanel },
    setup() {
      const state = reactive({
        showAddAccountPanel: false,
        availableBalance: "$50.00",
        accountsByType: {
          CHEQUING: {
            balance: 46789,
            formattedBalance: "$467.89",
            accounts: [
              {
                id: 784,
                name: "General Chequing",
                balance: 46789,
                formattedBalance: "$467.89",
              },
              {
                id: 784,
                name: "General Chequing",
                balance: 4689,
                formattedBalance: "$46.89",
              },
            ],
          },
        },
      });

      const accountTypes = {
        CHEQUING: "Chequing",
      };

      function showAddAccountPanel() {
        state.showAddAccountPanel = true;
      }

      return {
        state,
        accountTypes,
        showAddAccountPanel,
      };
    },
  };
</script>

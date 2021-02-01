<template>
  <div class="flex py-5 justify-between items-center">
    <p class="text-3xl text-gray-600 font-light tracking-wider ">
      Portfolio
    </p>
    <myze-button theme="Success" @click="showAddAccountPanel()"
      >Account</myze-button
    >
  </div>
  <div
    v-if="state.accountsByType === null"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p>Loading...</p>
  </div>

  <div
    v-else-if="state.accountsByType.length === 0"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p class="text-2xl font-bold">No accounts found!</p>
    <p class="mt-5">Add one using the green button above to start!</p>
  </div>
  <template v-else>
    <div class="p-5 rounded-md bg-indigo-200">
      <p class="text-sm text-gray-600">Available</p>
      <p class="text-gray-700 font-medium text-4xl">
        ${{ (availableBalance / 100).toFixed(2) }}
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
        <li v-for="account in group" :key="account.id">
          <router-link
            class="flex justify-between p-3 items-center"
            :to="`/portfolio/${account.id}`"
          >
            <span class="text-gray-700">{{ account.name }}</span>
            <span class="text-gray-700">${{ (account.balance / 100).toFixed(2) }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </template>

  <AddAccountPanel
    :show="state.showAddAccountPanel"
    @close="state.showAddAccountPanel = false"
  />
</template>

<script>
  import { reactive, onMounted, computed } from "vue";
  import MyzeButton from "../components/MyzeButton.vue";
  import AddAccountPanel from "@/components/account/AddAccountPanel.vue";
  import { getAccounts } from "@/api/AccountApi.js";
  export default {
    components: { MyzeButton, AddAccountPanel },
    setup() {
      const state = reactive({
        showAddAccountPanel: false,
        accountsByType: null,
      });

      onMounted(() => {
        getAccounts().then((res) => {
          state.accountsByType = res.data;
        });
      });

      const availableBalance = computed(() => {
        let availableBalance = 0;

        if (
          typeof state.accountsByType === "object" &&
          state.accountsByType["CHEQUING"]
        ) {
          availableBalance += state.accountsByType["CHEQUING"]
            .map((a) => parseInt(a.balance))
            .reduce((accumulator, value) => accumulator + value);
        }

        return availableBalance;
      });

      const accountTypes = {
        CHEQUING: "Chequing",
        SAVINGS: "Savings",
        TFSA: "Tax-Free Savings Account",
        MORTGAGE: "Mortgages",
        LOAN: "Loans",
        RRSP: "Retirement Savings Plan",
        RESP: "Education Savings Plan",
      };

      function showAddAccountPanel() {
        state.showAddAccountPanel = true;
      }

      return {
        state,
        availableBalance,
        accountTypes,
        showAddAccountPanel,
      };
    },
  };
</script>

<template>
  <PageHeader class=" inline-block pb-5">
    Overview
  </PageHeader>
  <p v-if="state.loading" class="text-gray-500">Loading...</p>
  <div
    v-else-if="Object.keys(accountStore.state.accountsByType).length === 0"
    class="mt-20 text-center text-xl text-gray-600"
  >
    <p class="text-2xl font-bold">No accounts found!</p>
    <p class="mt-5">
      Please go to your
      <router-link class="text-yellow-600" to="/accounts">accounts</router-link>
      page to add one!
    </p>
  </div>
  <template v-else>
    <div>
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
  </template>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { reactive } from "vue";
  import { accountStore } from "@/store/account-store";
  import PageHeader from "@/components/PageHeader.vue";

  export default defineComponent({
    components: { PageHeader },
    setup() {
      const state = reactive({
        loading: true,
      });

      accountStore.loadAccounts().then(() => (state.loading = false));

      return {
        state,
        accountStore,
      };
    },
  });
</script>

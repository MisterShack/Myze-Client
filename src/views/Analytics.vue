<template>
  <PageHeader class="inline-block pb-5">
    Analytics
  </PageHeader>
  <div class="mb-5">
    <ul
      class="border shadow-sm inline-block"
      v-if="Object.keys(accounts).length > 0"
    >
      <li
        v-for="(account, id) in accounts"
        :key="id"
        class="cursor-pointer rounded border-b p-3 flex items-center"
        @click="toggleCheckbox(id)"
      >
        <div class="border border-blue-400 h-5 w-5 relative bg-blue-100">
          <CheckIcon
            style="top: -1px; left: -1px;"
            class="absolute text-blue-900"
            v-if="selectedAccountIds.indexOf(id) >= 0"
          />
        </div>
        <span class="ml-2">{{ account.name }}</span>
      </li>
    </ul>
  </div>
  <div class="flex items-center space-x-5">
    <div class="relative border border-1 border-gray-200 px-3 py-2">
      <label class="font-medium">Start Date</label>
      <p>{{ startDate }}</p>
      <input
        class="absolute opacity-0 top-0 left-0 w-full h-full"
        type="date"
        v-model="startDate"
      />
    </div>
    <div class="relative border border-1 border-gray-200 px-3 py-2">
      <label class="font-medium">End Date</label>
      <p>{{ endDate }}</p>
      <input
        class="absolute opacity-0 top-0 left-0 w-full h-full"
        type="date"
        v-model="endDate"
      />
    </div>
    <button
      class="block px-5 py-1 font-bold rounded-md transition-all duration-200"
      :disabled="selectedAccountIds.length === 0"
      :class="
        selectedAccountIds.length === 0
          ? 'bg-gray-300 text-gray-600 opacity-50'
          : 'bg-green-200 text-green-600'
      "
      @click="getAnalytics"
    >
      Go
    </button>
  </div>
</template>
<style>
  input[type="date"]::-webkit-calendar-picker-indicator {
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
</style>
<script setup>
  import { ref, computed } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import dayjs from "dayjs";
  import { supabase } from "@/supabase";
  import { store } from "@/store";
  import Currency from "@/helpers/Currency";
  import { CheckIcon } from "@heroicons/vue/outline/esm";

  const accounts = computed(() => {
    return store.accounts;
  });

  const selectedAccountIds = ref([]);

  const startDate = ref(dayjs().format("YYYY-MM-01"));
  const endDate = ref(dayjs().format("YYYY-MM-DD"));
  const loading = false;

  const monthName = ref(dayjs().format("MMMM"));
  const monthValue = ref(dayjs().format("M"));

  function getAnalytics() {
    // supabase.from("tranasctions");
  }

  const toggleCheckbox = (id) => {
    const index = selectedAccountIds.value.indexOf(id);

    if (index >= 0) {
      selectedAccountIds.value.splice(index, 1);
    } else {
      selectedAccountIds.value.push(id);
    }
  };
</script>

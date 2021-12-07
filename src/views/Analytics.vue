<template>
  <PageHeader class="inline-block pb-5">
    Analytics
  </PageHeader>
  <div class="flex items-center space-x-5">
    <div class="relative border border-1 border-gray-200 px-3 py-2">
      <label class="font-medium">Start Date</label>
      <p>{{ state.startDate }}</p>
      <input
        class="absolute opacity-0 top-0 left-0 w-full h-full"
        type="date"
        v-model="state.startDate"
      />
    </div>
    <div class="relative border border-1 border-gray-200 px-3 py-2">
      <label class="font-medium">End Date</label>
      <p>{{ state.endDate }}</p>
      <input
        class="absolute opacity-0 top-0 left-0 w-full h-full"
        type="date"
        v-model="state.endDate"
      />
    </div>
    <button
      class="block bg-green-200 px-5 py-1 font-bold text-green-600 rounded-md"
      @click="getVendorSumForDateRange(state.startDate, state.endDate)"
    >
      Go
    </button>
  </div>

  <DoughnutChart ref="doughnutRef" :chartData="testData" :options="options" />

  <template v-if="state.searched">
    <div class="flex space-x-5 my-5">
      <div>
        <p>Expenses</p>
        <p class="text-xl">{{ new Currency(totalExpenses / 100).format() }}</p>
      </div>

      <div>
        <p>Income</p>
        <p class="text-xl">{{ new Currency(totalIncome / 100).format() }}</p>
      </div>
    </div>

    <div class="w-1/4">
      <DoughnutChart
        ref="doughnutRef"
        :chartData="testData"
        :options="options"
      />
    </div>

    <table>
      <thead>
        <th>Vendor</th>
        <th>Expenses</th>
        <th>Percentage</th>
      </thead>
      <tbody>
        <tr
          v-for="vendorIncome in state.vendorIncome"
          :key="vendorIncome.name"
          class="leading-7"
        >
          <td>{{ vendorIncome.name }}</td>
          <td class="w-32 text-right">
            {{ new Currency(vendorIncome.total / 100).format() }}
          </td>
          <td class="w-32 text-right">
            {{ Math.round((vendorIncome.total / totalExpenses) * 100) }} %
          </td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <th>Vendor</th>
        <th>Expenses</th>
        <th>Percentage</th>
      </thead>
      <tbody>
        <tr
          v-for="vendorExpense in state.vendorExpenses"
          :key="vendorExpense.name"
          class="leading-7"
        >
          <td>{{ vendorExpense.name }}</td>
          <td class="w-32 text-right">
            {{ new Currency(vendorExpense.total / 100).format() }}
          </td>
          <td class="w-32 text-right">
            {{ Math.round((vendorExpense.total / totalExpenses) * 100) }} %
          </td>
        </tr>
      </tbody>
    </table>
  </template>
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
<script lang="ts">
  import { defineComponent, reactive, computed, ref } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import dayjs from "dayjs";
  import { supabase } from "@/supabase";
  import { realm } from "@/realm";
  import Currency from "@/helpers/Currency";
  import { DoughnutChart, ExtractComponentData } from "vue-chart-3";
  import {
    Chart,
    DoughnutController,
    ArcElement,
    Tooltip,
    ChartData,
    ChartOptions,
  } from "chart.js";

  Chart.register(DoughnutController, ArcElement, Tooltip);

  export default defineComponent({
    components: { PageHeader, DoughnutChart },
    setup() {
      const state = reactive({
        month: {
          name: dayjs().format("MMMM"),
          value: dayjs().format("M"),
        },
        startDate: dayjs().format("YYYY-MM-01"),
        endDate: dayjs().format("YYYY-MM-DD"),
        vendorExpenses: [],
        vendorIncome: [],
        searched: false,
      });

      const chartData = ref([]);
      const chartLabels = ref([]);

      const totalExpenses = computed(() => {
        let sum = 0;

        state.vendorExpenses.forEach((vendor) => {
          sum += vendor.total;
        });

        return sum;
      });

      const totalIncome = computed(() => {
        let sum = 0;

        state.vendorIncome.forEach((vendor) => {
          sum += vendor.total;
        });

        return sum;
      });

      async function getVendorSumForDateRange(
        startDate: string,
        endDate: string
      ) {
        const { data, error } = await supabase.rpc("getVendorSum", {
          startDate,
          endDate,
        });
      }

      const doughnutRef = ref<ExtractComponentData<typeof DoughnutChart>>();

      const options = ref<ChartOptions<"doughnut">>({
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Chart.js Doughnut Chart",
          },
        },
      });

      const testData = computed<ChartData<"doughnut">>(() => ({
        labels: chartLabels.value,
        datasets: [
          {
            data: chartData.value,
            backgroundColor: [
              "#77CEFF",
              "#0079AF",
              "#123E6B",
              "#97B0C4",
              "#A5C8ED",
            ],
          },
        ],
      }));

      return {
        Currency,
        state,
        totalExpenses,
        totalIncome,
        testData,
        doughnutRef,
        options,
        getVendorSumForDateRange,
      };
    },
  });
</script>

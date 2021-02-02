<template>
  <div class="inline-block rounded-sm border border-gray-400">
    <div class="flex justify-between shadow-sm bg-gray-400">
      <button
        class="bg-transparent border-none py-2 px-2"
        @click.prevent="previousMonth()"
      >
        P
      </button>
      <button
        class="calendar__month bg-transparent py-2 px-2"
        @click.prevent="state.showMonthPicker = !state.showMonthPicker"
      >
        {{ state.activeMonth.format("MMMM YYYY") }}
      </button>
      <button
        class="bg-transparent border-none py-2 px-2"
        @click.prevent="nextMonth()"
      >
        N
      </button>
    </div>
    <div v-if="state.showMonthPicker" class="p-2">
      <div
        v-for="(months, rowIndex) in monthsByRow"
        :key="rowIndex"
        class="flex justify-evenly"
      >
        <template
          v-for="(month, monthIndex) in months"
          :key="monthIndex + rowIndex"
        >
          <span
            class="calendar__months__month"
            :class="{
              'calendar__months__month--selected':
                monthIndex + rowIndex === state.activeMonth.month(),
            }"
            @click="changeCalendarMonth(monthIndex + rowIndex)"
            >{{ month }}</span
          >
        </template>
      </div>
    </div>
    <template v-else>
      <div class="p-2 bg-white">
        <div
          v-for="(week, key) in state.calendarDatesByWeek"
          :key="key"
          class="flex justify-evenly"
        >
          <span
            v-for="date in week"
            :key="date.date()"
            class="cursor-pointer flex-1 py-1 px-2 border-transparent rounded-sm text-center border hover:border-gray-400"
            :class="{
              'bg-gray-400 text-gray-800': state.selectedDate.isSame(date),
              'text-gray-400 opacity-50':
                date.month() !== state.activeMonth.month(),
            }"
            @click="selectDate(date)"
            >{{ date.date() }}</span
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import dayjs from "dayjs";

  import { onMounted, reactive, watch } from "vue";
  export default {
    props: {
      selectedDate: String,
      allowEmpty: Boolean,
    },
    emits: ["clear", "select-date"],
    setup(props, context) {
      const state = reactive({
        allowEmpty: props.allowEmpty,
        showMonthPicker: false,
        activeMonth: dayjs(),
        calendarDatesByWeek: reactive([]),
        selectedDate: dayjs(props.selectedDate),
      });

      watch(
        () => props.selectedDate,
        (selectedDate) => {
          state.selectedDate = dayjs(selectedDate);
          console.log(props.selectedDate);
        }
      );

      onMounted(() => {
        state.activeMonth = state.selectedDate;
        state.calendarDatesByWeek = generateCalendarDatesFromDate(
          state.activeMonth
        );
      });

      const monthsByRow = [
        ["Jan", "Feb", "Mar"],
        ["Apr", "May", "Jun"],
        ["Jul", "Aug", "Sept"],
        ["Oct", "Nov", "Dec"],
      ];

      function previousMonth() {
        state.activeMonth = dayjs(state.activeMonth).subtract(1, "month");
        state.calendarDatesByWeek = generateCalendarDatesFromDate(
          state.activeMonth
        );
      }

      function nextMonth() {
        state.activeMonth = dayjs(state.activeMonth).add(1, "month");
        state.calendarDatesByWeek = generateCalendarDatesFromDate(
          state.activeMonth
        );
      }

      function generateCalendarDatesFromDate(date) {
        let weeks = [];
        let week = [];

        let start = dayjs(date).date(1);
        let end = dayjs(date).endOf("month");

        if (start.day() > 0) {
          start = start.subtract(start.day(), "days");
        }

        if (end.day() < 6) {
          end = end.add(6 - end.day(), "days");
        }

        let currentDate = start;

        while (currentDate <= end) {
          week.push(currentDate);

          if (week.length === 7) {
            weeks.push(week);
            week = [];
          }

          currentDate = currentDate.add(1, "days");
        }

        return weeks;
      }

      function selectDate(date) {
        state.selectedDate = date;

        if (dayjs(date).format("M") != dayjs(state.activeMonth).format("M")) {
          state.activeMonth = date;
          state.calendarDatesByWeek = generateCalendarDatesFromDate(date);
        }

        context.emit("select-date", date);
      }

      return {
        state,
        monthsByRow,
        previousMonth,
        nextMonth,
        generateCalendarDatesFromDate,
        selectDate,
      };
    },
  };
</script>

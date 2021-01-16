<template>
  <div class="relative">
    <input
      class="form-input block w-full px-3 py-2 sm:text-sm sm:leading-5"
      type="text"
      placeholder="Select a date..."
      @focus="toggleCalendar()"
      v-model="displayDate"
    />

    <div v-if="state.showCalendar" class="absolute left-0 z-10">
      <Calendar
        :allowEmpty="state.required"
        @select-date="selectDate($event)"
        :selectedDate="state.selectedDate"
      />
      <div
        class="bg-white flex justify-center border border-gray-400 border-t-0 "
      >
        <button
          v-if="state.allowEmpty"
          @click="clear()"
          class="flex-1 p-2 bg-gray-200"
        >
          Clear
        </button>
        <button @click="toggleCalendar()" class="flex-1 p-2 bg-gray-200">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .form-input {
    background-color: #fff;
    border-color: #d2d6dc;
    border-width: 1px;
    border-radius: 0.375rem;
  }
</style>

<script>
  import { onMounted, reactive, computed } from "vue";
  import dayjs from "dayjs";
  import Calendar from "@/components/forms/inputs/Calendar.vue";
  export default {
    props: {
      selectedDate: Date,
      required: Boolean,
    },
    emits: ["select-date", "clear"],
    components: { Calendar },
    setup(props, context) {
      const state = reactive({
        selectedDate: props.selectedDate,
        showCalendar: false,
      });

      const displayDate = computed(() =>
        dayjs(state.selectedDate).format("MMMM DD, YYYY")
      );

      function toggleCalendar() {
        state.showCalendar = !state.showCalendar;
      }

      function selectDate(date) {
        if (date !== null) {
          state.selectedDate = date.toDate();
          state.displayDate = date;
        } else {
          state.selectedDate = null;
          state.displayDate = null;
        }

        toggleCalendar();
        context.emit("select-date", state.selectedDate);
      }

      function clear() {
        state.selectedDate = null;
        context.emit("select-date", null);
        context.emit("clear");
      }

      return {
        displayDate,
        state,
        toggleCalendar,
        selectDate,
        clear,
      };
    },
  };
</script>

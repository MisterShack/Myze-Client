<template>
  <div class="relative">
    <button
      class="form-input block w-full px-3 py-2 sm:text-sm sm:leading-5 text-left"
      @click="toggleCalendar"
    >
      {{ displayDate }}
    </button>

    <div v-if="state.showCalendar" class="absolute z-10" :class="anchorClass">
      <Calendar
        :allowEmpty="state.required"
        @select-date="selectDate"
        :selectedDate="state.selectedDate"
      />
      <div
        class="bg-white flex justify-center border border-gray-400 border-t-0 "
      >
        <button
          v-if="!state.required"
          @click="clear"
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
  import { computed, reactive, watch } from "vue";
  import dayjs from "dayjs";
  import Calendar from "@/components/forms/inputs/Calendar.vue";
  export default {
    props: {
      selectedDate: String,
      required: {
        type: Boolean,
        default: false,
      },
      anchor: String,
    },
    emits: ["select-date", "clear"],
    components: { Calendar },
    setup(props, context) {
      const state = reactive({
        selectedDate: props.selectedDate,
        showCalendar: false,
        required: props.required,
        anchor: props.anchor,
      });

      watch(
        () => props.selectedDate,
        (selectedDate) => {
          state.selectedDate = selectedDate;
        }
      );

      watch(
        () => props.required,
        (required) => {
          state.required = required;
        }
      );

      watch(
        () => props.anchor,
        (anchor) => (state.anchor = anchor)
      );

      const anchorClass = computed(() => {
        if (state.anchor === "BR") {
          return "right-0";
        } else if (state.anchor === "BL") {
          return "left-0";
        }
      });

      const displayDate = computed(() => {
        if (state.selectedDate === null) {
          return "Select a date...";
        } else {
          return dayjs(state.selectedDate).format("MMMM DD, YYYY");
        }
      });

      function toggleCalendar() {
        state.showCalendar = !state.showCalendar;
      }

      function selectDate(date) {
        if (date !== null) {
          state.selectedDate = date.format("YYYY-MM-DD");
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
        toggleCalendar();
        context.emit("select-date", null);
        context.emit("clear");
      }

      return {
        displayDate,
        state,
        toggleCalendar,
        selectDate,
        clear,
        anchorClass,
      };
    },
  };
</script>

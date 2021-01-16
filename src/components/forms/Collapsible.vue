<template>
  <div class="mb-5">
    <div
      :class="{ 'rounded-b-none': state.active }"
      class="bg-gray-100 rounded-md font-semibold text-gray-800 px-3 py-2 flex justify-between align-middle cursor-pointer border border-gray-300 hover:bg-gray-200"
      @click="toggle()"
    >
      <slot name="title" />
    </div>

    <div v-if="state.active" class="p-3 border border-t-0 rounded-b-md">
      <slot />
    </div>
  </div>
</template>

<script>
  import { reactive } from "vue";
  export default {
    props: {
      active: Boolean,
    },
    emits: ["open", "close"],
    setup(props, { emit }) {
      const state = reactive({
        active: props.active,
      });

      function toggle() {
        state.active = !state.active;

        if (state.active) {
          emit("open");
        } else {
          emit("close");
        }
      }

      return {
        state,
        toggle,
      };
    },
  };
</script>

<template>
  <div
    :class="state.visible ? 'visible' : 'invisible'"
    class="fixed inset-0 overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        @click="close"
        class="absolute inset-0 bg-gray-800 transition ease-in-out duration-500"
        :class="state.show ? 'bg-opacity-75' : 'bg-opacity-0'"
      ></div>
      <section class="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          class="relative w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700"
          :class="state.show ? 'translate-x-0' : 'translate-x-full'"
        >
          <div
            class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4 transition ease-in-out duration-500"
            :class="state.show ? 'opacity-100' : 'opacity-0'"
          >
            <button
              @click="close"
              aria-label="Close panel"
              class="text-gray-300 hover:text-white"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            class="h-full flex flex-col space-y-6 py-6 bg-white shadow-xl overflow-y-scroll"
          >
            <header v-if="titleExists" class="px-4 sm:px-6">
              <h2 class="text-lg leading-7 font-medium text-gray-900">
                <slot name="title" />
              </h2>
            </header>

            <div class="relative flex-1 px-4 sm:px-6">
              <slot @close="close" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { computed, reactive, watch } from "vue";
  export default {
    props: {
      active: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["close"],
    setup(props, context) {
      const state = reactive({
        visible: false,
        show: false,
      });

      watch(
        () => props.active,
        (active) => {
          if (active) {
            state.visible = true;
          }

          state.show = active;
        }
      );

      function close() {
        console.log("closing");
        state.show = false;
        setTimeout(() => {
          state.visible = false;
          context.emit("close");
        }, 500);
      }

      const titleExists = computed(() => {
        return typeof context.slots.title === "function";
      });

      return {
        state,
        titleExists,
        close,
      };
    },
  };
</script>

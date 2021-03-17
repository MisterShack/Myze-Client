<template>
  <div class="relative">
    <span class="inline-block w-full rounded-md shadow-sm">
      <button
        @click="toggleOptions"
        type="button"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        class="cursor-pointer relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
      >
        <div class="flex items-center space-x-3">
          <span class="block truncate">
            {{
              state.selectedKey == null
                ? "Choose an option"
                : state.options[state.selectedKey]
            }}
          </span>
        </div>

        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
    </span>

    <div
      :class="state.showOptions ? 'absolute' : 'hidden'"
      class="mt-1 w-full rounded-md bg-white shadow-lg z-10"
    >
      <ul
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-item-3"
        class="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
      >
        <li
          v-if="state.optional"
          role="option"
          class="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-900 hover:text-white hover:bg-indigo-600"
          @click="selectOption(null)"
        >
          <div class="flex items-center space-x-3">
            <span
              :class="
                state.selectedKey == null ? 'font-semibold' : 'font-normal'
              "
              class="font-normal block truncate"
            >
              Choose an option
            </span>
          </div>

          <span
            v-if="state.selectedKey == null"
            class="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </li>

        <li
          v-for="(value, key) in state.options"
          :key="key"
          role="option"
          class="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-900 hover:text-white hover:bg-indigo-600"
          @click="selectOption(key)"
        >
          <div class="flex items-center space-x-3">
            <span
              :class="
                key == state.selectedKey ? 'font-semibold' : 'font-normal'
              "
              class="font-normal block truncate"
            >
              {{ value }}
            </span>
          </div>

          <span
            v-if="key === state.selectedKey"
            class="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { reactive, watch } from "vue";

  export default {
    props: {
      options: {
        type: Object,
        required: true,
      },
      optional: {
        type: Boolean,
        default: false,
      },
      selectedKey: {
        type: String,
      },
    },
    emits: ["select"],
    setup(props, context) {
      const state = reactive({
        options: props.options,
        selectedKey: props.selectedKey,
        showOptions: false,
      });

      watch(
        () => props.options,
        (options) => (state.options = options)
      );

      watch(
        () => props.selectedKey,
        (selectedKey) => (state.selectedKey = selectedKey)
      );

      function toggleOptions() {
        state.showOptions = !state.showOptions;
      }

      function selectOption(selectedKey) {
        state.selectedKey = selectedKey;
        state.showOptions = false;
        context.emit("select", selectedKey);
      }

      return {
        state,
        toggleOptions,
        selectOption,
      };
    },
  };
</script>

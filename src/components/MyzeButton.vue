<template>
  <button
    class="shadow-sm rounded border pr-2 py-1 text-sm  md:py-2  md:text-base cursor-pointer font-semibold transition duration-150 ease-in flex items-center"
    :class="[
      themeClasses,
      disabledClasses,
      icon ? 'md:pl-2 md:pr-4' : 'md:px-4',
    ]"
  >
    <template v-if="icon === 'Add'"><PlusIcon class="h-6 w-6 mr-1"/></template>
    <template v-if="icon === 'Save'"><SaveIcon class="h-6 w-6 mr-1"/></template>
    <template v-if="icon === 'Delete'"><XIcon class="h-6 w-6 mr-1"/></template>
    <slot />
  </button>
</template>

<script>
  import { computed } from "vue";
  import { PlusIcon, SaveIcon, XIcon } from "@heroicons/vue/outline/esm";
  export default {
    props: {
      theme: String,
      icon: String,
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    components: { PlusIcon, SaveIcon, XIcon },
    setup(props) {
      const disabledClasses = computed(() =>
        props.disabled
          ? "opacity-50 cursor-not-allowed"
          : "opacity-100 cursor-pointer"
      );

      const themeClasses = computed(() => {
        switch (props.theme) {
          case "Light":
            return "hover:border-gray-600 bg-white border-gray-400";
          case "Success":
            return "hover:border-green-600 bg-green-200 text-green-800 border-green-400";
          case "Danger":
            return "hover:red-900 bg-red-300 text-red-900 border-red-700";
        }
      });

      const icon = props.icon;

      return {
        disabledClasses,
        icon,
        themeClasses,
      };
    },
  };
</script>

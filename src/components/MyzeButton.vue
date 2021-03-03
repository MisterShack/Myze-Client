<template>
  <button
    class="shadow-sm rounded border px-5 py-2 text-base cursor-pointer font-semibold transition duration-150 ease-in"
    :class="[themeClasses, disabledClasses]"
  >
    <slot />
  </button>
</template>

<script>
  import { computed } from "vue";
  export default {
    props: {
      theme: String,
      disabled: {
        type: Boolean,
        default: false,
      },
    },
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

      return {
        disabledClasses,
        themeClasses,
      };
    },
  };
</script>

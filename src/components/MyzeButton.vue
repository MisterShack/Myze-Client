<template>
  <button :class="state.classes">
    <slot />
  </button>
</template>

<script>
  import { onMounted, reactive } from "vue";
  export default {
    props: {
      theme: String,
    },
    setup(props) {
      const state = reactive({
        classes:
          "shadow-sm rounded border px-5 py-2 text-base cursor-pointer font-semibold transition duration-150 ease-in",
      });

      onMounted(() => {
        switch (props.theme) {
          case "Light":
            state.classes += "hover:border-gray-600 bg-white border-gray-400";
            break;
          case "Success":
            state.classes +=
              "hover:border-green-600 bg-green-200 text-green-800 border-green-400";
            break;
          case "Danger":
            state.classes +=
              "hover:red-900 bg-red-300 text-red-900 border-red-700";
            break;
        }
      });

      return {
        state,
      };
    },
  };
</script>

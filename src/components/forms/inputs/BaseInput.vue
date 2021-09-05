<template>
  <input
    class="block w-full p-2 m:text-sm sm:leading-5 bg-white border border-gray-300 rounded-md "
    :value="modelValue"
    @input="(e) => changeValue(e.target.value)"
  />
</template>

<script>
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      modelValue: String,
    },
    emits: ["update:modelValue"],
    methods: {
      changeValue(value) {
        this.$emit("update:modelValue", value); // previously was `this.$emit('input', title)`
      },
    },
  });
</script>

<template>
  <PageHeader>Settings</PageHeader>


</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";

  export default defineComponent({
    components: { FormField, PageHeader },
  });
</script>

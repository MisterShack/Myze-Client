<template>
  <PageHeader>Profile</PageHeader>

  <FormField>
    <template #label>Name</template>
    <BaseInput />
  </FormField>

  <FormField>
    <template #label>Email</template>
    <BaseInput />
  </FormField>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import BaseInput from "@/components/forms/inputs/BaseInput.vue";
  import FormField from "@/components/forms/inputs/FormField.vue";

  export default defineComponent({
    components: { BaseInput, FormField, PageHeader },
  });
</script>

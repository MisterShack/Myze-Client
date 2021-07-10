<template>
  <PageHeader class="inline-block pb-5">
    Analytics
  </PageHeader>
  <p>
    {{ month.name }}
  </p>
</template>
<script lang="ts">
  import { defineComponent, reactive } from "vue";
  import PageHeader from "@/components/PageHeader.vue";
  import dayjs from "dayjs";
  import { realm } from "@/realm";

  export default defineComponent({
    components: { PageHeader },
    setup() {
      const state = reactive({
        month: {
          name: dayjs().format("MMMM"),
          value: dayjs().format("M"),
        },
      });

      

      return state;
    },
  });
</script>

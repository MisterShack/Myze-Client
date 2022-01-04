<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
  import { useRoute } from "vue-router";
  import { computed } from "vue";

  import AuthLayout from "@/layouts/AuthLayout.vue";
  import AppLayout from "@/layouts/AppLayout.vue";

  export default {
    components: { AuthLayout, AppLayout },
    setup() {
      const route = useRoute();

      const layout = computed(() => route.meta.layout || AppLayout);

      return {
        layout,
      };
    },
  };
</script>

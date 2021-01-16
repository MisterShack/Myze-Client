<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
  import HomeLayout from "@/layouts/HomeLayout.vue";
  import AppLayout from "@/layouts/AppLayout.vue";

  import { useRoute } from "vue-router";
  import { computed } from "vue";

  export default {
    components: { HomeLayout, AppLayout },
    setup() {
      const route = useRoute();

      const layout = computed(() => route.meta.layout || AppLayout);

      return {
        layout,
      };
    },
  };
</script>

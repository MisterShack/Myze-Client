<template>
  <aside
    class="fixed bottom-0 left-0 md:top-0 md:h-screen w-screen md:w-auto flex flex-auto md:flex-col items-center bg-ming"
  >
    <router-link
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      class="p-3 md:p-5 block flex-1 md:flex-initial"
      :class="
        currentRoute === link.url
          ? 'text-white'
          : 'text-middle-blue-green hover:animate-pulse'
      "
      ><component class="m-auto h-6 w-6" :is="link.icon"></component
    ></router-link>
  </aside>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useRoute } from "vue-router";

  import {
    CogIcon,
    LogoutIcon,
    CollectionIcon,
    ChartBarIcon,
  } from "@heroicons/vue/outline/esm";

  export default defineComponent({
    components: {
      CogIcon,
      LogoutIcon,
      CollectionIcon,
      ChartBarIcon,
    },
    setup() {
      const route = useRoute();
      const currentRoute = computed(() => route.path);

      const links = [
        {
          text: "Accounts",
          url: "/accounts",
          icon: CollectionIcon,
        },
        {
          text: "Analytics",
          url: "/analytics",
          icon: ChartBarIcon,
        },
        {
          text: "Settings",
          url: "/settings",
          icon: CogIcon,
        },
        {
          text: "Log Out",
          url: "/logout",
          icon: LogoutIcon,
        },
      ];

      return {
        links,
        currentRoute,
      };
    },
  });
</script>

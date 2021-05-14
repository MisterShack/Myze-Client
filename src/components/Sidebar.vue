<template>
  <aside
    class="bg-gradient-to-b to-blue-200 from-light-blue-100 h-screen fixed top-0 left-0 flex flex-col items-center"
  >
    <router-link
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      class="p-5 block  "
      :class="
        currentRoute === link.url
          ? 'text-blue-500'
          : 'text-blue-300 hover:animate-pulse'
      "
      ><component :is="link.icon"></component
    ></router-link>
  </aside>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useRoute } from "vue-router";
  import IconHome from "@/components/icons/IconHome.vue";
  import IconCollection from "@/components/icons/IconCollection.vue";
  import IconCog from "@/components/icons/IconCog.vue";
  import IconLogout from "@/components/icons/IconLogout.vue";

  export default defineComponent({
    components: { IconHome, IconCollection, IconCog, IconLogout },
    setup() {
      const route = useRoute();
      const currentRoute = computed(() => route.path);

      const links = [
        {
          text: "Overview",
          url: "/overview",
          icon: IconHome,
        },
        {
          text: "Accounts",
          url: "/accounts",
          icon: IconCollection,
        },
        {
          text: "Settings",
          url: "/settings",
          icon: IconCog,
        },
        {
          text: "Log Out",
          url: "/logout",
          icon: IconLogout,
        },
      ];

      return {
        links,
        currentRoute,
      };
    },
  });
</script>

<template>
  <main class="min-h-screen max-w-7xl">
    <div class="pt-10 px-4 pb-12 md:px-10 md:pl-28">
      <Sidebar v-show="user" />
      <div>
        <slot />
      </div>
    </div>
  </main>
</template>

<script>
  import { computed } from "vue";
  import Sidebar from "@/components/Sidebar.vue";
  import BottomNavbar from "@/components/BottomNavbar.vue";
  import { realm } from "@/realm";

  export default {
    components: { BottomNavbar, Sidebar },

    setup() {
      const user = computed(() => !!realm.currentUser.value);
      return { user };
    },
  };
</script>

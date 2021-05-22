<template>
  <main class="min-h-screen max-w-7xl">
    <div class="pt-10 px-10 md:pl-28">
      <Sidebar v-show="user" class="hidden md:block" />
      <div>
        <slot />
      </div>
    </div>
    <BottomNavbar v-show="user" class="md:hidden" />
  </main>
</template>

<script>
  import { computed, watch } from "vue";
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

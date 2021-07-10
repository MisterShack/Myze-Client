<template>
  <main class="min-h-screen bg-white">
    <div class="pt-10 px-4 pb-12 md:px-10 md:pl-28 max-w-7xl">
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
  import { realm } from "@/realm";

  export default {
    components: { Sidebar },

    setup() {
      const user = computed(() => !!realm.currentUser.value);
      return { user };
    },
  };
</script>

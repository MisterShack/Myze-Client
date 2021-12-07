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
  import Sidebar from "@/components/Sidebar.vue";
  import { store } from "@/store";

  export default {
    components: { Sidebar },

    setup() {
      const user = !!store.user?.id;
      return { user };
    },
  };
</script>

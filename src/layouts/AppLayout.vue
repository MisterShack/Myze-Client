<template>
  <main class="min-h-screen bg-gray-100">
    <div class="max-w-6xl w-4/5 mx-auto ">
      <Navbar />
      <slot />
    </div>
  </main>
</template>

<script>
  import Navbar from "@/components/Navbar.vue";
  export default {
    components: { Navbar },
  };
</script>

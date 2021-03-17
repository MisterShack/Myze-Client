<template></template>
<script>
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { auth } from "@/auth";

  export default defineComponent({
    setup() {
      const router = useRouter();
      auth.signOut().then(() => router.push("/login"));
    },
  });
</script>

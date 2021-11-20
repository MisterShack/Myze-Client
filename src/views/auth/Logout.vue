<template></template>
<script lang="transparent">
  import { defineComponent, ref } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/supabase";

  export default defineComponent({
    async setup() {
      const router = useRouter();
      const loading = ref(true);

      try {
        loading.value = true;
        let { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        router.push("/login");
      }
    },
  });
</script>

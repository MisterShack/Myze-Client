<template></template>
<script>
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { realm } from "@/realm";

  export default defineComponent({
    setup() {
      const router = useRouter();
      realm.app.currentUser.logOut().then(() => {
        realm.currentUser.value = null;
        router.push("/login");
      });
    },
  });
</script>

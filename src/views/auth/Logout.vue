<template></template>
<script>
  import { defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { realm } from "@/realm";

  export default defineComponent({
    setup() {
      const router = useRouter();
      realm.currentUser.value.logOut().then(() => {
        realm.state.app.removeUser(realm.currentUser.value);

        router.push("/login");
      });
    },
  });
</script>

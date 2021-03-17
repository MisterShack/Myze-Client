<template>
  <MyzeButton theme="Danger" @click="deleteAccount">Delete Account</MyzeButton>
</template>

<script>
  import MyzeButton from "../MyzeButton.vue";
  import { accountStore } from "@/store/account-store.ts";
  import { useRouter } from "vue-router";

  export default {
    props: {
      account: {
        required: true,
      },
    },
    components: { MyzeButton },
    setup(props) {
      const router = useRouter();

      async function deleteAccount() {
        await accountStore.deleteAccount(props.account.id);
        router.push(`/portfolio`);
      }

      return { deleteAccount };
    },
  };
</script>

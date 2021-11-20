<template>
  <MyzeButton theme="Danger" @click="deleteAccount">Delete Account</MyzeButton>
</template>

<script>
  import MyzeButton from "../MyzeButton.vue";
  import { useRouter } from "vue-router";
  import { supabase } from "../../supabase";

  export default {
    props: {
      accountId: {
        type: Number,
        required: true,
      },
    },
    components: { MyzeButton },
    setup(props) {
      const router = useRouter();

      async function deleteAccount() {
        const { data, error } = await supabase
          .from("accounts")
          .update({ deleted: true })
          .eq("id", props.accountId);

        router.push(`/accounts`);
      }

      return { deleteAccount };
    },
  };
</script>

<template>
  <form @submit.prevent="login">
    <input type="text" placeholder="Email" v-model="state.email" />
    <input type="password" placeholder="Password" v-model="state.password" />
    <input type="submit" value="Submit" />
  </form>
</template>

<script>
  import { watch, defineComponent, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { user, auth } from "@/auth";
  export default defineComponent({
    setup() {
      const state = reactive({
        email: "",
        password: "",
      });
      
      const router = useRouter();

      async function login() {
        const resp = await auth.signInWithEmailAndPassword(
          state.email,
          state.password
        );

        if (!resp.user) throw Error("No user");

        user.value = resp.user;
      }

      watch(
        () => user.value,
        (newUser) => {
          if (newUser) {
            router.push("/portfolio");
          }
        }
      );

      return {
        state,
        login,
      };
    },
  });
</script>

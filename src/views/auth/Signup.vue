<template>
  <form @submit.prevent="signup">
    <input type="text" placeholder="Email" v-model="state.email" />
    <input type="password" placeholder="Password" v-model="state.password" />
    <input type="submit" value="Submit" />
  </form>
</template>

<script>
  import { watch, defineComponent, reactive } from "vue";
  import { user, auth } from "@/auth";
  import { useRouter } from "vue-router";
  export default defineComponent({
    setup(props) {
      const state = reactive({
        email: "",
        password: "",
      });

      const router = useRouter();

      watch(
        () => user.value,
        (newUser) => {
          if (newUser) {
            router.push("/portfolio");
          }
        }
      );

      async function signup() {
        if (state.email == "" || state.password == "") return;

        const creds = await auth.createUserWithEmailAndPassword(
          state.email,
          state.password
        );

        if (!creds.user) throw Error("Signup failed");

        user.value = creds.user;
      }

      return {
        state,
        signup,
      };
    },
  });
</script>

<template>
  <div class="max-w-md w-full mt-32 mx-auto">
    <h1 class="text-4xl font-thin">
      Welcome to, <span class="font-normal text-ming  ">Myze</span>
    </h1>
    <form class="mt-12 space-y-6" @submit.prevent="handleLogin">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
            placeholder="Email address"
            v-model="email"
          />
        </div>
      </div>

      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
            placeholder="Password"
            v-model="password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          :class="loading ? 'bg-opacity-50' : 'bg-opacity-100'"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ming hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: lock-closed -->
            <svg
              class="h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Login
        </button>
        <div class="text-center p-5">
          <a href="/signup" class=" text-ming text-sm font-medium"
            >I don't have an account</a
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { supabase } from "../../supabase";
  import { useRouter } from "vue-router";

  export default defineComponent({
    setup() {
      const loading = ref(false);
      const email = ref("");
      const password = ref("");
      const router = useRouter();

      async function handleLogin() {
        loading.value = true;

        const { error } = await supabase.auth.signIn({
          email: email.value,
          password: password.value,
        });

        if (error) {
          alert(error.error_description || error.message);
        }

        await router.push("/accounts");

        loading.value = false;
      }

      return {
        loading,
        email,
        password,
        handleLogin,
      };
    },
  });
</script>

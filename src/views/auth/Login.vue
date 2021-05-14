<template>
  <div class="max-w-md w-full space-y-8 m-auto">
    <form class="mt-8 space-y-6" @submit.prevent="login">
      <p class="text-2xl">Login</p>

      <p
        v-if="state.errorMessage.length > 0"
        class="bg-red-200 border border-red-300 text-red-800 px-2 py-2 rounded-md"
      >
        {{ state.errorMessage }}
      </p>

      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
            placeholder="Email address"
            v-model="state.email"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
            placeholder="Password"
            v-model="state.password"
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember_me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: lock-closed -->
            <svg
              class="h-5 w-5 text-blue-400 group-hover:text-blue-300"
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
          Log In
        </button>
      </div>

      <div class="text-sm text-center">
        <router-link
          to="/signup"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          I don't have an account
        </router-link>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { realm } from "@/realm";
  export default defineComponent({
    setup() {
      const state = reactive({
        email: "",
        password: "",
        errorMessage: "",
      });

      const router = useRouter();

      async function login() {
        await realm.loginWithEmailAndPassword(state.email, state.password);
        router.push("/overview");
      }

      return {
        state,
        login,
      };
    },
  });
</script>

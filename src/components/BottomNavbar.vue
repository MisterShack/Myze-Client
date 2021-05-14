<template>
  <nav class="fixed bottom-0">
    <div
      class="bg-gray-800 h-screen w-screen transition duration-500"
      @click="hide"
      :class="show ? 'opacity-75' : 'opacity-0 invisible'"
    >
      <div
        class="absolute bottom-0 w-screen text-center transition ease-in-out duration-500 transform pb-12"
        :class="
          show ? 'opacity-100 -translate-y-0' : 'opacity-0 translate-y-full'
        "
      >
        <a
          v-for="(route, label) in routes"
          :key="label"
          class="py-3 border-t border-gray-100 block cursor-pointer bg-white text-gray-900"
          @click="navigate(route)"
        >
          {{ label }}
        </a>
      </div>
    </div>

    <button
      class="absolute bottom-0 w-screen py-3 bg-gray-100 border-t flex justify-center"
      @click="toggle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 transition transform duration-500"
        :class="show ? 'rotate-90' : 'rotate-0'"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useRouter } from "vue-router";

  export default defineComponent({
    setup() {
      const show = ref(false);

      const router = useRouter();

      function toggle() {
        show.value = !show.value;
      }

      function hide() {
        show.value = false;
      }

      function navigate(route: string) {
        hide();
        router.push(route);
      }

      const routes = {
        Overview: "/overview",
        Accounts: "/accounts",
        Settings: "/settings",
        Profile: "/profile",
        "Log Out": "/logout",
      };

      return { hide, toggle, navigate, routes, show };
    },
  });
</script>

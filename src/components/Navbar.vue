<template>
  <div class="relative py-2 bg-cyan-900 ">
    <nav
      class="relative flex items-center justify-between sm:h-10 lg:justify-start max-w-6xl w-4/5 mx-auto"
    >
      <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
        <div class="flex items-center justify-between w-full md:w-auto">
          <a href="/" aria-label="Home" class="text-3xl font-bold text-white">
            MYZE
          </a>
          <div class="-mr-2 flex items-center md:hidden">
            <button
              @click="toggleMobileMenu"
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              id="main-menu"
              aria-label="Main menu"
              aria-haspopup="true"
            >
              <svg
                class="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="hidden md:block md:ml-10 md:pr-4 flex-1">
        <a
          href="#"
          class="font-medium text-cyan-100 hover:text-white transition duration-150 ease-in-out"
          >Product</a
        >
        <a
          href="#"
          class="ml-8 font-medium text-cyan-100 hover:text-white transition duration-150 ease-in-out"
          >Features</a
        >
        <a
          href="#"
          class="ml-8 font-medium text-cyan-100 hover:text-white transition duration-150 ease-in-out"
          >Company</a
        >
        <a
          href="#"
          class="ml-8 font-medium text-cyan-100 hover:text-white transition duration-150 ease-in-out"
          >Contact</a
        >
      </div>
      <div>
        <router-link
          v-if="user !== null"
          class="ml-8 font-medium text-cyan-100 hover:text-white transition duration-150 ease-in-out"
          to="/logout"
        >
          Logout
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
  import { reactive } from "vue";
  import { realm } from "@/realm";

  export default {
    setup() {
      const state = reactive({
        showMobileMenu: false,
      });

      function toggleMobileMenu() {
        state.showMobileMenu = !state.showMobileMenu;
      }

      return {
        state,
        user: realm.currentUser.value,
        toggleMobileMenu,
      };
    },
  };
</script>

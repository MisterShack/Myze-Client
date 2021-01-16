<template>
  <div class="relative bg-white overflow-hidden">
    <div class="max-w-screen-xl mx-auto">
      <div
        class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
      >
        <svg
          class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>

        <div class="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav
            class="relative flex items-center justify-between sm:h-10 lg:justify-start"
          >
            <div
              class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0"
            >
              <div class="flex items-center justify-between w-full md:w-auto">
                <a
                  href="/"
                  aria-label="Home"
                  class="text-3xl font-bold text-blue-700"
                >
                  MYZE
                </a>
                <div class="-mr-2 flex items-center md:hidden">
                  <button
                    @click="toggleMobileMenu()"
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
            <div class="hidden md:block md:ml-10 md:pr-4">
              <a
                href="#"
                class="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                >Product</a
              >
              <a
                href="#"
                class="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                >Features</a
              >
              <a
                href="#"
                class="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                >Company</a
              >
              <a
                href="#"
                class="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
                >Contact</a
              >
              <router-link
                v-if="auth.isAuthenticated.value"
                class="ml-8 font-medium text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                to="portfolio"
              >
                Go To App
              </router-link>
              <a
                v-else
                href="#"
                class="ml-8 font-medium text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                @click="auth.loginWithRedirect"
                >Log in</a
              >
            </div>
          </nav>
        </div>

        <div
          class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden duration-150 ease-in-out"
          :class="
            state.showMobileMenu
              ? 'opacity-100 scale-100 visible'
              : 'opacity-0 scale-95 invisible'
          "
        >
          <div class="rounded-lg shadow-md">
            <div
              class="rounded-lg bg-white shadow-xs overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <div class="px-5 pt-4 flex items-center justify-between">
                <a
                  href="/"
                  aria-label="Home"
                  class="text-3xl font-bold text-blue-700"
                >
                  MYZE
                </a>
                <div class="-mr-2">
                  <button
                    @click="toggleMobileMenu()"
                    type="button"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    aria-label="Close menu"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="px-2 pt-2 pb-3">
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  role="menuitem"
                  >Product</a
                >
                <a
                  href="#"
                  class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  role="menuitem"
                  >Features</a
                >
                <a
                  href="#"
                  class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  role="menuitem"
                  >Company</a
                >
                <a
                  href="#"
                  class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  role="menuitem"
                  >Contact</a
                >
              </div>
              <div>
                <a
                  v-if="auth.isAuthenticated.value"
                  href="/portfolio"
                  class="block w-full px-5 py-3 text-center font-medium text-blue-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:bg-gray-100 focus:text-blue-700 transition duration-150 ease-in-out"
                  role="menuitem"
                >
                  Go To App
                </a>
                <a
                  v-else
                  href="#"
                  class="block w-full px-5 py-3 text-center font-medium text-blue-600 bg-gray-50 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:bg-gray-100 focus:text-blue-700 transition duration-150 ease-in-out"
                  role="menuitem"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>

        <main
          class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
        >
          <div class="sm:text-center lg:text-left">
            <h2
              class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl"
            >
              Focus on your
              <br class="xl:hidden" />
              <span class="text-blue-700">cash flow</span>
            </h2>
            <p
              class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
            >
              Stop wasting your time with spreadsheets and level up your
              personal finance toolkit with Myze. With our free tools and
              reports, you're in control of tracking your personal finances.
            </p>
            <div
              class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
            >
              <div class="rounded-md shadow">
                <a
                  href="#"
                  class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </a>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="#"
                  class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-blue-700 bg-blue-100 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img
        class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
        src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"
        alt=""
      />
    </div>
  </div>

  <div class="py-12 bg-white">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <p
          class="text-base leading-6 text-blue-600 font-semibold tracking-wide uppercase"
        >
          Features
        </p>
        <h3
          class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
        >
          Financial Planning Just Got Easier
        </h3>
        <p class="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
          Manage your finances and plan your future with these awesome features
        </p>
      </div>

      <div class="mt-10">
        <ul class="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <li>
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"
                >
                  <!-- Heroicon name: clipboard-list -->
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Full-throttle Transaction Tracking
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Spreadsheets can be boring, complicated and non-scalable.
                  Track your transactions in-depth with Myze by recording the
                  vendor, category, description and attaching photos.
                </p>
              </div>
            </div>
          </li>
          <li class="sm:mt-10">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"
                >
                  <!-- Heroicon name: refresh -->
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Eliminate Subscription Surprises
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Stay on top of recurring charges and avoid that unexpected
                  charge by tracking your recurring transactions. We can also
                  remind you to cancel a subscription before you pay!
                </p>
              </div>
            </div>
          </li>
          <li class="mt-10">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"
                >
                  <!-- Heroicon name: presentation-chart-line -->
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Did Someone Say Pie?
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Visualize your finances with our intuitive and extensive graph
                  and charts system. Choose from a variety of different layouts
                  and aggregation methods to figure out where your money is most
                  spent (and received!)
                </p>
              </div>
            </div>
          </li>
          <li class="mt-10">
            <div class="flex">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"
                >
                  <!-- Heroicon name: chat -->
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-lg leading-6 font-medium text-gray-900">
                  Your New Texting Buddy
                </h4>
                <p class="mt-2 text-base leading-6 text-gray-500">
                  Running low on data? Text in your transactions and have them
                  recorded straight to your account. You can also ask about your
                  account balances and upcoming transactions.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { reactive, inject } from "vue";

  export default {
    name: "Home",
    setup() {
      const state = reactive({
        showMobileMenu: false,
      });

      const auth = inject("auth");

      function toggleMobileMenu() {
        state.showMobileMenu = !state.showMobileMenu;
      }

      return {
        state,
        auth,
        toggleMobileMenu,
      };
    },
  };
</script>

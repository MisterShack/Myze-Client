<template>
  <div class="bg-green-100 text-green-900 shadow-md rounded-lg py-3 px-4 mb-5">
    <p class="text-md font-bold">Keep it up!</p>
    <p class="text-sm">
      Your cash flow was up $587 in December compared to November. Go even
      higher this month!
    </p>
  </div>

  <div
    class="flex space-y-5 flex-col lg:space-x-5 lg:flex-row lg:justify-between lg:items-baseline"
  >
    <div class="bg-white h-auto lg:flex-1 shadow-md rounded-lg p-6 pb-0">
      <h2 class="text-lg tracking-wide mb-3">Upcoming</h2>
      <ul class="my-6">
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          April 30th, 2020
        </li>
        <li>
          <ul>
            <li
              class="py-1 mb-2 flex items-center justify-between text-gray-600"
            >
              <span>Netflix</span>
              <span class="text-lg">$13.99</span>
            </li>
          </ul>
        </li>
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          May 22nd, 2020
        </li>
        <li>
          <ul>
            <li class="py-1 flex items-center justify-between text-gray-600">
              <span>Old Navy</span>
              <span class="text-lg">$56.98</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="bg-white h-auto lg:flex-1 shadow-md rounded-lg p-6 pb-0">
      <h2 class="text-lg tracking-wide mb-3">Latest</h2>
      <ul class="my-6">
        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          April 1st, 2020
        </li>
        <li>
          <ul class="mb-5">
            <li
              class="py-1 mb-2 flex items-center justify-between text-gray-600"
            >
              <span>Amazon</span>
              <span class="text-lg">$56.98</span>
            </li>
            <li
              class="py-1 my-2 flex items-center justify-between text-gray-600"
            >
              <span>Wal-Mart</span>
              <span class="text-lg">$56.98</span>
            </li>
            <li
              class="py-1 my-2 flex items-center justify-between text-gray-600"
            >
              <span>PetroCan</span>
              <span class="text-lg">$74.54</span>
            </li>
          </ul>
        </li>

        <li
          class="text-light-blue-700 text-sm border-b border-light-blue-700 pb-1 border-opacity-30"
        >
          May 22nd, 2020
        </li>
        <li>
          <ul>
            <li
              class="py-1 mb-2 flex items-center justify-between text-gray-600"
            >
              <span>Old Navy</span>
              <span class="text-lg">$56.98</span>
            </li>
            <li
              class="py-1 my-2 flex items-center justify-between text-gray-600"
            >
              <span>Wal-Mart</span>
              <span class="text-lg">$59.28</span>
            </li>
            <li
              class="py-1 my-2 flex items-center justify-between text-gray-600"
            >
              <span>PetroCan</span>
              <span class="text-lg">$74.54</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      transactions: [Array, null],
    },
  };
</script>

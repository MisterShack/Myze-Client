<template>
  <div
    class="bg-yellow-100 text-yellow-900 shadow-md rounded-lg py-3 px-4 mb-5"
  >
    <p class="text-md font-bold">Careful!</p>
    <p class="text-sm">
      Your annual recurring cash flow for this year is -$54.99. Click here to
      find out how to increase your recurring cash flow.
    </p>
  </div>

  <div class="bg-white shadow-md rounded-lg p-6 pb-1">
    <div class="flex justify-between items-center">
      <h2 class="text-lg tracking-wide mb-3">Recurring</h2>
      <button
        class="bg-green-100 py-2 px-4 text-xs font-semibold text-green-900 border border-green-500 border-opacity-20 hover:border-opacity-100 transition-all duration-300 ease-in-out rounded-md"
      >
        Add
      </button>
    </div>
    <ul class="my-6">
      <li class="text-light-blue-700 text-sm">April 30th, 2020</li>
      <hr class="border-light-blue-700 border-opacity-20 mt-1" />
      <ul>
        <li class="py-1 mb-2 flex items-center justify-between text-gray-600">
          <div>
            <p>Netflix</p>
            <p class="text-xs text-gray-400">Every month</p>
          </div>
          <span class="text-lg">-$13.99</span>
        </li>
      </ul>

      <li class="text-light-blue-700 text-sm mt-5">May 22nd, 2020</li>
      <hr class="border-light-blue-700 border-opacity-20 mt-1" />
      <ul>
        <li class="py-1 flex items-center justify-between text-gray-600">
          <div>
            <p>Payroll</p>
            <p class="text-xs text-gray-400">Every two weeks</p>
          </div>
          <span class="text-lg">$1450.00</span>
        </li>
      </ul>
    </ul>
  </div>
</template>

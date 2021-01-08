<template>
  <div class="my-5">
    <label class="block text-sm leading-5 font-medium text-gray-700"
      ><slot name="label"
    /></label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <slot />
    </div>
  </div>
</template>

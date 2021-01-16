<template>
  <div class="mt-1 relative rounded-md shadow-sm">
    <input
      v-model="state.selectedVendor.name"
      @input="filterVendors"
      class="form-input block w-full px-3 py-2 sm:text-sm sm:leading-5"
      id="t_vendor"
      name="Vendor"
    />
    <div
      v-if="state.filteredVendors.length > 0"
      class="mt-1 w-full rounded-md bg-white shadow-lg z-10 absolute overflow-y-auto"
      style="max-height: 14rem;"
    >
      <ul
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-item-3"
        class="rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
      >
        <li
          v-for="vendor in state.filteredVendors"
          :key="vendor.name"
          role="option"
          class="cursor-default select-none relative py-2 px-3 text-gray-900 hover:text-white hover:bg-indigo-600"
          @click="selectVendor(vendor)"
        >
          <div class="flex items-center space-x-3">
            <span class="font-normal block truncate hover:font-semibold">
              {{ vendor.name }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .form-input {
    background-color: #fff;
    border-color: #d2d6dc;
    border-width: 1px;
    border-radius: 0.375rem;
  }
</style>

<script>
  import { ref, reactive } from "vue";
  export default {
    props: {
      vendors: {
        type: Array,
        default: () => [],
      },
    },
    emits: ["select-vendor"],
    setup(props, context) {
      const state = reactive({
        filteredVendors: [],
        selectedVendor: {},
      });

      const vendors = ref(props.vendors);

      function filterVendors() {
        state.selectedVendor.id = null;

        state.filteredVendors = vendors.value.filter(
          (v) =>
            v.name
              .toLowerCase()
              .indexOf(state.selectedVendor.name.toLowerCase()) >= 0
        );
      }

      function clearVendors() {
        state.filteredVendors = [];
      }

      function selectVendor(clickedVendor) {
        state.selectedVendor = {
          id: clickedVendor.id,
          name: clickedVendor.name,
        };

        clearVendors();

        context.emit("select-vendor", state.selectedVendor);
      }

      return {
        state,
        clearVendors,
        filterVendors,
        selectVendor,
      };
    },
  };
</script>

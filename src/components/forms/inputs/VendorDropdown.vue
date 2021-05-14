<template>
  <div class="mt-1 relative rounded-md shadow-sm">
    <input
      v-model="selectedVendor.name"
      @input="filterVendors"
      class="form-input block w-full px-3 py-2 sm:text-sm sm:leading-5"
      id="t_vendor"
      name="Vendor"
      @keyup.down="highlightNextVendor"
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
          v-for="(vendor, idx) in state.filteredVendors"
          :key="vendor.name"
          role="option"
          class="cursor-default select-none relative py-2 px-3"
          :class="
            state.highlightedVendor === idx
              ? 'text-white bg-indigo-600'
              : 'text-gray-900'
          "
          @mouseover="highlightVendor(idx)"
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
  import { reactive } from "vue";
  export default {
    props: {
      vendors: {
        type: Object,
        default: () => {},
      },
      selectedVendor: Object,
    },
    setup(props) {
      const state = reactive({
        filteredVendors: [],
        highlightedVendor: null,
      });

      function filterVendors() {
        props.selectedVendor.id = null;
        state.highlightedVendor = null;

        if (Object.keys(props.vendors).length === 0) {
          state.filteredVendors = [];
        } else {
          state.filteredVendors = Object.values(props.vendors).filter(
            (v) =>
              v.name
                .toLowerCase()
                .indexOf(props.selectedVendor.name.toLowerCase()) >= 0
          );
        }
      }

      function clearVendors() {
        state.filteredVendors = [];
      }

      function selectVendor(clickedVendor) {
        props.selectedVendor.id = clickedVendor.id;
        props.selectedVendor.name = clickedVendor.name;
        clearVendors();
      }

      function highlightVendor(vendorIdx) {
        state.highlightedVendor = vendorIdx;
      }

      function highlightNextVendor() {
        if (state.highlightedVendor < state.filteredVendors.length) {
          state.highlightNextVendor++;
        }
      }

      return {
        state,
        clearVendors,
        filterVendors,
        highlightVendor,
        highlightNextVendor,
        selectVendor,
      };
    },
  };
</script>

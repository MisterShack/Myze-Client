<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed inset-0 overflow-hidden"
      @close="close"
      :open="open"
    >
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div class="relative w-screen max-w-md">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4"
                >
                  <button
                    class="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    @click="close"
                  >
                    <span class="sr-only">Close panel</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div
                class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll"
              >
                <div class="px-4 sm:px-6">
                  <DialogTitle class="text-lg font-medium text-gray-900">
                    <slot name="title" />
                  </DialogTitle>
                </div>
                <div class="mt-6 relative flex-1 px-4 sm:px-6">
                  <slot :close="close" />
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
  import { watch, ref } from "vue";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  } from "@headlessui/vue";
  import { XIcon } from "@heroicons/vue/solid/esm";

  export default {
    components: {
      Dialog,
      DialogOverlay,
      DialogTitle,
      TransitionChild,
      TransitionRoot,
      XIcon,
    },
    props: {
      active: Boolean,
    },
    setup(props, { emit }) {
      let open = ref(props.active);

      function close() {
        open.value = false;
        emit("update:active", open.value);
      }

      watch(
        () => props.active,
        (active) => {
          open.value = active;
        }
      );

      return {
        open,
        close,
      };
    },
  };
</script>

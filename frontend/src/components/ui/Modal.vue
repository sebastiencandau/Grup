<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="close"
        aria-label="Close modal"
      >
        ✕
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

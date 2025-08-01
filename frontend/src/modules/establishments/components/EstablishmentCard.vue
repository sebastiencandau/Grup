<template>
  <div
    class="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
    @click="goToAvailabilityPage"
  >
    <h2 class="text-xl font-semibold mb-2">{{ establishment.name }}</h2>
    <p class="text-gray-700 mb-1">{{ establishment.description }}</p>
    <p class="text-gray-500 text-sm mb-1">{{ establishment.address }}</p>
    <p class="text-gray-500 text-sm">📞 {{ establishment.phone }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

interface Establishment {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

const props = defineProps<{ establishment: Establishment }>();
const router = useRouter();

function goToAvailabilityPage() {
  router.push(`/establishments/${props.establishment.id}/availabilities`);
}
</script>

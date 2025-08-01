<template>
  <div class="space-y-8">
    <div v-for="([date, dayAvailabilities]) in groupedAvailabilities" :key="date">
      <h2 class="text-xl font-bold mb-4">{{ formatDate(date) }}</h2>
      <div class="grid gap-4 grid-cols-auto-fit">
        <div
          v-for="a in dayAvailabilities"
          :key="a.id"
          @click="handleClick(a)"
          class="p-4 rounded border shadow-sm transition flex flex-col justify-between min-h-[180px] max-w-[250px]"
          :class="{
            'bg-gray-100 text-gray-400 line-through': !a.isActive || a.isBooked,
            'hover:shadow-md cursor-pointer': a.isActive && !a.isBooked,
          }"
        >
          <div>
            <div class="flex justify-between items-center mb-2">
              <p class="font-semibold text-lg">
                {{ formatTime(a.startTime) }} - {{ formatTime(a.endTime) }}
              </p>
              <span
                v-if="!a.isActive"
                class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
              >Inactif</span>
              <span
                v-else-if="a.isBooked"
                class="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded"
              >Réservé</span>
              <span
                v-else
                class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
              >Disponible</span>
            </div>
            <p class="text-sm text-gray-600">{{ a.details }}</p>
          </div>
          <p class="text-sm text-gray-500 mt-4">👥 Max participants : {{ a.maxParticipants }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Availability {
  id: string
  establishmentId: string
  date: string
  startTime: string
  endTime: string
  maxParticipants: number
  details: string
  isActive: boolean
  isBooked: boolean
}

const props = defineProps<{ groupedAvailabilities: [string, Availability[]][] }>()
const emit = defineEmits<{ (e: 'selectAvailability', availability: Availability): void }>()

function formatDate(date: string): string {
  const dt = new Date(date)
  return dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(time: string): string {
  return time.slice(0, 5) // "14:00:00" => "14:00"
}

function handleClick(availability: Availability) {
  if (availability.isActive && !availability.isBooked) {
    emit('selectAvailability', availability)
  }
}
</script>

<style>
.grid-cols-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem; /* équivalent gap-4 */
}
</style>

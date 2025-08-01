<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Disponibilités</h1>
    <AvailabilityList 
      :groupedAvailabilities="groupedAvailabilities"
      @selectAvailability="openModal" 
    />
    <ReservationForm
      v-if="modalVisible"
      :availability="selectedAvailability"
      @close="closeModal"
      @submitted="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAvailabilitiesByEstablishment } from '@/services/availabilityService'
import AvailabilityList from '@/modules/availabilities/components/AvailabilityList.vue'
import ReservationForm from '@/modules/reservations/components/ReservationForm.vue'

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

const availabilities = ref<Availability[]>([])
const route = useRoute()
const establishmentId = route.params.id as string

const modalVisible = ref(false)
const selectedAvailability = ref<Availability | null>(null)

onMounted(async () => {
  availabilities.value = await fetchAvailabilitiesByEstablishment(establishmentId)
})

// Groupe et déduplique les dispos par date et startTime
const groupedAvailabilities = computed(() => {
  const map = new Map<string, Availability[]>()

  const filtered = availabilities.value
    .filter((a) => a.isActive && !a.isBooked)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  for (const a of filtered) {
    if (!map.has(a.date)) {
      map.set(a.date, [])
    }
    const dayList = map.get(a.date)!

    const alreadyExists = dayList.some(avail => avail.startTime === a.startTime)
    if (!alreadyExists) {
      dayList.push(a)
    }
  }

  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
})

function openModal(availability: Availability) {
  selectedAvailability.value = availability
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  selectedAvailability.value = null
}
</script>

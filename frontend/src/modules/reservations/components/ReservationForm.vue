<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
      <h2 class="text-xl font-bold mb-4">Réserver cette disponibilité</h2>

      <!-- Formulaire -->
      <form @submit.prevent="submit">
        <label class="block mb-1 font-semibold">
          Besoins particuliers (optionnel)
        </label>
        <textarea
          v-model="description"
          placeholder="Indiquez ici allergies, restrictions alimentaires, handicap ou toute autre information utile"
          class="w-full border rounded px-3 py-2 mb-4"
        ></textarea>

        <div class="mb-4">
          <label class="block mb-1 font-semibold">Email de l'organisateur</label>
          <input v-model="organizerEmail" type="email" required class="w-full border rounded px-3 py-2" />
        </div>

        <div class="mb-4">
          <label class="block mb-1 font-semibold">Nombre de participants</label>
          <input
            v-model.number="participantsCount"
            type="number"
            min="1"
            :max="availability.maxParticipants"
            required
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button type="button" @click="close" class="px-4 py-2 rounded bg-gray-300">Annuler</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Réserver</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createReservation } from '@/services/reservationService'

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

const props = defineProps<{ availability: Availability }>()
const emit = defineEmits(['close', 'submitted'])
const router = useRouter()

const description = ref('')
const organizerEmail = ref('')
const participantsCount = ref(1)

function close() {
  emit('close')
}

async function submit() {
    await createReservation({
      title: "réservation Grup " + props.availability.date,
      description: description.value,
      organizerEmail: organizerEmail.value,
      availabilityId: props.availability.id,
      participantsCount: participantsCount.value,
      participants: [],
    })

    // 👉 Redirection vers la page de succès
    router.push({ name: 'reservation-success' })
}
</script>

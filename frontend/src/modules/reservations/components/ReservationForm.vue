<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 class="text-xl font-bold mb-4">Réserver cette disponibilité</h2>
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1 font-semibold">Titre</label>
          <input v-model="title" type="text" required class="w-full border rounded px-3 py-2" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-semibold">Description</label>
          <textarea v-model="description" class="w-full border rounded px-3 py-2"></textarea>
        </div>
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
        <!-- Pour simplifier on laisse la liste des participants vide -->
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
import { createReservation } from '@/services/reservationService'

interface Availability {
  id: string
  maxParticipants: number
  // autres champs si besoin
}

const props = defineProps<{ availability: Availability }>()
const emit = defineEmits(['close', 'submitted'])

const title = ref('')
const description = ref('')
const organizerEmail = ref('')
const participantsCount = ref(1)

function close() {
  emit('close')
}

async function submit() {
  try {
    await createReservation({
      title: title.value,
      description: description.value,
      organizerEmail: organizerEmail.value,
      availabilityId: props.availability.id,
      participantsCount: participantsCount.value,
      participants: [], // liste vide pour l'instant
    })
    emit('submitted')
  } catch (error) {
    alert('Erreur lors de la création de la réservation.')
  }
}
</script>

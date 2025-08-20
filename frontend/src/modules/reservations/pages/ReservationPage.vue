<template>
  <div class="max-w-3xl mx-auto p-6">
    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="!reservation" class="text-center text-red-500">Réservation introuvable.</div>
    <div v-else class="space-y-6">
      <!-- Titre et description -->
      <h1 class="text-2xl font-bold">{{ reservation.title }}</h1>
      <p v-if="reservation.description" class="text-gray-700">{{ reservation.description }}</p>

      <!-- Informations sur la disponibilité -->
      <div class="border p-4 rounded shadow-sm">
        <h2 class="font-semibold mb-2">Informations principales</h2>
        <p>Date : {{ formatDate(reservation.availability.date) }}</p>
        <p>Heure : {{ formatTime(reservation.availability.startTime) }} - {{ formatTime(reservation.availability.endTime) }}</p>
        <p>Max participants : {{ reservation.availability.maxParticipants }}</p>
        <p>Détails : {{ reservation.availability.details || 'Aucun détail' }}</p>
        <p>
          Statut :
          <span
            :class="{
              'text-gray-400': !reservation.availability.isActive || reservation.availability.isBooked,
              'text-green-600': reservation.availability.isActive && !reservation.availability.isBooked
            }"
          >
            {{ reservation.availability.isActive ? (reservation.availability.isBooked ? 'Réservé' : 'Disponible') : 'Inactif' }}
          </span>
        </p>
      </div>

      <!-- Informations sur l'établissement -->
      <div class="border p-4 rounded shadow-sm">
        <h2 class="font-semibold mb-2">Établissement</h2>
        <p>Nom : {{ reservation.availability.establishment.name }}</p>
        <p v-if="reservation.availability.establishment.description">Description : {{ reservation.availability.establishment.description }}</p>
        <p>Adresse : {{ reservation.availability.establishment.address }}</p>
        <p v-if="reservation.availability.establishment.phone">Téléphone : {{ reservation.availability.establishment.phone }}</p>
      </div>

      <!-- Participants -->
      <div class="border p-4 rounded shadow-sm">
        <h2 class="font-semibold mb-2">Participants</h2>
        <p>Nombre de participants : {{ reservation.participantsCount }}</p>
        <ul v-if="reservation.participants && reservation.participants.length > 0" class="list-disc pl-6">
          <li v-for="(p, index) in reservation.participants" :key="index">{{ p }}</li>
        </ul>
        <p v-else>Aucun participant enregistré</p>
      </div>

      <!-- Organisateur -->
      <div class="border p-4 rounded shadow-sm">
        <h2 class="font-semibold mb-2">Organisateur</h2>
        <p>Email : {{ reservation.organizerEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchReservationById, Reservation } from '@/services/reservationService'

const route = useRoute()
const reservationId = route.params.id as string

const reservation = ref<Reservation | null>(null)
const loading = ref(true)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

onMounted(async () => {
  try {
    reservation.value = await fetchReservationById(reservationId)
  } catch (err) {
    console.error('Erreur lors de la récupération de la réservation :', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Optionnel : styles supplémentaires pour rendre le layout plus clair */
.border {
  border-color: #e5e7eb; /* gris clair */
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>

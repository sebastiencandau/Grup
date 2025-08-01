<template>
  <section class="container mx-auto px-4 py-8">
    <!-- Présentation commerciale -->
    <div class="mb-10 max-w-3xl mx-auto text-center">
      <h1 class="text-4xl font-extrabold mb-4">Bienvenue sur Grup</h1>
      <p class="text-lg text-gray-700">
        Grup simplifie la réservation de vos établissements préférés. Que vous cherchiez un restaurant cosy, un café branché ou un lieu unique, notre plateforme vous connecte rapidement à nos partenaires pour une expérience fluide et sans surprise.
        Rejoignez la communauté qui met la qualité et la convivialité au cœur de chaque réservation.
      </p>
    </div>

    <!-- Liste des établissements partenaires -->
    <h2 class="text-3xl font-semibold mb-6 text-center">Nos établissements partenaires</h2>

    <div v-if="loading" class="text-center py-10 text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center py-10 text-red-600">Erreur lors du chargement des établissements.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <EstablishmentCard
        v-for="establishment in establishments"
        :key="establishment.id"
        :establishment="establishment"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EstablishmentCard from '../components/EstablishmentCard.vue'
import { fetchEstablishments, Establishment } from '../../../services/establishmentService'

const establishments = ref<Establishment[]>([])
const loading = ref(true)
const error = ref(false)

async function loadEstablishments() {
  loading.value = true
  error.value = false
  var caca = await fetchEstablishments()
  console.log(caca);
  try {
    establishments.value = await fetchEstablishments()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEstablishments()
})
</script>

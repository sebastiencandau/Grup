#!/bin/bash

# Se placer dans src
mkdir -p src && cd src || exit 1

# Dossiers généraux
mkdir -p assets components/ui components/layout layouts modules router

# Composants de layout
cat > components/layout/AppHeader.vue <<EOF
<template>
  <header><h1>Header</h1></header>
</template>
EOF

cat > components/layout/AppFooter.vue <<EOF
<template>
  <footer><h1>Footer</h1></footer>
</template>
EOF

# Layout principal
cat > layouts/DefaultLayout.vue <<EOF
<template>
  <div>
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
EOF

# Modules : establishments
mkdir -p modules/establishments/pages modules/establishments/components
cat > modules/establishments/pages/EstablishmentListPage.vue <<EOF
<template>
  <h1>Liste des établissements</h1>
</template>
EOF

cat > modules/establishments/components/EstablishmentCard.vue <<EOF
<template>
  <div>
    <h1>Établissement</h1>
  </div>
</template>
EOF

# Modules : availabilities
mkdir -p modules/availabilities/pages modules/availabilities/components
cat > modules/availabilities/pages/AvailabilityPage.vue <<EOF
<template>
  <h1>Disponibilités de l’établissement</h1>
</template>
EOF

cat > modules/availabilities/components/AvailabilityList.vue <<EOF
<template>
  <div>
    <h1>Liste des disponibilités</h1>
  </div>
</template>
EOF

# Modules : reservations
mkdir -p modules/reservations/pages modules/reservations/components
cat > modules/reservations/pages/CreateReservationPage.vue <<EOF
<template>
  <h1>Créer une réservation</h1>
</template>
EOF

cat > modules/reservations/components/ReservationForm.vue <<EOF
<template>
  <div>
    <h1>Formulaire de réservation</h1>
  </div>
</template>
EOF

# Composant UI
cat > components/ui/BaseButton.vue <<EOF
<template>
  <button><slot /></button>
</template>
EOF

# Router
cat > router/index.ts <<EOF
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/modules/establishments/pages/EstablishmentListPage.vue'),
  },
  {
    path: '/establishments/:id/availabilities',
    component: () => import('@/modules/availabilities/pages/AvailabilityPage.vue'),
  },
  {
    path: '/reservations/new/:availabilityId',
    component: () => import('@/modules/reservations/pages/CreateReservationPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
EOF

# Fichiers racine
cat > App.vue <<EOF
<template>
  <DefaultLayout />
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
EOF

cat > main.ts <<EOF
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
EOF

echo "✅ Structure Vue 3 générée avec succès dans ./src"

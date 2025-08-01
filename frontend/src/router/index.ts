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

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
    path: '/reservations/:id',
    component: () => import('@/modules/reservations/pages/ReservationPage.vue'),
  },
  {
    path: '/reservations/new/:availabilityId',
    component: () => import('@/modules/reservations/pages/CreateReservationPage.vue'),
  },
  {
    path: '/reservation-success',
    name: 'reservation-success',
    component: () => import('@/modules/reservations/pages/ReservationSucess.vue'),
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import axios from 'axios'

interface ReservationPayload {
  title: string
  description: string
  organizerEmail: string
  availabilityId: string
  participantsCount: number
  participants: string[]
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function createReservation(data: ReservationPayload) {
  const response = await axios.post(`${apiBaseUrl}/reservations`, data)
  return response.data
}

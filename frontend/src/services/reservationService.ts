import axios from 'axios'

interface ReservationPayload {
  title: string
  description?: string
  organizerEmail: string
  availabilityId: string
  participantsCount: number
  participants?: string[]
}

export interface Reservation {
  id: string
  title: string
  description?: string
  organizerEmail: string
  token: string
  availabilityId: string
  availability: {
    id: string
    date: string
    startTime: string
    endTime: string
    maxParticipants: number
    details?: string
    isActive: boolean
    isBooked: boolean
    establishment: {
      id: string
      name: string
      address: string
    }
  }
  participantsCount: number
  participants?: string[]
}


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// Création d'une réservation
export async function createReservation(data: ReservationPayload): Promise<Reservation> {
  const response = await axios.post(`${apiBaseUrl}/reservations`, data)
  return response.data
}

// Récupération d'une réservation par son id
export async function fetchReservationById(id: string): Promise<Reservation> {
  const response = await axios.get(`${apiBaseUrl}/reservations/${id}`)
  return response.data
}

// Optionnel : récupération de toutes les réservations d'une disponibilité
export async function fetchReservationsByAvailability(availabilityId: string): Promise<Reservation[]> {
  const response = await axios.get(`${apiBaseUrl}/reservations?availabilityId=${availabilityId}`)
  return response.data
}

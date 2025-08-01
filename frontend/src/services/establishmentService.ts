import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export interface Establishment {
  id: string
  name: string
  description: string
  address: string
  phone: string
}

export async function fetchEstablishments(): Promise<Establishment[]> {
  try {
    console.log(apiBaseUrl)
    const response = await axios.get<Establishment[]>(`${apiBaseUrl}/establishments`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des établissements', error)
    throw error
  }
}

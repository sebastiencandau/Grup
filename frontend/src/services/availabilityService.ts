import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function fetchAvailabilitiesByEstablishment(establishmentId: string) {
  const response = await axios.get(`${apiBaseUrl}/availabilities/establishment/${establishmentId}`);
  return response.data;
}

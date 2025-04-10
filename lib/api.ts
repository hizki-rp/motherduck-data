import type { WeatherData, HousePriceData, FlightData } from "./types"

const API_BASE_URL = "http://127.0.0.1:5000/api"
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to handle API responses with retry logic
async function fetchFromAPI<T>(endpoint: string, retries = MAX_RETRIES): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return (await response.json()) as T[]
  } catch (error) {
    if (retries > 0) {
      console.warn(`Error fetching from ${endpoint}, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return fetchFromAPI<T>(endpoint, retries - 1)
    }

    console.error(`Error fetching from ${endpoint}:`, error)
    throw error
  }
}

// Function to fetch weather data
export async function fetchWeatherData(): Promise<WeatherData[]> {
  return fetchFromAPI<WeatherData>("/weather")
}

// Function to fetch house price data
export async function fetchHousePriceData(): Promise<HousePriceData[]> {
  return fetchFromAPI<HousePriceData>("/houseprice")
}

// Function to fetch flight data
export async function fetchFlightData(): Promise<FlightData[]> {
  return fetchFromAPI<FlightData>("/flights")
}

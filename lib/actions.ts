"use server"

import { cache } from "react"
import type { WeatherData, FlightData, HousePriceData } from "./types"
import * as api from "./api"

// Fetch weather data
export const fetchWeatherData = cache(async (limit = 20): Promise<WeatherData[]> => {
  try {
    // Fetch data from the API
    const data = await api.fetchWeatherData()

    // Return the data, limited to the requested number of items
    return data.slice(0, limit)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
})

// Fetch flight data
export const fetchFlightData = cache(async (limit = 20): Promise<FlightData[]> => {
  try {
    // Fetch data from the API
    const data = await api.fetchFlightData()

    // Return the data, limited to the requested number of items
    return data.slice(0, limit)
  } catch (error) {
    console.error("Error fetching flight data:", error)
    throw error
  }
})

// Fetch house price data
export const fetchHousePriceData = cache(async (limit = 20): Promise<(HousePriceData & { id?: number })[]> => {
  try {
    // Fetch data from the API
    const data = await api.fetchHousePriceData()

    // Add an id field for the table and return the data
    return data.slice(0, limit).map((item, index) => ({
      ...item,
      id: index + 1,
    }))
  } catch (error) {
    console.error("Error fetching house price data:", error)
    throw error
  }
})

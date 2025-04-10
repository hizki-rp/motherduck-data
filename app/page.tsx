"use client"

import { useState, useEffect } from "react"
import { WeatherDashboard } from "@/components/weather/weather-dashboard"
import { FlightDashboard } from "@/components/flights/flight-dashboard"
import { HousePriceDashboard } from "@/components/house-prices/house-price-dashboard"
import { fetchWeatherData, fetchFlightData, fetchHousePriceData } from "@/lib/actions"
import { DashboardSkeleton } from "@/components/loading-state"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ErrorDisplay } from "@/components/error-display"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("weather")
  const [weatherData, setWeatherData] = useState<any[]>([])
  const [flightData, setFlightData] = useState<any[]>([])
  const [housePriceData, setHousePriceData] = useState<any[]>([])
  const [loading, setLoading] = useState({
    weather: true,
    flights: false,
    housePrices: false,
  })
  const [error, setError] = useState({
    weather: null as string | null,
    flights: null as string | null,
    housePrices: null as string | null,
  })

  const loadWeatherData = async () => {
    try {
      setLoading((prev) => ({ ...prev, weather: true }))
      setError((prev) => ({ ...prev, weather: null }))
      const data = await fetchWeatherData(20)
      setWeatherData(data)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        weather: err instanceof Error ? err.message : "Failed to fetch weather data",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, weather: false }))
    }
  }

  const loadFlightData = async () => {
    try {
      setLoading((prev) => ({ ...prev, flights: true }))
      setError((prev) => ({ ...prev, flights: null }))
      const data = await fetchFlightData(20)
      setFlightData(data)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        flights: err instanceof Error ? err.message : "Failed to fetch flight data",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, flights: false }))
    }
  }

  const loadHousePriceData = async () => {
    try {
      setLoading((prev) => ({ ...prev, housePrices: true }))
      setError((prev) => ({ ...prev, housePrices: null }))
      const data = await fetchHousePriceData(20)
      setHousePriceData(data)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        housePrices: err instanceof Error ? err.message : "Failed to fetch house price data",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, housePrices: false }))
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [])

  useEffect(() => {
    if (activeTab === "flights" && flightData.length === 0 && !loading.flights) {
      loadFlightData()
    }
  }, [activeTab, flightData.length, loading.flights])

  useEffect(() => {
    if (activeTab === "house-prices" && housePriceData.length === 0 && !loading.housePrices) {
      loadHousePriceData()
    }
  }, [activeTab, housePriceData.length, loading.housePrices])

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 container py-6 space-y-6 md:py-8">
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "weather" ? "Weather Data" : activeTab === "flights" ? "Flight Data" : "House Prices"}
            </h1>
            <div className="text-sm text-muted-foreground">Data from MotherDuck via Flask API</div>
          </div>
        </div>

        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Connected to MotherDuck database via Flask API at http://127.0.0.1:5000. Make sure the API is running to see
            live data.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {activeTab === "weather" &&
            (loading.weather ? (
              <DashboardSkeleton />
            ) : error.weather ? (
              <ErrorDisplay title="Error loading weather data" message={error.weather} retry={loadWeatherData} />
            ) : (
              <WeatherDashboard initialData={weatherData} />
            ))}

          {activeTab === "flights" &&
            (loading.flights ? (
              <DashboardSkeleton />
            ) : error.flights ? (
              <ErrorDisplay title="Error loading flight data" message={error.flights} retry={loadFlightData} />
            ) : (
              <FlightDashboard initialData={flightData} />
            ))}

          {activeTab === "house-prices" &&
            (loading.housePrices ? (
              <DashboardSkeleton />
            ) : error.housePrices ? (
              <ErrorDisplay
                title="Error loading house price data"
                message={error.housePrices}
                retry={loadHousePriceData}
              />
            ) : (
              <HousePriceDashboard initialData={housePriceData} />
            ))}
        </div>
      </div>
    </main>
  )
}

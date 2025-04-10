"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { weatherColumns } from "./weather-columns"
import { type WeatherData, fetchWeatherData } from "@/lib/actions"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TableSkeleton } from "@/components/loading-state"
import { ResponsiveChart } from "@/components/ui/responsive-chart"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { motion } from "framer-motion"
import { ErrorDisplay } from "@/components/error-display"

interface WeatherDashboardProps {
  initialData: WeatherData[]
}

export function WeatherDashboard({ initialData }: WeatherDashboardProps) {
  const [data, setData] = useState<WeatherData[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fullDataLoaded, setFullDataLoaded] = useState(false)

  // Load full data only when the Raw Data tab is clicked
  const loadFullData = async () => {
    if (fullDataLoaded) return

    setLoading(true)
    setError(null)
    try {
      const fullData = await fetchWeatherData(100)
      setData(fullData)
      setFullDataLoaded(true)
    } catch (error) {
      console.error("Error loading full data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (data.length === 0 && !loading && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Weather Data Available</CardTitle>
          <CardDescription>There is currently no weather data available in the database.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Helper function to convert RainToday/RainTomorrow to boolean for calculations
  const isRain = (value: any): boolean => {
    if (typeof value === "string") return value === "Yes"
    if (typeof value === "number") return value === 1
    return false
  }

  // Prepare data for temperature chart
  const temperatureData = data.slice(0, 20).map((item, index) => ({
    name: `Day ${index + 1}`,
    min: item.MinTemp,
    max: item.MaxTemp,
    morning: item.Temp9am,
    afternoon: item.Temp3pm,
  }))

  // Prepare data for rainfall chart
  const rainfallData = data.slice(0, 20).map((item, index) => ({
    name: `Day ${index + 1}`,
    rainfall: item.Rainfall,
    humidity9am: item.Humidity9am,
    humidity3pm: item.Humidity3pm,
  }))

  // Prepare data for wind speed chart
  const windData = data.slice(0, 20).map((item, index) => ({
    name: `Day ${index + 1}`,
    gust: item.WindGustSpeed,
    morning: item.WindSpeed9am,
    afternoon: item.WindSpeed3pm,
  }))

  // Prepare data for rain prediction pie chart
  const rainTomorrowCount = data.reduce(
    (acc, item) => {
      if (isRain(item.RainTomorrow)) {
        acc.yes += 1
      } else {
        acc.no += 1
      }
      return acc
    },
    { yes: 0, no: 0 },
  )

  const rainPredictionData = [
    { name: "Rain", value: rainTomorrowCount.yes },
    { name: "No Rain", value: rainTomorrowCount.no },
  ]

  const COLORS = ["#0088FE", "#FFBB28"]

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {error && <ErrorDisplay title="Error Loading Data" message={error} retry={loadFullData} />}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0 sm:flex-nowrap">
            {["overview", "temperature", "rainfall", "wind", "data"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={tab === "data" ? loadFullData : undefined}
                className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 text-sm font-medium transition-all"
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "temperature"
                    ? "Temperature"
                    : tab === "rainfall"
                      ? "Rainfall & Humidity"
                      : tab === "wind"
                        ? "Wind"
                        : "Raw Data"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Max Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(data.reduce((sum, item) => sum + item.MaxTemp, 0) / data.length).toFixed(1)}°C
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rainfall</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(data.reduce((sum, item) => sum + item.Rainfall, 0) / data.length).toFixed(1)} mm
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Wind Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(data.reduce((sum, item) => sum + item.WindSpeed3pm, 0) / data.length).toFixed(1)} km/h
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rain Tomorrow Probability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{((rainTomorrowCount.yes / data.length) * 100).toFixed(1)}%</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Temperature Trends</CardTitle>
                  <CardDescription>Min and max temperatures over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <LineChart
                      data={temperatureData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="min" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="max" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Rain Prediction</CardTitle>
                  <CardDescription>Likelihood of rain tomorrow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <PieChart>
                      <Pie
                        data={rainPredictionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {rainPredictionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="temperature">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Analysis</CardTitle>
                  <CardDescription>Detailed view of temperature patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <LineChart
                      data={temperatureData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="min" stroke="#8884d8" name="Min Temp" />
                      <Line type="monotone" dataKey="max" stroke="#82ca9d" name="Max Temp" />
                      <Line type="monotone" dataKey="morning" stroke="#ffc658" name="9am Temp" />
                      <Line type="monotone" dataKey="afternoon" stroke="#ff8042" name="3pm Temp" />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="rainfall">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Rainfall and Humidity</CardTitle>
                  <CardDescription>Rainfall amounts and humidity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <BarChart
                      data={rainfallData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rainfall" fill="#8884d8" name="Rainfall (mm)" />
                      <Line
                        type="monotone"
                        dataKey="humidity9am"
                        stroke="#82ca9d"
                        name="Humidity 9am (%)"
                        yAxisId="right"
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity3pm"
                        stroke="#ffc658"
                        name="Humidity 3pm (%)"
                        yAxisId="right"
                      />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="wind">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Wind Speed Analysis</CardTitle>
                  <CardDescription>Wind speeds throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <LineChart
                      data={windData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gust" stroke="#8884d8" name="Wind Gust Speed" />
                      <Line type="monotone" dataKey="morning" stroke="#82ca9d" name="Wind Speed 9am" />
                      <Line type="monotone" dataKey="afternoon" stroke="#ffc658" name="Wind Speed 3pm" />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="data">
            {loading ? (
              <TableSkeleton />
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Data</CardTitle>
                    <CardDescription>Raw weather data from the database</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={weatherColumns}
                      data={data}
                      searchColumn="RainToday"
                      searchPlaceholder="Filter by rain today..."
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}

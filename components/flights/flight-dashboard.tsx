"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { flightColumns } from "./flight-columns"
import { type FlightData, fetchFlightData } from "@/lib/actions"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis } from "recharts"
import { TableSkeleton } from "@/components/loading-state"
import { ResponsiveChart } from "@/components/ui/responsive-chart"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { motion } from "framer-motion"

interface FlightDashboardProps {
  initialData: FlightData[]
}

export function FlightDashboard({ initialData }: FlightDashboardProps) {
  const [data, setData] = useState<FlightData[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [fullDataLoaded, setFullDataLoaded] = useState(false)

  // Load full data only when the Raw Data tab is clicked
  const loadFullData = async () => {
    if (fullDataLoaded) return

    setLoading(true)
    try {
      const fullData = await fetchFlightData(100)
      setData(fullData)
      setFullDataLoaded(true)
    } catch (error) {
      console.error("Error loading full data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for delay analysis
  const delayData = data.slice(0, 20).map((item, index) => ({
    name: `Flight ${index + 1}`,
    departure: item.DEP_DELAY,
    arrival: item.ARR_DELAY,
  }))

  // Prepare data for distance vs air time
  const distanceTimeData = data.map((item) => ({
    x: item.DISTANCE,
    y: item.AIR_TIME,
    z: 1,
    name: `Flight on ${item.FL_DATE}`,
  }))

  // Calculate average metrics
  const avgDepDelay = data.reduce((sum, item) => sum + item.DEP_DELAY, 0) / data.length
  const avgArrDelay = data.reduce((sum, item) => sum + item.ARR_DELAY, 0) / data.length
  const avgAirTime = data.reduce((sum, item) => sum + item.ARR_DELAY, 0) / data.length
  const avgAirTimeCalc = data.reduce((sum, item) => sum + item.AIR_TIME, 0) / data.length
  const avgDistance = data.reduce((sum, item) => sum + item.DISTANCE, 0) / data.length

  // Count delayed flights
  const delayedFlights = data.filter((item) => item.DEP_DELAY > 15 || item.ARR_DELAY > 15).length
  const delayPercentage = (delayedFlights / data.length) * 100

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0 sm:flex-nowrap">
            {["overview", "delays", "distance", "data"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={tab === "data" ? loadFullData : undefined}
                className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 text-sm font-medium transition-all"
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "delays"
                    ? "Delay Analysis"
                    : tab === "distance"
                      ? "Distance vs Time"
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Departure Delay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgDepDelay.toFixed(1)} min</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Arrival Delay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgArrDelay.toFixed(1)} min</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Air Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgAirTimeCalc.toFixed(0)} min</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delayed Flights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{delayPercentage.toFixed(1)}%</div>
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
                  <CardTitle>Delay Comparison</CardTitle>
                  <CardDescription>Departure vs. arrival delays</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <BarChart
                      data={delayData}
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
                      <Bar dataKey="departure" fill="#8884d8" name="Departure Delay" />
                      <Bar dataKey="arrival" fill="#82ca9d" name="Arrival Delay" />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Distance vs. Air Time</CardTitle>
                  <CardDescription>Relationship between distance and flight time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Distance" unit=" miles" />
                      <YAxis type="number" dataKey="y" name="Air Time" unit=" min" />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter name="Flights" data={distanceTimeData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="delays">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Flight Delay Analysis</CardTitle>
                  <CardDescription>Detailed view of departure and arrival delays</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <BarChart
                      data={delayData}
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
                      <Bar dataKey="departure" fill="#8884d8" name="Departure Delay (min)" />
                      <Bar dataKey="arrival" fill="#82ca9d" name="Arrival Delay (min)" />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="distance">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Distance vs. Air Time Analysis</CardTitle>
                  <CardDescription>Correlation between flight distance and time in air</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Distance"
                        unit=" miles"
                        label={{ value: "Distance (miles)", position: "insideBottomRight", offset: -5 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Air Time"
                        unit=" min"
                        label={{ value: "Air Time (min)", angle: -90, position: "insideLeft" }}
                      />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter name="Flights" data={distanceTimeData} fill="#8884d8" />
                    </ScatterChart>
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
                    <CardTitle>Flight Data</CardTitle>
                    <CardDescription>Raw flight data from the database</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={flightColumns}
                      data={data}
                      searchColumn="FL_DATE"
                      searchPlaceholder="Filter by flight date..."
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

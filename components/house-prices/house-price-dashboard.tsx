"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { housePriceColumns } from "./house-price-columns"
import { type HousePriceData, fetchHousePriceData } from "@/lib/actions"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TableSkeleton } from "@/components/loading-state"
import { ResponsiveChart } from "@/components/ui/responsive-chart"
import { ResponsiveContainer } from "@/components/layout/responsive-container"
import { motion } from "framer-motion"

interface HousePriceDashboardProps {
  initialData: (HousePriceData & { id?: number })[]
}

export function HousePriceDashboard({ initialData }: HousePriceDashboardProps) {
  const [data, setData] = useState<(HousePriceData & { id?: number })[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [fullDataLoaded, setFullDataLoaded] = useState(false)

  // Load full data only when the Raw Data tab is clicked
  const loadFullData = async () => {
    if (fullDataLoaded) return

    setLoading(true)
    try {
      const fullData = await fetchHousePriceData(100)
      setData(fullData)
      setFullDataLoaded(true)
    } catch (error) {
      console.error("Error loading full data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate average metrics
  const avgPrice = data.reduce((sum, item) => sum + item.price, 0) / data.length
  const avgArea = data.reduce((sum, item) => sum + item.area, 0) / data.length
  const avgPricePerSqFt = avgPrice / avgArea
  const avgBedrooms = data.reduce((sum, item) => sum + item.bedrooms, 0) / data.length
  const avgBathrooms = data.reduce((sum, item) => sum + item.bathrooms, 0) / data.length

  // Prepare data for furnishing status pie chart
  const furnishingData = data.reduce(
    (acc, item) => {
      const status = item.furnishingstatus
      if (!acc[status]) {
        acc[status] = {
          name: status,
          value: 0,
        }
      }
      acc[status].value += 1
      return acc
    },
    {} as Record<string, { name: string; value: number }>,
  )

  const pieChartData = Object.values(furnishingData)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Prepare data for price vs area scatter plot
  const priceVsAreaData = data.map((item) => ({
    x: item.area,
    y: item.price,
    z: 1,
    name: `${item.bedrooms}bd ${item.bathrooms}ba, ${item.stories} stories`,
  }))

  // Prepare data for price by bedrooms chart
  const bedroomData = data.reduce(
    (acc, item) => {
      const beds = item.bedrooms
      if (!acc[beds]) {
        acc[beds] = {
          bedrooms: beds,
          count: 0,
          totalPrice: 0,
          avgPrice: 0,
        }
      }
      acc[beds].count += 1
      acc[beds].totalPrice += item.price
      acc[beds].avgPrice = acc[beds].totalPrice / acc[beds].count
      return acc
    },
    {} as Record<number, { bedrooms: number; count: number; totalPrice: number; avgPrice: number }>,
  )

  const bedroomChartData = Object.values(bedroomData).sort((a, b) => a.bedrooms - b.bedrooms)

  // Prepare data for amenities chart
  const amenitiesData = [
    { name: "Main Road", value: data.filter((item) => item.mainroad === "Yes").length },
    { name: "Guest Room", value: data.filter((item) => item.guestroom === "Yes").length },
    { name: "Basement", value: data.filter((item) => item.basement === "Yes").length },
    { name: "Hot Water", value: data.filter((item) => item.hotwaterheating === "Yes").length },
    { name: "AC", value: data.filter((item) => item.airconditioning === "Yes").length },
    { name: "Preferred Area", value: data.filter((item) => item.prefarea === "Yes").length },
  ]

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0 sm:flex-nowrap">
            {["overview", "features", "amenities", "distribution", "data"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                onClick={tab === "data" ? loadFullData : undefined}
                className="flex-1 sm:flex-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-2 text-sm font-medium transition-all"
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "features"
                    ? "By Features"
                    : tab === "amenities"
                      ? "Amenities"
                      : tab === "distribution"
                        ? "Distribution"
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
                  <CardTitle className="text-sm font-medium">Average Home Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(avgPrice)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price per Sq Ft</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(avgPricePerSqFt)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Bedrooms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgBedrooms.toFixed(1)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.length}</div>
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
                  <CardTitle>Price by Bedrooms</CardTitle>
                  <CardDescription>Average home prices by number of bedrooms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <BarChart
                      data={bedroomChartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bedrooms" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact",
                            maximumFractionDigits: 0,
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(Number(value))
                        }
                      />
                      <Legend />
                      <Bar dataKey="avgPrice" fill="#8884d8" name="Average Price" />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Furnishing Status</CardTitle>
                  <CardDescription>Distribution of furnishing types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={300}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
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

          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 md:grid-cols-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Price vs Area</CardTitle>
                  <CardDescription>Relationship between price and area</CardDescription>
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
                        name="Area"
                        unit=" sq ft"
                        label={{ value: "Area (sq ft)", position: "insideBottomRight", offset: -5 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Price"
                        unit=" USD"
                        label={{ value: "Price", angle: -90, position: "insideLeft" }}
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact",
                            maximumFractionDigits: 0,
                          }).format(value)
                        }
                      />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "Price") {
                            return [
                              new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              }).format(Number(value)),
                              name,
                            ]
                          }
                          return [value, name]
                        }}
                        cursor={{ strokeDasharray: "3 3" }}
                      />
                      <Scatter name="Properties" data={priceVsAreaData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="amenities">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Property Amenities</CardTitle>
                  <CardDescription>Count of properties with various amenities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <BarChart
                      data={amenitiesData}
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
                      <Bar dataKey="value" fill="#8884d8" name="Number of Properties" />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="distribution">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Stories Distribution</CardTitle>
                  <CardDescription>Distribution of properties by number of stories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart minHeight={400}>
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          data.reduce(
                            (acc, item) => {
                              const stories = item.stories
                              acc[stories] = (acc[stories] || 0) + 1
                              return acc
                            },
                            {} as Record<number, number>,
                          ),
                        ).map(([stories, count]) => ({
                          name: `${stories} ${Number(stories) === 1 ? "Story" : "Stories"}`,
                          value: count,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
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
                    <CardTitle>House Price Data</CardTitle>
                    <CardDescription>Raw house price data from the API</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={housePriceColumns}
                      data={data}
                      searchColumn="furnishingstatus"
                      searchPlaceholder="Filter by furnishing status..."
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

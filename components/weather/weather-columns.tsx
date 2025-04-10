"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WeatherData } from "@/lib/types"

export const weatherColumns: ColumnDef<WeatherData>[] = [
  {
    accessorKey: "MinTemp",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Min Temp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("MinTemp"))
      return <div className="font-medium">{value.toFixed(1)}°C</div>
    },
  },
  {
    accessorKey: "MaxTemp",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Max Temp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("MaxTemp"))
      return <div className="font-medium">{value.toFixed(1)}°C</div>
    },
  },
  {
    accessorKey: "Rainfall",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rainfall
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("Rainfall"))
      return <div>{value.toFixed(1)} mm</div>
    },
  },
  {
    accessorKey: "WindGustSpeed",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Wind Gust
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("WindGustSpeed"))
      return <div>{value.toFixed(1)} km/h</div>
    },
  },
  {
    accessorKey: "Humidity9am",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Humidity 9am
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("Humidity9am"))
      return <div>{value.toFixed(0)}%</div>
    },
  },
  {
    accessorKey: "Humidity3pm",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Humidity 3pm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("Humidity3pm"))
      return <div>{value.toFixed(0)}%</div>
    },
  },
  {
    accessorKey: "RainToday",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rain Today
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("RainToday")
      const displayValue = typeof value === "number" ? (value === 1 ? "Yes" : "No") : value
      return <div className={displayValue === "Yes" ? "text-blue-600 font-medium" : ""}>{displayValue}</div>
    },
  },
  {
    accessorKey: "RainTomorrow",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Rain Tomorrow
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("RainTomorrow")
      const displayValue = typeof value === "number" ? (value === 1 ? "Yes" : "No") : value
      return <div className={displayValue === "Yes" ? "text-blue-600 font-medium" : ""}>{displayValue}</div>
    },
  },
]

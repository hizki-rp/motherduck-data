"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FlightData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export const flightColumns: ColumnDef<FlightData>[] = [
  {
    accessorKey: "FL_DATE",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Flight Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("FL_DATE") as string
      return <div className="font-medium">{value}</div>
    },
  },
  {
    accessorKey: "DEP_TIME",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Departure Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "ARR_TIME",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Arrival Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "DEP_DELAY",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Departure Delay
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("DEP_DELAY"))
      return (
        <div className={value > 0 ? "text-red-600" : "text-green-600"}>
          {value > 0 ? `+${value.toFixed(0)} min` : `${value.toFixed(0)} min`}
        </div>
      )
    },
  },
  {
    accessorKey: "ARR_DELAY",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Arrival Delay
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("ARR_DELAY"))
      return (
        <div className={value > 0 ? "text-red-600" : "text-green-600"}>
          {value > 0 ? `+${value.toFixed(0)} min` : `${value.toFixed(0)} min`}
        </div>
      )
    },
  },
  {
    accessorKey: "AIR_TIME",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Air Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("AIR_TIME"))
      return <div>{value.toFixed(0)} min</div>
    },
  },
  {
    accessorKey: "DISTANCE",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("DISTANCE"))
      return <div>{value.toFixed(0)} miles</div>
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const depDelay = Number.parseFloat(row.getValue("DEP_DELAY"))
      const arrDelay = Number.parseFloat(row.getValue("ARR_DELAY"))

      if (depDelay > 30 || arrDelay > 30) {
        return <Badge variant="destructive">Delayed</Badge>
      } else if (depDelay > 15 || arrDelay > 15) {
        return (
          <Badge variant="warning" className="bg-orange-500">
            Late
          </Badge>
        )
      } else {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            On Time
          </Badge>
        )
      }
    },
  },
]

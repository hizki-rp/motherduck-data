"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface ResponsiveChartProps {
  children: React.ReactNode
  aspectRatio?: number
  minHeight?: number
  className?: string
}

export function ResponsiveChart({ children, aspectRatio = 2, minHeight = 300, className }: ResponsiveChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton className={`w-full h-[${minHeight}px] rounded-md`} />
  }

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out ${className}`}
      style={{
        minHeight: `${minHeight}px`,
        height: `calc(100vw / ${aspectRatio})`,
        maxHeight: `${minHeight * 2}px`,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

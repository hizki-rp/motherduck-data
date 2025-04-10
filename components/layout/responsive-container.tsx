"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  breakpoint?: "sm" | "md" | "lg"
}

export function ResponsiveContainer({ children, className, breakpoint = "md", ...props }: ResponsiveContainerProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      if (breakpoint === "sm") {
        setIsMobile(window.innerWidth < 640)
      } else if (breakpoint === "md") {
        setIsMobile(window.innerWidth < 768)
      } else {
        setIsMobile(window.innerWidth < 1024)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [breakpoint])

  return (
    <div
      className={cn("transition-all duration-300 ease-in-out", isMobile ? "mobile-view" : "desktop-view", className)}
      data-mobile={isMobile}
      {...props}
    >
      {children}
    </div>
  )
}

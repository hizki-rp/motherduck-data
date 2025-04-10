"use client"

import { useState } from "react"
import { Menu, X, BarChart2, Cloud, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)

  const tabs = [
    { id: "weather", label: "Weather Data", icon: Cloud },
    { id: "flights", label: "Flight Data", icon: BarChart2 },
    { id: "house-prices", label: "House Prices", icon: Home },
  ]

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h2 className="text-xl font-bold tracking-tight">MotherDuck Dashboard</h2>
        </div>

        <div className="flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">MotherDuck Dashboard</h2>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => handleTabChange(tab.id)}
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        {tab.label}
                      </Button>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-bold tracking-tight">
            {tabs.find((tab) => tab.id === activeTab)?.label || "MotherDuck Dashboard"}
          </h2>
        </div>

        <div className="hidden md:flex items-center space-x-1 ml-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="h-9"
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        <div className="ml-auto md:hidden">
          <div className="text-xs text-muted-foreground">MotherDuck Data</div>
        </div>
      </div>
    </header>
  )
}

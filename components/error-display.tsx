"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  title: string
  message: string
  retry?: () => void
}

export function ErrorDisplay({ title, message, retry }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">{message}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="mt-2">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

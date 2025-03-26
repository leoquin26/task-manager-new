"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface SimpleDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export function SimpleDatePicker({ date, onDateChange }: SimpleDatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close calendar when clicking outside
  React.useEffect(() => {
    if (!isCalendarOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false)
      }
    }

    // Add event listener with capture to handle the event before it reaches other handlers
    document.addEventListener("mousedown", handleClickOutside, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isCalendarOpen])

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    onDateChange(newDate)
    setIsCalendarOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsCalendarOpen(!isCalendarOpen)
        }}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
      </Button>

      {isCalendarOpen && (
        <div
          className="absolute z-50 mt-1 bg-background border rounded-md shadow-md p-2"
          onClick={(e) => {
            // Prevent clicks from propagating to parent elements
            e.stopPropagation()
          }}
        >
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
        </div>
      )}
    </div>
  )
}


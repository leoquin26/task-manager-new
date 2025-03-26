"use client"

import * as React from "react"
import { createPortal } from "react-dom" // Import createPortal from react-dom
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface ModalSafeDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function ModalSafeDatePicker({ date, setDate }: ModalSafeDatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  // Calculate position when calendar opens
  React.useEffect(() => {
    if (isCalendarOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }
  }, [isCalendarOpen])

  // Handle clicks outside the calendar
  React.useEffect(() => {
    if (!isCalendarOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }

    // Use capture phase to handle the event before it reaches other handlers
    document.addEventListener("mousedown", handleClickOutside, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isCalendarOpen])

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setIsCalendarOpen(false)
  }

  // Create portal for calendar
  const CalendarPortal = () => {
    if (!isCalendarOpen || typeof document === "undefined") return null

    // Use createPortal from react-dom
    return createPortal(
      <div
        ref={calendarRef}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 9999,
          background: "var(--background)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          padding: "8px",
        }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus className="rounded-md" />
      </div>,
      document.body,
    )
  }

  return (
    <>
      <Button
        ref={buttonRef}
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

      <CalendarPortal />
    </>
  )
}
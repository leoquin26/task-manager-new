"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SimpleDatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
}

export function SimpleDatePicker({ date, onDateChange }: SimpleDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    onDateChange(newDate)
    setOpen(false)
  }

  // Prevent event propagation to parent modal
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  // Function to disable dates before today
  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          onClick={(e) => {
            // Prevent event from bubbling up to parent modal
            e.stopPropagation()
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onClick={(e) => {
          // Prevent event from bubbling up to parent modal
          e.stopPropagation()
        }}
      >
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus disabled={disablePastDates} />
      </PopoverContent>
    </Popover>
  )
}


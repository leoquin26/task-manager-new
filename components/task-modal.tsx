"use client"

import * as React from "react"
import { X } from "lucide-react"
import { SimpleDatePicker } from "./ui/simple-date-picker"
import { type Task, TaskCategory, TaskPriority } from "@/lib/types"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
}

export function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  // State for form fields
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [dueDate, setDueDate] = React.useState<Date>(new Date())
  const [category, setCategory] = React.useState<TaskCategory>(TaskCategory.PERSONAL)
  const [priority, setPriority] = React.useState<TaskPriority>(TaskPriority.MEDIUM)

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setDueDate(new Date())
      setCategory(TaskCategory.PERSONAL)
      setPriority(TaskPriority.MEDIUM)

      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden"
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = ""
    }

    // Cleanup function to ensure body scroll is re-enabled
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTask: Task = {
      id: "",
      title,
      description,
      dueDate: dueDate.toISOString(),
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    onSave(newTask)
  }

  // If modal is not open, don't render anything
  if (!isOpen) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50"
      style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Add new Task</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Task title"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Task description (optional)"
              />
            </div>

            {/* Due Date and Category Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date Field */}
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium">
                  Date limit
                </label>
                <SimpleDatePicker date={dueDate} onDateChange={(date) => date && setDueDate(date)} />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(TaskCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Field */}
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(TaskPriority).map((pri) => (
                    <option key={pri} value={pri}>
                      {pri}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  )
}


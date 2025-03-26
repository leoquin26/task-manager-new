"use client"

import * as React from "react"
import { X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type Task, TaskCategory, TaskPriority } from "@/lib/types"
import { SimpleDatePicker } from "@/components/ui/simple-date-picker"

interface TaskEditDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Task) => void
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  dueDate: z.date({ required_error: "Due date is required" }),
  category: z.enum(Object.values(TaskCategory) as [string, ...string[]], {
    required_error: "Category is required",
  }),
  priority: z.enum(Object.values(TaskPriority) as [string, ...string[]], {
    required_error: "Priority is required",
  }),
})

export function TaskEditDialog({ task, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      dueDate: new Date(task.dueDate),
      category: task.category,
      priority: task.priority,
    },
  })

  React.useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description || "",
      dueDate: new Date(task.dueDate),
      category: task.category,
      priority: task.priority,
    })

    // Disable body scroll when modal is open
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    // Cleanup function to ensure body scroll is re-enabled
    return () => {
      document.body.style.overflow = ""
    }
  }, [task, form, open])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedTask: Task = {
      ...task,
      title: values.title,
      description: values.description || "",
      dueDate: values.dueDate.toISOString(),
      category: values.category,
      priority: values.priority,
    }
    onSave(updatedTask)
    onOpenChange(false)
  }

  const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
  }

  if (!open) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50"
      style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col"
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Edit task</h2>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <form id="edit-task-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                {...form.register("title")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Task title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                {...form.register("description")}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Task description (optional)"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium">
                  Date limit
                </label>
                <SimpleDatePicker
                  date={form.watch("dueDate")}
                  onDateChange={(date) => form.setValue("dueDate", date || new Date(), { shouldValidate: true })}
                />
                {form.formState.errors.dueDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  {...form.register("category")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(TaskCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  {...form.register("priority")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.values(TaskPriority).map((pri) => (
                    <option key={pri} value={pri}>
                      {pri}
                    </option>
                  ))}
                </select>
                {form.formState.errors.priority && (
                  <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="border-t p-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-task-form"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}


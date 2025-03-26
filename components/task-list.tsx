"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { Task } from "@/lib/types"
import { TaskCard } from "@/components/task-card"
import { TaskEditDialog } from "@/components/task-edit-dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onToggleComplete, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={() => setEditingTask(task)}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSave={(updatedTask) => {
            onUpdateTask(updatedTask)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}


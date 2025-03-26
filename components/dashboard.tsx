"use client"

import { useState, useMemo } from "react"
import { TaskList } from "@/components/task-list"
import { TaskModal } from "./task-modal"
import { TaskStats } from "@/components/task-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { TaskPriority } from "@/lib/types"
import { initialTasks } from "@/lib/data"
import { toast } from "sonner" // Import toast from sonner
import { Plus } from "lucide-react"

const getPriorityValue = (priority: TaskPriority): number => {
  switch (priority) {
    case TaskPriority.URGENT:
      return 0
    case TaskPriority.HIGH:
      return 1
    case TaskPriority.MEDIUM:
      return 2
    case TaskPriority.LOW:
      return 3
    default:
      return 4
  }
}

const sortTasksByDateAndPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)

    dateA.setHours(0, 0, 0, 0)
    dateB.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffA = Math.floor((dateA.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const diffB = Math.floor((dateB.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffA !== diffB) {
      return diffA - diffB
    }

    return getPriorityValue(a.priority) - getPriorityValue(b.priority)
  })
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const addTask = (task: Task) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }])
    toast.message("Task added", {
      description: "Your task has been successfully added.",
      duration: 1500,
    })
    setIsModalOpen(false)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast.message("Task updated", {
      description: "Your task has been successfully updated.",
      duration: 1500,
    })
  }

  const isValidTask = (task: any): task is Task => {
    return (
      task &&
      typeof task === "object" &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.dueDate === "string" &&
      typeof task.category === "string" &&
      typeof task.priority === "string" &&
      typeof task.completed === "boolean"
    )
  }

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) {
      console.error("Task not found for deletion:", id)
      return
    }

    const taskCopy = {
      id: taskToDelete.id,
      title: taskToDelete.title,
      description: taskToDelete.description,
      dueDate: taskToDelete.dueDate,
      category: taskToDelete.category,
      priority: taskToDelete.priority,
      completed: taskToDelete.completed,
      createdAt: taskToDelete.createdAt,
    }

    console.log("Deleting task:", taskCopy)

    setTasks(tasks.filter((task) => task.id !== id))

    // Use sonner's toast with action
    toast.message("Task deleted", {
      description: "Your task has been removed.",
      duration: 3000,
      action: {
        label: "Undo",
        onClick: () => {
          if (isValidTask(taskCopy)) {
            setTasks((prevTasks) => [...prevTasks, taskCopy])
            toast.message("Task restored", {
              description: "Your task has been restored successfully.",
              duration: 1500,
            })
          } else {
            toast.error("Restore failed", {
              description: "Could not restore the task due to missing data.",
              duration: 1500,
            })
          }
        },
      },
    })
  }

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus = !task.completed
          toast.message(newStatus ? "Task completed" : "Task reopened", {
            description: newStatus ? "Your task has been marked as complete." : "Your task has been reopened.",
            duration: 1500,
          })
          return { ...task, completed: newStatus }
        }
        return task
      }),
    )
  }

  const sortedAllTasks = useMemo(() => {
    return sortTasksByDateAndPriority(tasks)
  }, [tasks])

  const filteredTodayTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (!task || !task.dueDate) return false
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const taskDate = new Date(task.dueDate)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime()
      } catch (error) {
        console.error("Error filtering today's tasks:", error)
        return false
      }
    })
    return sortTasksByDateAndPriority(filtered)
  }, [tasks])

  const filteredUpcomingTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (!task || !task.dueDate || task.completed) return false
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const taskDate = new Date(task.dueDate)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() > today.getTime()
      } catch (error) {
        console.error("Error filtering upcoming tasks:", error)
        return false
      }
    })
    return sortTasksByDateAndPriority(filtered)
  }, [tasks])

  const filteredCompletedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => task && task.completed)
    return sortTasksByDateAndPriority(filtered)
  }, [tasks])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="py-6">
        <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
        <p className="text-muted-foreground">Organize, prioritize, and track your tasks</p>
      </header>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 w-full md:w-auto">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />

      <div className="space-y-6 mt-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TaskList
              tasks={sortedAllTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <TaskList
              tasks={filteredTodayTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <TaskList
              tasks={filteredUpcomingTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <TaskList
              tasks={filteredCompletedTasks}
              onToggleComplete={toggleComplete}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>
        </Tabs>
      </div>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addTask} />
    </div>
  )
}
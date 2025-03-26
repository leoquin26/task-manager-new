"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from "lucide-react"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task && task.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueToday = tasks.filter((task) => {
      if (!task || !task.dueDate) return false
      try {
        const taskDate = new Date(task.dueDate)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime() && !task.completed
      } catch (error) {
        return false
      }
    }).length

    const overdue = tasks.filter((task) => {
      if (!task || !task.dueDate || task.completed) return false
      try {
        const taskDate = new Date(task.dueDate)
        taskDate.setHours(0, 0, 0, 0)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        return taskDate < currentDate
      } catch (error) {
        console.error("Error checking if task is overdue:", error)
        return false
      }
    }).length

    return { total, completed, pending, completionRate, dueToday, overdue }
  }, [tasks])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1"
    >
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <ListTodo className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Total Tasks</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>

            <div className="col-span-2 sm:col-span-4 space-y-1.5 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>

            {stats.dueToday > 0 && (
              <div className="col-span-2 sm:col-span-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                <p className="text-sm text-amber-800">
                  You have <strong>{stats.dueToday}</strong> task{stats.dueToday !== 1 ? "s" : ""} due today
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
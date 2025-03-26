import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TaskCategory, TaskPriority } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryColor(category: TaskCategory): string {
  switch (category) {
    case TaskCategory.PERSONAL:
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    case TaskCategory.WORK:
      return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    case TaskCategory.HEALTH:
      return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    case TaskCategory.EDUCATION:
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case TaskCategory.FINANCE:
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    case TaskCategory.HOME:
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    case TaskCategory.OTHER:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.LOW:
      return "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
    case TaskPriority.MEDIUM:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    case TaskPriority.HIGH:
      return "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    case TaskPriority.URGENT:
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    default:
      return "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
  }
}
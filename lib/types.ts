export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  category: TaskCategory
  priority: TaskPriority
  completed: boolean
  createdAt: string
}

export enum TaskCategory {
  PERSONAL = "Personal",
  WORK = "Work",
  HEALTH = "Health",
  EDUCATION = "Education",
  FINANCE = "Finance",
  HOME = "Home",
  OTHER = "Other",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}


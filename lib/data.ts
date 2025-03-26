import { type Task, TaskCategory, TaskPriority } from "./types"

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Finish the draft and send it to the team for review",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    category: TaskCategory.WORK,
    priority: TaskPriority.HIGH,
    completed: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "2",
    title: "Schedule doctor appointment",
    description: "Annual checkup with Dr. Smith",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    category: TaskCategory.HEALTH,
    priority: TaskPriority.MEDIUM,
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "3",
    title: "Buy groceries",
    description: "Milk, eggs, bread, fruits, and vegetables",
    dueDate: new Date(Date.now()).toISOString(), // Today
    category: TaskCategory.HOME,
    priority: TaskPriority.LOW,
    completed: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "4",
    title: "Prepare presentation",
    description: "Create slides for the quarterly meeting",
    dueDate: new Date(Date.now()).toISOString(), // Today
    category: TaskCategory.WORK,
    priority: TaskPriority.URGENT,
    completed: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "5",
    title: "Pay utility bills",
    description: "Electricity, water, and internet bills",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    category: TaskCategory.FINANCE,
    priority: TaskPriority.MEDIUM,
    completed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
]
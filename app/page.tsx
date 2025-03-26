import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "TaskFlow - Organize Your Tasks",
  description: "A simple task management application to help you organize and prioritize your tasks",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  )
}


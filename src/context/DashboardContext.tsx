"use client"

import React, { createContext, useContext, useState } from "react"

export interface Project {
  id: string
  title: string
  description: string
  status: string
  progress: number
  teamMembers: string[]
}

export interface TeamMember {
  id: string
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: Date | undefined
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  dateline: Date | undefined
}

interface DashboardContextType {
  projects: Project[]
  team: TeamMember[]
  tasks: Task[]
  addProject: (p: Omit<Project, "id">) => void
  deleteProject: (id: string) => void
  addMember: (m: Omit<TeamMember, "id">) => void
  deleteMember: (id: string) => void
  addTask: (t: Omit<Task, "id">) => void
  deleteTask: (id: string) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", status: "En progreso", progress: 65, teamMembers: ["m1"] },
    { id: "p2", title: "Mobile App", description: "Aplicación móvil con React Native", status: "En revisión", progress: 90, teamMembers: ["m2"] }
  ])

  const [team, setTeam] = useState<TeamMember[]>([
    { id: "m1", userId: "USR001", name: "María García", role: "Admin", email: "maria@example.com", position: "Frontend Dev", birthdate: new Date(1995, 4, 12), phone: "999888777", projectId: "p1", isActive: true },
    { id: "m2", userId: "USR002", name: "Juan Pérez", role: "Member", email: "juan@example.com", position: "Backend Dev", birthdate: new Date(1992, 8, 23), phone: "999111222", projectId: "p2", isActive: true }
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", description: "Diseño de la Base de Datos", projectId: "p1", status: "Completada", priority: "Alta", userId: "m1", dateline: new Date() },
    { id: "t2", description: "Configurar API Gateway", projectId: "p2", status: "En progreso", priority: "Media", userId: "m2", dateline: new Date() }
  ])

  const addProject = (p: Omit<Project, "id">) => setProjects([...projects, { ...p, id: `p_${Date.now()}` }])
  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
    setTasks(tasks.filter(t => t.projectId !== id))
  }

  const addMember = (m: Omit<TeamMember, "id">) => setTeam([...team, { ...m, id: `m_${Date.now()}` }])
  const deleteMember = (id: string) => setTeam(team.filter(m => m.id !== id))

  const addTask = (t: Omit<Task, "id">) => setTasks([...tasks, { ...t, id: `t_${Date.now()}` }])
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id))

  return (
    <DashboardContext.Provider value={{ projects, team, tasks, addProject, deleteProject, addMember, deleteMember, addTask, deleteTask }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return context
}
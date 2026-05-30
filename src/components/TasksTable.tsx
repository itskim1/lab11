"use client"

import { useState } from "react"
import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function TasksTable() {
  const { tasks, projects, team, addTask, deleteTask } = useDashboard()
  
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState("")
  const [status, setStatus] = useState("Pendiente")
  const [priority, setPriority] = useState("Media")
  const [userId, setUserId] = useState("")
  const [dateline, setDateline] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(tasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTasks = tasks.slice(startIndex, startIndex + itemsPerPage)

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !projectId || !userId) return
    addTask({ description, projectId, status, priority, userId, dateline })
    setDescription("")
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">Muestra las tareas registradas de manera paginada.</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Nueva Tarea</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Crear Tarea</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <Label>Descripción</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div>
                <Label>Proyecto</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger><SelectValue placeholder="Selecciona proyecto" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Prioridad</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Asignado A</Label>
                  <Select value={userId} onValueChange={setUserId}>
                    <SelectTrigger><SelectValue placeholder="Miembro" /></SelectTrigger>
                    <SelectContent>
                      {team.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Fecha Límite (Calendar Component)</Label>
                <div className="border rounded-md p-1 flex justify-center bg-slate-50">
                  <Calendar mode="single" selected={dateline} onSelect={setDateline} className="rounded-md" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">Crear Tarea</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b">
            <tr>
              <th className="p-3">Descripción</th>
              <th className="p-3">Proyecto</th>
              <th className="p-3">Prioridad</th>
              <th className="p-3">Asignado</th>
              <th className="p-3">Fecha Límite</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.length === 0 ? (
              <tr><td colSpan={6} className="p-3 text-center text-slate-400">No hay tareas registradas.</td></tr>
            ) : (
              paginatedTasks.map(task => {
                const proj = projects.find(p => p.id === task.projectId)
                const member = team.find(m => m.id === task.userId)
                return (
                  <tr key={task.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium">{task.description}</td>
                    <td className="p-3">{proj ? proj.title : "N/A"}</td>
                    <td className="p-3">{task.priority}</td>
                    <td className="p-3">{member ? member.name : "N/A"}</td>
                    <td className="p-3">{task.dateline ? new Date(task.dateline).toLocaleDateString() : "-"}</td>
                    <td className="p-3 text-right">
                      <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>Eliminar</Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if(currentPage > 1) setCurrentPage(currentPage - 1) }} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink href="#" isActive={currentPage === idx + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(idx + 1) }}>
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) setCurrentPage(currentPage + 1) }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
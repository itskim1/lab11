"use client"

import { useState } from "react"

// Importaciones relativas directas apuntando a tu estructura interna
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/components/ui/tabs"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/badge"
import { Avatar, AvatarFallback } from "../../src/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../src/components/ui/dialog"
import { Input } from "../../src/components/ui/input"
import { Label } from "../../src/components/ui/label"

import { ProjectForm } from "../../src/components/ProjectForm"
import { TasksTable } from "../../src/components/TasksTable"
import { SettingsForm } from "../../src/components/SettingsForm"
import { DashboardProvider, useDashboard } from "../../src/context/DashboardContext"

function DashboardContent() {
  const { projects, team, tasks, deleteProject, addMember, deleteMember } = useDashboard()

  const [mName, setMName] = useState("")
  const [mEmail, setMEmail] = useState("")
  const [mRole, setMRole] = useState("Member")
  const [mPosition, setMPosition] = useState("Developer")
  const [mUserId, setMUserId] = useState("")
  const [mPhone, setMPhone] = useState("")
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
  const [isProjDialogOpen, setIsProjDialogOpen] = useState(false)
  const [selectedProj, setSelectedProj] = useState<any>(null)

  const totalProjects = projects.length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === "Completada").length
  const activeMembers = team.filter(m => m.isActive).length

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mName || !mEmail || !mUserId) return
    addMember({
      userId: mUserId,
      name: mName,
      email: mEmail,
      role: mRole,
      position: mPosition,
      birthdate: new Date(1998, 5, 15),
      phone: mPhone,
      projectId: projects[0]?.id || "",
      isActive: true
    })
    setMName("")
    setMEmail("")
    setMUserId("")
    setMPhone("")
    setIsMemberDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard de Gestión</h1>
            <p className="text-slate-500 mt-1">Administración de flujos de trabajo en memoria global.</p>
          </div>
          <Dialog open={isProjDialogOpen} onOpenChange={setIsProjDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                + Crear Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <ProjectForm onSuccess={() => setIsProjDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white border p-1 rounded-lg shadow-sm">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Menú: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Proyectos</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">Métrica reactiva en vivo</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Tareas en Sistema</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-indigo-600">{completedTasks} completadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Porcentaje de Éxito</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "0%"}</div>
                  <p className="text-xs text-muted-foreground">Tareas hechas del total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Miembros Activos</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeMembers}</div>
                  <p className="text-xs text-muted-foreground">Colaboradores de alta</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menú: Proyectos */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col justify-between shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold">{project.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-t pt-3">
                      <span className="text-slate-500">Miembros en ID:</span>
                      <span className="font-medium text-slate-700">{project.teamMembers.join(", ") || "Ninguno"}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedProj(project)}>Ver Detalles</Button>
                        </DialogTrigger>
                        {selectedProj && (
                          <DialogContent>
                            <DialogHeader><DialogTitle>{selectedProj.title}</DialogTitle></DialogHeader>
                            <div className="space-y-2 text-sm pt-2">
                              <p><strong>Descripción Completa:</strong> {selectedProj.description}</p>
                              <p><strong>Estado del Flujo:</strong> {selectedProj.status}</p>
                              <p><strong>IDs del Equipo Asignados:</strong> {selectedProj.teamMembers.join(', ') || "Ninguno"}</p>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>Eliminar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Menú: Tareas */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listado Operativo de Tareas</CardTitle>
                <CardDescription>Control de fechas límites y prioridades con paginación integrada.</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menú: Equipo */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center space-y-0">
                <div>
                  <CardTitle>Gestión del Personal (CRUD)</CardTitle>
                  <CardDescription>Registro completo de colaboradores en el sistema.</CardDescription>
                </div>
                <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Añadir Miembro</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Registrar Colaborador</DialogTitle></DialogHeader>
                    <form onSubmit={handleCreateMember} className="space-y-3 text-sm">
                      <div><Label>ID de Usuario (userId)</Label><Input value={mUserId} onChange={e=>setMUserId(e.target.value)} placeholder="USR003" required /></div>
                      <div><Label>Nombre Completo</Label><Input value={mName} onChange={e=>setMName(e.target.value)} placeholder="Ej. Carlos Mendoza" required /></div>
                      <div><Label>Correo Electrónico</Label><Input type="email" value={mEmail} onChange={e=>setMEmail(e.target.value)} placeholder="carlos@example.com" required /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Rol en App</Label><Input value={mRole} onChange={e=>setMRole(e.target.value)} placeholder="Member / Admin" /></div>
                        <div><Label>Posición / Cargo</Label><Input value={mPosition} onChange={e=>setMPosition(e.target.value)} placeholder="QA Engineer" /></div>
                      </div>
                      <div><Label>Teléfono</Label><Input value={mPhone} onChange={e=>setMPhone(e.target.value)} placeholder="999444555" /></div>
                      <Button type="submit" className="w-full mt-2">Dar de Alta</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-3">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-xs">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback>{member.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name} <span className="text-xs text-slate-400 font-normal">({member.userId})</span></p>
                        <p className="text-xs text-slate-500">{member.position} • {member.email} • Tel: {member.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{member.role}</Badge>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteMember(member.id)}>Eliminar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menú: Configuración */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Global del Dashboard</CardTitle>
                <CardDescription>Simulación de variables críticas del entorno local.</CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
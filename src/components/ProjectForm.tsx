"use client"

import { useState } from "react"
import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addProject, team } = useDashboard()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Planificado")
  const [selectedMember, setSelectedMember] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title || !description) {
      setError("Por favor, completa todos los campos requeridos (*).")
      return
    }

    loading || setLoading(true)
    setTimeout(() => {
      addProject({
        title,
        description,
        status,
        progress: 0,
        teamMembers: selectedMember ? [selectedMember] : []
      })
      setTitle("")
      setDescription("")
      setSelectedMember("")
      setLoading(false)
      if (onSuccess) onSuccess()
    }, 1200) 
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-1">
        <h3 className="text-lg font-bold">Crear Nuevo Proyecto</h3>
        <p className="text-sm text-muted-foreground">Introduce los parámetros operacionales del proyecto.</p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error de validación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="title">Título del Proyecto *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Sistema de Inventario" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="desc">Descripción *</Label>
        <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve resumen del alcance..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Estado Inicial</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Planificado">Planificado</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="En revisión">En revisión</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Miembro de Equipo</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger><SelectValue placeholder="Asignar miembro" /></SelectTrigger>
            <SelectContent>
              {team.map(m => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {loading ? "Guardando..." : "Guardar Proyecto"}
      </Button>
    </form>
  )
}
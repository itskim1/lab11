"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"

export function SettingsForm() {
  const [webhook, setWebhook] = useState("https://api.github.com/webhooks")
  const [notify, setNotify] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-4 max-w-md">
      {saved && (
        <Alert className="border-emerald-500 bg-emerald-50 text-emerald-900">
          <AlertDescription>⚙️ Configuraciones de entorno simuladas con éxito en el caché local.</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label>URL del Endpoint del Servidor</Label>
        <Input value={webhook} onChange={e => setWebhook(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <input type="checkbox" id="notify" checked={notify} onChange={e => setNotify(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
        <Label htmlFor="notify" className="cursor-pointer">Enviar reportes automáticos al correo del administrador</Label>
      </div>
      <Button onClick={handleSave}>Guardar Preferencias</Button>
    </div>
  )
}
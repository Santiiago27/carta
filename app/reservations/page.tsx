"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Users, MessageCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReservationsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    specialRequests: "",
  })

  const occasions = [
    { value: "birthday", label: "🎂 Cumpleaños" },
    { value: "anniversary", label: "💕 Aniversario" },
    { value: "celebration", label: "🎉 Celebración" },
    { value: "business", label: "💼 Reunión de Negocios" },
    { value: "family", label: "👨‍👩‍👧‍👦 Reunión Familiar" },
    { value: "date", label: "💑 Cita Romántica" },
    { value: "other", label: "🍽️ Cena Casual" },
  ]

  const timeSlots = [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerPhone || !formData.date || !formData.time || !formData.guests) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const reservationMessage = `
🍽️ *NUEVA RESERVA - THE CONTAINER BURGER*

👤 *Cliente:* ${formData.customerName}
📱 *Teléfono:* ${formData.customerPhone}

📅 *Fecha:* ${new Date(formData.date).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
🕐 *Hora:* ${formData.time}
👥 *Número de personas:* ${formData.guests}

🎉 *Ocasión:* ${occasions.find((o) => o.value === formData.occasion)?.label || "Cena casual"}

${
  formData.specialRequests
    ? `📝 *Solicitudes especiales:*
${formData.specialRequests}`
    : ""
}

*Por favor confirma la disponibilidad de esta reserva* ✅

¡Esperamos verte pronto! 🍔
  `.trim()

    // Guardar reserva en localStorage
    const existingReservations = JSON.parse(localStorage.getItem("reservations") || "[]")
    const newReservation = {
      id: Date.now(),
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    existingReservations.push(newReservation)
    localStorage.setItem("reservations", JSON.stringify(existingReservations))

    // Abrir WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573202466440&text=${encodeURIComponent(reservationMessage)}`
    window.open(whatsappUrl, "_blank")

    alert("¡Reserva enviada! Te contactaremos pronto para confirmar.")
    router.push("/")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Sistema
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Reserva tu Mesa</h1>
          <p className="text-white/90 text-lg">¡Asegura tu lugar para una experiencia inolvidable!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl text-orange-600 flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              Información de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerName">Nombre Completo *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Teléfono *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="Ej: 3201234567"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Hora *</Label>
                  <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="guests">Número de Personas *</Label>
                  <Select value={formData.guests} onValueChange={(value) => handleInputChange("guests", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="¿Cuántas personas?" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {num} {num === 1 ? "persona" : "personas"}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="occasion">Ocasión</Label>
                  <Select value={formData.occasion} onValueChange={(value) => handleInputChange("occasion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="¿Qué celebras?" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasions.map((occasion) => (
                        <SelectItem key={occasion.value} value={occasion.value}>
                          {occasion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="¿Alguna solicitud especial? (decoración, pastel, alergias, etc.)"
                  rows={4}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-1">Información Importante</h3>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Las reservas deben confirmarse con al menos 2 horas de anticipación</li>
                      <li>• Para grupos de más de 8 personas, contacta directamente</li>
                      <li>• Las mesas se reservan por máximo 2 horas</li>
                      <li>• Confirmaremos tu reserva por WhatsApp</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3">
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar Reserva por WhatsApp
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            ¿Necesitas ayuda con tu reserva?
            <br />
            Contacta directamente: <strong>+57 320 246 6440</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

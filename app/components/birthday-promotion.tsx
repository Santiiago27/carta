"use client"

import type React from "react"

import { useState } from "react"
import { Gift, Calendar, BadgeIcon as IdCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface BirthdayPromotionProps {
  isOpen: boolean
  onClose: () => void
}

export default function BirthdayPromotion({ isOpen, onClose }: BirthdayPromotionProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    idNumber: "",
    birthDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerData.name || !customerData.phone || !customerData.idNumber || !customerData.birthDate) {
      alert("Por favor completa todos los campos")
      return
    }

    // Verificar si es el cumpleaños (mismo día y mes)
    const today = new Date()
    const birthDate = new Date(customerData.birthDate)

    const isBirthday = today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()

    if (!isBirthday) {
      alert("Esta promoción solo es válida el día de tu cumpleaños 🎂")
      return
    }

    const birthdayMessage = `
🎂 *¡PROMOCIÓN CUMPLEAÑOS!*
*The Container BURGER*
  `.trim()

    // Abrir WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573202466440&text=${encodeURIComponent(birthdayMessage)}`
    window.open(whatsappUrl, "_blank")

    alert("¡Feliz cumpleaños! 🎂 Hemos enviado tu solicitud. Presenta tu cédula en el restaurante.")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
            <Gift className="h-8 w-8" />
            ¡PROMOCIÓN CUMPLEAÑOS!
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-orange-300">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">🎂</div>
              <h2 className="text-xl font-bold text-orange-800 mb-2">¡COMBO GRATIS!</h2>
              <div className="bg-white/80 p-4 rounded-lg border-2 border-dashed border-orange-400">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Hamburguesa Clásica</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Papas Francesas</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Gaseosa</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  placeholder="Como aparece en tu cédula"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  placeholder="3201234567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="idNumber">Número de Cédula</Label>
                <Input
                  id="idNumber"
                  value={customerData.idNumber}
                  onChange={(e) => setCustomerData({ ...customerData, idNumber: e.target.value })}
                  placeholder="12345678"
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={customerData.birthDate}
                  onChange={(e) => setCustomerData({ ...customerData, birthDate: e.target.value })}
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <IdCard className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div className="text-xs text-blue-700">
                    <p className="font-semibold mb-1">Términos y Condiciones:</p>
                    <ul className="space-y-1">
                      <li>• Solo válido el día de tu cumpleaños</li>
                      <li>• Debes presentar cédula original</li>
                      <li>• Una promoción por persona</li>
                      <li>• No acumulable con otras ofertas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3"
              >
                <Calendar className="mr-2 h-5 w-5" />
                ¡Reclamar Mi Combo Gratis!
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

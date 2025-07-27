"use client"

import { useState } from "react"
import { MapPin, Utensils, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface OrderTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (orderData: OrderData) => void
}

export interface OrderData {
  type: "delivery" | "pickup" | "dine-in"
  customerName: string
  customerPhone: string
  address?: string
  addressDetails?: string
  tableNumber?: string
  notes?: string
}

export default function OrderTypeModal({ isOpen, onClose, onConfirm }: OrderTypeModalProps) {
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | "dine-in">("delivery")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [address, setAddress] = useState("")
  const [addressDetails, setAddressDetails] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")

  const handleConfirm = () => {
    if (!customerName || !customerPhone) {
      alert("Por favor completa el nombre y teléfono")
      return
    }

    if (orderType === "delivery" && !address) {
      alert("Por favor ingresa la dirección de entrega")
      return
    }

    const orderData: OrderData = {
      type: orderType,
      customerName,
      customerPhone,
      address: orderType === "delivery" ? address : undefined,
      addressDetails: orderType === "delivery" ? addressDetails : undefined,
      tableNumber: orderType === "dine-in" ? tableNumber : undefined,
      notes,
    }

    onConfirm(orderData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-orange-600">¿Cómo quieres tu pedido?</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Type Selection */}
          <RadioGroup value={orderType} onValueChange={(value: any) => setOrderType(value)}>
            <div className="grid gap-3">
              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-orange-50">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center cursor-pointer flex-1">
                  <Truck className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Domicilio</p>
                    <p className="text-sm text-gray-500">Entrega a tu dirección</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-orange-50">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex items-center cursor-pointer flex-1">
                  <MapPin className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Recoger</p>
                    <p className="text-sm text-gray-500">Recoges en el restaurante</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-orange-50">
                <RadioGroupItem value="dine-in" id="dine-in" />
                <Label htmlFor="dine-in" className="flex items-center cursor-pointer flex-1">
                  <Utensils className="mr-3 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Comer aquí</p>
                    <p className="text-sm text-gray-500">Consumir en el restaurante</p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* Customer Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Nombre completo *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Teléfono *</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej: 3201234567"
              />
            </div>

            {/* Delivery Address */}
            {orderType === "delivery" && (
              <>
                <div>
                  <Label htmlFor="address">Dirección de entrega *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, carrera, número"
                  />
                </div>

                <div>
                  <Label htmlFor="addressDetails">Detalles de la dirección</Label>
                  <Input
                    id="addressDetails"
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="Apartamento, casa, piso, referencias"
                  />
                </div>
              </>
            )}

            {/* Table Number for Dine-in */}
            {orderType === "dine-in" && (
              <div>
                <Label htmlFor="tableNumber">Número de mesa</Label>
                <Input
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ej: Mesa 5"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones especiales, alergias, etc."
                rows={3}
              />
            </div>
          </div>

          <Button onClick={handleConfirm} className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3">
            Continuar con el Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

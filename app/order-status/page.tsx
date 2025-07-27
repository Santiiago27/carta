"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Clock, CheckCircle, Truck, MapPin, Utensils, Package, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: number
  invoiceNumber: string
  date: string
  customer: any
  items: any[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  paymentMethod: string
  orderType: "delivery" | "pickup" | "dine-in"
  status: "pending" | "preparing" | "ready" | "completed"
}

export default function OrderStatusPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [foundOrder, setFoundOrder] = useState<Order | null>(null)
  const [searchError, setSearchError] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente de Confirmación"
      case "preparing":
        return "Preparando tu Pedido"
      case "ready":
        return "¡Listo para Entregar!"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "preparing":
        return Package
      case "ready":
        return CheckCircle
      case "completed":
        return CheckCircle
      default:
        return Clock
    }
  }

  const getStatusDescription = (status: string, orderType: string) => {
    switch (status) {
      case "pending":
        return "Tu pedido está registrado y esperando confirmación de pago."
      case "preparing":
        return "¡Genial! Tu pedido está siendo preparado con mucho cuidado."
      case "ready":
        return orderType === "delivery"
          ? "Tu pedido está listo y en camino a tu dirección."
          : orderType === "pickup"
            ? "Tu pedido está listo para recoger en el restaurante."
            : "Tu pedido está listo y te está esperando en tu mesa."
      case "completed":
        return "Tu pedido ha sido completado. ¡Esperamos que lo hayas disfrutado!"
      default:
        return "Estado del pedido no disponible."
    }
  }

  const openDinoGame = () => {
    window.open("/dino-game", "_blank")
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError("Por favor ingresa un número de pedido o teléfono")
      return
    }

    const savedOrders = localStorage.getItem("sales")
    if (!savedOrders) {
      setSearchError("No se encontraron pedidos")
      setFoundOrder(null)
      return
    }

    try {
      const orders: Order[] = JSON.parse(savedOrders)
      const order = orders.find(
        (o) =>
          o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.customerPhone.includes(searchQuery) ||
          o.id.toString() === searchQuery,
      )

      if (order) {
        setFoundOrder(order)
        setSearchError("")
      } else {
        setFoundOrder(null)
        setSearchError("No se encontró ningún pedido con esa información")
      }
    } catch (error) {
      setSearchError("Error al buscar el pedido")
      setFoundOrder(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Sistema
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Consulta tu Pedido</h1>
          <p className="text-white/90 text-lg">Ingresa tu número de pedido o teléfono para ver el estado</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-xl text-orange-600">Buscar Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Número de Pedido o Teléfono</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="search"
                  placeholder="Ej: TCB-1234567890 o 3201234567"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                  onClick={openDinoGame}
                  title="🎮 Jugar mientras esperas"
                >
                  <Gamepad2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-center">{searchError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {foundOrder && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-orange-600">Pedido #{foundOrder.invoiceNumber}</CardTitle>
                <Badge className={`${getStatusColor(foundOrder.status)} text-white text-sm px-3 py-1`}>
                  {getStatusText(foundOrder.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Timeline */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-center mb-4">
                  {(() => {
                    const StatusIcon = getStatusIcon(foundOrder.status)
                    return (
                      <div className={`p-4 rounded-full ${getStatusColor(foundOrder.status)}`}>
                        <StatusIcon className="h-8 w-8 text-white" />
                      </div>
                    )
                  })()}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{getStatusText(foundOrder.status)}</h3>
                  <p className="text-gray-600">{getStatusDescription(foundOrder.status, foundOrder.orderType)}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Información del Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nombre:</strong> {foundOrder.customer.customerName}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {foundOrder.customer.customerPhone}
                    </p>
                    <p className="flex items-center gap-2">
                      <strong>Tipo:</strong>
                      {foundOrder.orderType === "delivery" && <Truck className="h-4 w-4" />}
                      {foundOrder.orderType === "pickup" && <MapPin className="h-4 w-4" />}
                      {foundOrder.orderType === "dine-in" && <Utensils className="h-4 w-4" />}
                      {foundOrder.orderType === "delivery"
                        ? "Domicilio"
                        : foundOrder.orderType === "pickup"
                          ? "Recoger"
                          : "Comer en restaurante"}
                    </p>
                    {foundOrder.customer.address && (
                      <p>
                        <strong>Dirección:</strong> {foundOrder.customer.address}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Detalles del Pedido</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Fecha:</strong> {new Date(foundOrder.date).toLocaleString("es-CO")}
                    </p>
                    <p>
                      <strong>Método de pago:</strong> {foundOrder.paymentMethod}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      <span className="text-orange-600 font-bold">{formatPrice(foundOrder.total)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Productos Ordenados</h3>
                <div className="space-y-2">
                  {foundOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-orange-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>{formatPrice(foundOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>IVA (19%):</span>
                    <span>{formatPrice(foundOrder.tax)}</span>
                  </div>
                  {foundOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Domicilio:</span>
                      <span>{formatPrice(foundOrder.deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-orange-600">{formatPrice(foundOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status-specific messages */}
              {foundOrder.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center">
                    <strong>¿Ya confirmaste tu pago?</strong> Si ya realizaste el pago, contacta al restaurante para
                    acelerar el proceso.
                  </p>
                </div>
              )}

              {foundOrder.status === "ready" && foundOrder.orderType === "pickup" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-center">
                    <strong>¡Tu pedido está listo!</strong> Puedes pasar a recogerlo cuando gustes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-white/80 text-sm">
            ¿Necesitas ayuda con tu pedido?
            <br />
            Contacta por WhatsApp: <strong>+57 320 246 6440</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

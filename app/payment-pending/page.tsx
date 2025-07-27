"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, MessageCircle, CheckCircle, ArrowLeft, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../context/cart-context"
import DinoGame from "../components/dino-game"

export default function PaymentPendingPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const pendingOrder = localStorage.getItem("pendingOrder")
    if (pendingOrder) {
      try {
        const parsedOrder = JSON.parse(pendingOrder)
        setOrderData(parsedOrder)
        // Limpiar el carrito solo una vez cuando se carga la página
        clearCart()
      } catch (error) {
        console.error("Error parsing pending order:", error)
        router.push("/")
        return
      }
    } else {
      router.push("/")
      return
    }
    setIsLoading(false)
  }, []) // Dependencias vacías para ejecutar solo una vez

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleBackToPOS = () => {
    localStorage.removeItem("pendingOrder")
    router.push("/")
  }

  const openWhatsAppAgain = () => {
    const message = "¡Hola! 👋 Gracias por contactarnos. Indícanos qué necesitas y con gusto te ayudaremos..."
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573202466440&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800">No se encontró información del pedido</h1>
          <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/")}>
            Volver al Sistema
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Pago Pendiente de Confirmación!</h1>
          <p className="text-white/90 text-lg">Tu pedido ha sido enviado y está esperando confirmación del pago</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-xl text-orange-600">
              Resumen de tu Pedido #{orderData.invoice.invoiceNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">¿Qué sigue ahora?</h3>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Se abrió WhatsApp con los detalles de tu pedido</li>
                    <li>
                      2. Confirma tu pago con el método seleccionado: <strong>{orderData.paymentMethod}</strong>
                    </li>
                    <li>3. Una vez confirmado, recibirás tu factura electrónica</li>
                    <li>4. Tu pedido pasará a preparación</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Información del Cliente</h3>
                <p className="text-sm">
                  <strong>Nombre:</strong> {orderData.orderData.customerName}
                </p>
                <p className="text-sm">
                  <strong>Teléfono:</strong> {orderData.orderData.customerPhone}
                </p>
                {orderData.orderData.address && (
                  <p className="text-sm">
                    <strong>Dirección:</strong> {orderData.orderData.address}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Detalles del Pedido</h3>
                <p className="text-sm">
                  <strong>Tipo:</strong>{" "}
                  {orderData.orderData.type === "delivery"
                    ? "Domicilio"
                    : orderData.orderData.type === "pickup"
                      ? "Recoger"
                      : "Comer en restaurante"}
                </p>
                <p className="text-sm">
                  <strong>Método de pago:</strong> {orderData.paymentMethod}
                </p>
                <p className="text-sm">
                  <strong>Total:</strong> {formatPrice(orderData.invoice.total)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Productos</h3>
              <div className="space-y-2">
                {orderData.invoice.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total a Pagar:</span>
                <span className="text-orange-600">{formatPrice(orderData.invoice.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Juego del Dinosaurio */}
        <div className="mb-6">
          <DinoGame />
        </div>

        {/* Redes Sociales */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-3">¡Síguenos en nuestras redes sociales!</h3>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/burgerthecontainer/?utm_source=ig_web_button_share_sheet",
                      "_blank",
                    )
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Instagram
                </Button>
                <Button
                  onClick={() => window.open("https://www.facebook.com/containerburgeraipe", "_blank")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-semibold text-green-800">¡Tu pedido está registrado!</p>
                  <p className="text-sm text-green-700">
                    Una vez confirmes el pago por WhatsApp, recibirás tu factura electrónica automáticamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button onClick={openWhatsAppAgain} className="w-full bg-green-500 hover:bg-green-600 text-lg py-3">
              <MessageCircle className="mr-2 h-5 w-5" />
              Abrir WhatsApp para Confirmar Pago
            </Button>

            <Button variant="outline" onClick={handleBackToPOS} className="w-full bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Menú Principal
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            ¿Necesitas ayuda? Contacta directamente por WhatsApp:
            <br />
            <strong>+57 320 246 6440</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

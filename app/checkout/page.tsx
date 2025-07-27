"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Smartphone, Building, Banknote, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "../context/cart-context"
import type { OrderData } from "../components/order-type-modal"

const paymentMethods = [
  { id: "nequi", name: "Nequi", icon: Smartphone, color: "bg-purple-500" },
  { id: "daviplata", name: "DaviPlata", icon: Smartphone, color: "bg-red-500" },
  { id: "bancolombia", name: "Bancolombia", icon: Building, color: "bg-yellow-500" },
  { id: "transfiya", name: "Transfiya", icon: CreditCard, color: "bg-blue-500" },
  { id: "cash", name: "Efectivo", icon: Banknote, color: "bg-green-500" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("nequi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    const savedOrderData = localStorage.getItem("orderData")
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    }
  }, [])

  const tax = cartTotal * 0.19 // IVA Colombia
  const deliveryFee = orderData?.type === "delivery" ? 3000 : 0
  const grandTotal = cartTotal + tax + deliveryFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const generateInvoiceNumber = () => {
    return `TCB-${Date.now()}`
  }

  const generateInvoice = (sale: any) => {
    const invoice = {
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString(),
      customer: {
        name: orderData?.customerName,
        phone: orderData?.customerPhone,
        address: orderData?.address,
      },
      orderType: orderData?.type,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: cartTotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: grandTotal,
      paymentMethod: paymentMethod,
    }
    return invoice
  }

  const sendWhatsAppInvoice = (invoice: any) => {
    const message = `
🧾 *FACTURA ELECTRÓNICA*
*The Container BURGER*

📋 *Factura:* ${invoice.invoiceNumber}
📅 *Fecha:* ${new Date(invoice.date).toLocaleString("es-CO")}

👤 *Cliente:* ${invoice.customer.name}
📱 *Teléfono:* ${invoice.customer.phone}
${invoice.customer.address ? `📍 *Dirección:* ${invoice.customer.address}` : ""}

🛍️ *Tipo de pedido:* ${
      invoice.orderType === "delivery"
        ? "Domicilio"
        : invoice.orderType === "pickup"
          ? "Recoger"
          : "Comer en restaurante"
    }

📦 *PRODUCTOS:*
${invoice.items.map((item: any) => `• ${item.name} x${item.quantity} - ${formatPrice(item.total)}`).join("\n")}

💰 *RESUMEN:*
Subtotal: ${formatPrice(invoice.subtotal)}
IVA (19%): ${formatPrice(invoice.tax)}
${invoice.deliveryFee > 0 ? `Domicilio: ${formatPrice(invoice.deliveryFee)}` : ""}
*TOTAL: ${formatPrice(invoice.total)}*

💳 *Método de pago:* ${paymentMethod}

¡Gracias por tu compra! 🍔
    `.trim()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${invoice.customer.phone}&text=${encodeURIComponent(
      message,
    )}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePayment = async () => {
    if (!orderData) {
      alert("Error: Datos de pedido no encontrados")
      return
    }

    setIsProcessing(true)

    // Generar información de la orden para enviar por WhatsApp
    const orderSummary = `
🛒 *NUEVA ORDEN - CONFIRMACIÓN DE PAGO*
*The Container BURGER*

👤 *Cliente:* ${orderData.customerName}
📱 *Teléfono:* ${orderData.customerPhone}
${orderData.address ? `📍 *Dirección:* ${orderData.address}` : ""}

🛍️ *Tipo de pedido:* ${
      orderData.type === "delivery" ? "Domicilio" : orderData.type === "pickup" ? "Recoger" : "Comer en restaurante"
    }

📦 *PRODUCTOS:*
${cart.map((item) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n")}

💰 *TOTAL A PAGAR:* ${formatPrice(grandTotal)}

💳 *INFORMACIÓN DE PAGO:*
🏦 *Nequi:* 320-246-6440
🏦 *Bancolombia:* 1234-5678-9012
🏦 *DaviPlata:* 320-246-6440
💵 *Efectivo:* Pago contra entrega

⚠️ *IMPORTANTE:*
1️⃣ Realiza tu pago con el método seleccionado: *${paymentMethods.find((m) => m.id === paymentMethod)?.name}*
2️⃣ *ENVÍA EL COMPROBANTE DE PAGO* por este mismo chat
3️⃣ Una vez confirmemos tu pago, recibirás tu *NÚMERO DE PEDIDO*
4️⃣ Podrás consultar el estado en nuestra página web

${orderData.notes ? `📝 *Notas:* ${orderData.notes}` : ""}

*¡Esperamos tu comprobante para confirmar tu pedido!* ✅
`.trim()

    // Abrir WhatsApp de la empresa
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573202466440&text=${encodeURIComponent(orderSummary)}`
    window.open(whatsappUrl, "_blank")

    // Simular procesamiento mientras el usuario confirma el pago
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generar la orden y factura (se procesará cuando la empresa confirme)
    const invoice = generateInvoice({})

    // Guardar venta en localStorage para el admin
    const sale = {
      id: Date.now(),
      invoiceNumber: invoice.invoiceNumber,
      date: new Date().toISOString(),
      customer: orderData,
      items: cart,
      subtotal: cartTotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: grandTotal,
      paymentMethod: paymentMethod,
      orderType: orderData.type,
      status: "pending", // Quedará pendiente hasta confirmación
    }

    const existingSales = JSON.parse(localStorage.getItem("sales") || "[]")
    existingSales.push(sale)
    localStorage.setItem("sales", JSON.stringify(existingSales))

    // Guardar factura
    const existingInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    existingInvoices.push(invoice)
    localStorage.setItem("invoices", JSON.stringify(existingInvoices))

    // Notificar al admin
    const notifications = JSON.parse(localStorage.getItem("adminNotifications") || "[]")
    notifications.push({
      id: Date.now(),
      type: "payment_confirmation",
      message: `Orden pendiente de confirmación de pago - ${paymentMethods.find((m) => m.id === paymentMethod)?.name}`,
      customer: orderData.customerName,
      total: grandTotal,
      date: new Date().toISOString(),
      read: false,
    })
    localStorage.setItem("adminNotifications", JSON.stringify(notifications))

    // Guardar datos para la página de éxito
    localStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        invoice,
        orderData,
        paymentMethod: paymentMethods.find((m) => m.id === paymentMethod)?.name,
      }),
    )

    router.push("/payment-pending")
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-400 to-red-600">
        <div className="text-center bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800">Tu carrito está vacío</h1>
          <p className="mt-2 text-gray-600">Agrega productos antes de proceder al pago</p>
          <Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/")}>
            Volver al Sistema
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Sistema
        </Button>

        <h1 className="mb-6 text-3xl font-bold text-white">Finalizar Pedido</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Resumen del Pedido</h2>
            <div className="rounded-lg border border-white/20 p-4 bg-white/95 backdrop-blur-sm mb-6">
              {/* Customer Info */}
              {orderData && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Información del Cliente</h3>
                  <p className="text-sm text-gray-700">
                    <strong>Nombre:</strong> {orderData.customerName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Teléfono:</strong> {orderData.customerPhone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Tipo:</strong>{" "}
                    {orderData.type === "delivery"
                      ? "Domicilio"
                      : orderData.type === "pickup"
                        ? "Recoger"
                        : "Comer en restaurante"}
                  </p>
                  {orderData.address && (
                    <p className="text-sm text-gray-700">
                      <strong>Dirección:</strong> {orderData.address}
                      {orderData.addressDetails && ` - ${orderData.addressDetails}`}
                    </p>
                  )}
                  {orderData.tableNumber && (
                    <p className="text-sm text-gray-700">
                      <strong>Mesa:</strong> {orderData.tableNumber}
                    </p>
                  )}
                  {orderData.notes && (
                    <p className="text-sm text-gray-700">
                      <strong>Notas:</strong> {orderData.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Items */}
              {cart.map((item) => (
                <div key={item.id} className="mb-3 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-orange-600">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <p>Subtotal</p>
                  <p>{formatPrice(cartTotal)}</p>
                </div>
                <div className="flex justify-between text-gray-700">
                  <p>IVA (19%)</p>
                  <p>{formatPrice(tax)}</p>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <p>Domicilio</p>
                    <p>{formatPrice(deliveryFee)}</p>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800">
                  <p>Total</p>
                  <p>{formatPrice(grandTotal)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Método de Pago</h2>
            <div className="rounded-lg border border-white/20 p-4 bg-white/95 backdrop-blur-sm">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div key={method.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center cursor-pointer flex-1">
                        <div className={`p-2 rounded-md ${method.color} mr-3`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {method.name}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : `Pagar ${formatPrice(grandTotal)}`}
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FileText className="mr-2 h-4 w-4" />
                  Se enviará factura electrónica por WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

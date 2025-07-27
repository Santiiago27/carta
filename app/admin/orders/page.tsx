"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Eye, Check, Clock, Truck, MapPin, Utensils, FileText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

interface Notification {
  id: number
  type: string
  message: string
  customer: string
  total: number
  date: string
  read: boolean
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Verificar si está autenticado en el admin principal
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (!adminAuth) {
      router.push("/admin")
      return
    }

    const savedOrders = localStorage.getItem("sales")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    const savedNotifications = localStorage.getItem("adminNotifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const updateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("sales", JSON.stringify(updatedOrders))
  }

  const updateOrder = (updatedOrder: Order) => {
    const updatedOrders = orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    setOrders(updatedOrders)
    localStorage.setItem("sales", JSON.stringify(updatedOrders))
    setEditingOrder(null)
  }

  const deleteOrder = (orderId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta orden?")) {
      const updatedOrders = orders.filter((order) => order.id !== orderId)
      setOrders(updatedOrders)
      localStorage.setItem("sales", JSON.stringify(updatedOrders))
    }
  }

  const clearAllSales = () => {
    if (
      confirm("¿Estás seguro de que quieres eliminar TODO el historial de ventas? Esta acción no se puede deshacer.")
    ) {
      localStorage.removeItem("sales")
      localStorage.removeItem("adminNotifications")
      localStorage.removeItem("invoices")
      setOrders([])
      setNotifications([])
      alert("Historial eliminado completamente")
    }
  }

  const markNotificationAsRead = (notificationId: number) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem("adminNotifications", JSON.stringify(updatedNotifications))
  }

  const resendInvoiceWhatsApp = (order: Order) => {
    const message = `
🧾 *FACTURA ELECTRÓNICA*
*Mi Nueva Empresa*

📋 *Factura:* ${order.invoiceNumber}
📅 *Fecha:* ${new Date(order.date).toLocaleString("es-CO")}

👤 *Cliente:* ${order.customer.customerName}
📱 *Teléfono:* ${order.customer.customerPhone}
${order.customer.address ? `📍 *Dirección:* ${order.customer.address}` : ""}

🛍️ *Tipo de pedido:* ${
      order.orderType === "delivery" ? "Domicilio" : order.orderType === "pickup" ? "Recoger" : "Comer en restaurante"
    }

📦 *PRODUCTOS:*
${order.items.map((item: any) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n")}

💰 *RESUMEN:*
Subtotal: ${formatPrice(order.subtotal)}
IVA (19%): ${formatPrice(order.tax)}
${order.deliveryFee > 0 ? `Domicilio: ${formatPrice(order.deliveryFee)}` : ""}
*TOTAL: ${formatPrice(order.total)}*

💳 *Método de pago:* ${order.paymentMethod}

¡Gracias por tu compra! 🍔
    `.trim()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${order.customer.customerPhone}&text=${encodeURIComponent(
      message,
    )}`
    window.open(whatsappUrl, "_blank")
  }

  const getOrdersByType = (type: string) => {
    return orders.filter((order) => order.orderType === type)
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
        return "Pendiente"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Listo"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const confirmPaymentAndSendInvoice = (order: Order) => {
    // Actualizar estado a "preparing"
    updateOrderStatus(order.id, "preparing")

    // Enviar factura por WhatsApp al cliente
    const message = `
🧾 *FACTURA ELECTRÓNICA CONFIRMADA*
*Mi Nueva Empresa*

✅ *¡PAGO CONFIRMADO!*

📋 *Factura:* ${order.invoiceNumber}
📅 *Fecha:* ${new Date(order.date).toLocaleString("es-CO")}

👤 *Cliente:* ${order.customer.customerName}
📱 *Teléfono:* ${order.customer.customerPhone}
${order.customer.address ? `📍 *Dirección:* ${order.customer.address}` : ""}

🛍️ *Tipo de pedido:* ${
      order.orderType === "delivery" ? "Domicilio" : order.orderType === "pickup" ? "Recoger" : "Comer en restaurante"
    }

📦 *PRODUCTOS:*
${order.items.map((item: any) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n")}

💰 *RESUMEN:*
Subtotal: ${formatPrice(order.subtotal)}
IVA (19%): ${formatPrice(order.tax)}
${order.deliveryFee > 0 ? `Domicilio: ${formatPrice(order.deliveryFee)}` : ""}
*TOTAL PAGADO: ${formatPrice(order.total)}*

💳 *Método de pago:* ${order.paymentMethod}

🍔 *Tu pedido está ahora en preparación*
¡Gracias por tu compra!
    `.trim()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${order.customer.customerPhone}&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    alert("Pago confirmado y factura enviada al cliente")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Admin
          </Button>
          <h1 className="text-3xl font-bold text-white">Gestión de Órdenes</h1>
          <div className="flex items-center gap-3">
            <Button variant="destructive" onClick={clearAllSales} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Historial
            </Button>
            <div className="relative">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
                {unreadNotifications > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadNotifications}</Badge>}
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {unreadNotifications > 0 && (
          <Card className="mb-6 border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones Nuevas ({unreadNotifications})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications
                  .filter((n) => !n.read)
                  .slice(0, 5)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{notification.message}</p>
                        <p className="text-sm text-gray-600">
                          Cliente: {notification.customer} - {formatPrice(notification.total)}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString("es-CO")}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Marcar como leída
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas las Órdenes ({orders.length})</TabsTrigger>
            <TabsTrigger value="delivery">Domicilios ({getOrdersByType("delivery").length})</TabsTrigger>
            <TabsTrigger value="pickup">Para Recoger ({getOrdersByType("pickup").length})</TabsTrigger>
            <TabsTrigger value="dine-in">Comer Aquí ({getOrdersByType("dine-in").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <OrdersList
              orders={orders}
              onViewOrder={setSelectedOrder}
              onEditOrder={setEditingOrder}
              onUpdateStatus={updateOrderStatus}
              onResendInvoice={resendInvoiceWhatsApp}
              onConfirmPayment={confirmPaymentAndSendInvoice}
            />
          </TabsContent>

          <TabsContent value="delivery">
            <OrdersList
              orders={getOrdersByType("delivery")}
              onViewOrder={setSelectedOrder}
              onEditOrder={setEditingOrder}
              onUpdateStatus={updateOrderStatus}
              onResendInvoice={resendInvoiceWhatsApp}
              onConfirmPayment={confirmPaymentAndSendInvoice}
            />
          </TabsContent>

          <TabsContent value="pickup">
            <OrdersList
              orders={getOrdersByType("pickup")}
              onViewOrder={setSelectedOrder}
              onEditOrder={setEditingOrder}
              onUpdateStatus={updateOrderStatus}
              onResendInvoice={resendInvoiceWhatsApp}
              onConfirmPayment={confirmPaymentAndSendInvoice}
            />
          </TabsContent>

          <TabsContent value="dine-in">
            <OrdersList
              orders={getOrdersByType("dine-in")}
              onViewOrder={setSelectedOrder}
              onEditOrder={setEditingOrder}
              onUpdateStatus={updateOrderStatus}
              onResendInvoice={resendInvoiceWhatsApp}
              onConfirmPayment={confirmPaymentAndSendInvoice}
            />
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Orden #{selectedOrder.invoiceNumber}
                </DialogTitle>
              </DialogHeader>
              <OrderDetail order={selectedOrder} onResendInvoice={resendInvoiceWhatsApp} />
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Order Modal */}
        {editingOrder && (
          <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Editar Orden #{editingOrder.invoiceNumber}
                </DialogTitle>
              </DialogHeader>
              <EditOrderForm order={editingOrder} onSave={updateOrder} onCancel={() => setEditingOrder(null)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )

  function OrdersList({
    orders,
    onViewOrder,
    onEditOrder,
    onUpdateStatus,
    onResendInvoice,
    onConfirmPayment,
  }: {
    orders: Order[]
    onViewOrder: (order: Order) => void
    onEditOrder: (order: Order) => void
    onUpdateStatus: (orderId: number, status: Order["status"]) => void
    onResendInvoice: (order: Order) => void
    onConfirmPayment: (order: Order) => void
  }) {
    if (orders.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-lg">No hay órdenes para mostrar</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">#{order.invoiceNumber}</CardTitle>
                <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusText(order.status)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {order.orderType === "delivery" && <Truck className="h-4 w-4" />}
                {order.orderType === "pickup" && <MapPin className="h-4 w-4" />}
                {order.orderType === "dine-in" && <Utensils className="h-4 w-4" />}
                <span>
                  {order.orderType === "delivery"
                    ? "Domicilio"
                    : order.orderType === "pickup"
                      ? "Recoger"
                      : "Comer aquí"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customer.customerName}</p>
                <p className="text-sm text-gray-600">{order.customer.customerPhone}</p>
                {order.customer.address && <p className="text-sm text-gray-600">{order.customer.address}</p>}
                <p className="font-bold text-orange-600">{formatPrice(order.total)}</p>
                <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString("es-CO")}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewOrder(order)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEditOrder(order)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => onResendInvoice(order)}>
                  <FileText className="h-4 w-4 mr-1" />
                  Factura
                </Button>
                {order.status === "pending" && (
                  <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onConfirmPayment(order)}>
                    <Check className="h-4 w-4 mr-1" />
                    Confirmar Pago
                  </Button>
                )}
                {order.status === "pending" && (
                  <Button size="sm" onClick={() => onUpdateStatus(order.id, "preparing")}>
                    <Clock className="h-4 w-4 mr-1" />
                    Preparar
                  </Button>
                )}
                {order.status === "preparing" && (
                  <Button size="sm" onClick={() => onUpdateStatus(order.id, "ready")}>
                    <Check className="h-4 w-4 mr-1" />
                    Listo
                  </Button>
                )}
                {order.status === "ready" && (
                  <Button size="sm" onClick={() => onUpdateStatus(order.id, "completed")}>
                    <Check className="h-4 w-4 mr-1" />
                    Completar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  function OrderDetail({ order, onResendInvoice }: { order: Order; onResendInvoice: (order: Order) => void }) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Información del Cliente</h3>
            <p>
              <strong>Nombre:</strong> {order.customer.customerName}
            </p>
            <p>
              <strong>Teléfono:</strong> {order.customer.customerPhone}
            </p>
            {order.customer.address && (
              <p>
                <strong>Dirección:</strong> {order.customer.address}
              </p>
            )}
            {order.customer.addressDetails && (
              <p>
                <strong>Detalles:</strong> {order.customer.addressDetails}
              </p>
            )}
            {order.customer.tableNumber && (
              <p>
                <strong>Mesa:</strong> {order.customer.tableNumber}
              </p>
            )}
            {order.customer.notes && (
              <p>
                <strong>Notas:</strong> {order.customer.notes}
              </p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Detalles del Pedido</h3>
            <p>
              <strong>Fecha:</strong> {new Date(order.date).toLocaleString("es-CO")}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              {order.orderType === "delivery" ? "Domicilio" : order.orderType === "pickup" ? "Recoger" : "Comer aquí"}
            </p>
            <p>
              <strong>Pago:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <Badge className={`${getStatusColor(order.status)} text-white`}>{getStatusText(order.status)}</Badge>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Productos</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (19%):</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Domicilio:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => onResendInvoice(order)} className="bg-green-500 hover:bg-green-600">
            <FileText className="h-4 w-4 mr-2" />
            Reenviar Factura por WhatsApp
          </Button>
        </div>
      </div>
    )
  }

  function EditOrderForm({
    order,
    onSave,
    onCancel,
  }: { order: Order; onSave: (order: Order) => void; onCancel: () => void }) {
    const [editedOrder, setEditedOrder] = useState<Order>({ ...order })

    const handleSave = () => {
      // Recalcular totales
      const subtotal = editedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const tax = subtotal * 0.19
      const total = subtotal + tax + editedOrder.deliveryFee

      const updatedOrder = {
        ...editedOrder,
        subtotal,
        tax,
        total,
      }

      onSave(updatedOrder)
    }

    const updateCustomerField = (field: string, value: string) => {
      setEditedOrder({
        ...editedOrder,
        customer: {
          ...editedOrder.customer,
          [field]: value,
        },
      })
    }

    const updateItemQuantity = (index: number, quantity: number) => {
      if (quantity <= 0) return
      const updatedItems = [...editedOrder.items]
      updatedItems[index] = { ...updatedItems[index], quantity }
      setEditedOrder({ ...editedOrder, items: updatedItems })
    }

    const removeItem = (index: number) => {
      const updatedItems = editedOrder.items.filter((_, i) => i !== index)
      setEditedOrder({ ...editedOrder, items: updatedItems })
    }

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="customerName">Nombre del Cliente</Label>
            <Input
              id="customerName"
              value={editedOrder.customer.customerName}
              onChange={(e) => updateCustomerField("customerName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Teléfono</Label>
            <Input
              id="customerPhone"
              value={editedOrder.customer.customerPhone}
              onChange={(e) => updateCustomerField("customerPhone", e.target.value)}
            />
          </div>
        </div>

        {editedOrder.orderType === "delivery" && (
          <div className="space-y-2">
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={editedOrder.customer.address || ""}
                onChange={(e) => updateCustomerField("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="addressDetails">Detalles de la dirección</Label>
              <Input
                id="addressDetails"
                value={editedOrder.customer.addressDetails || ""}
                onChange={(e) => updateCustomerField("addressDetails", e.target.value)}
              />
            </div>
          </div>
        )}

        {editedOrder.orderType === "dine-in" && (
          <div>
            <Label htmlFor="tableNumber">Número de Mesa</Label>
            <Input
              id="tableNumber"
              value={editedOrder.customer.tableNumber || ""}
              onChange={(e) => updateCustomerField("tableNumber", e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={editedOrder.customer.notes || ""}
            onChange={(e) => updateCustomerField("notes", e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Productos</h3>
          <div className="space-y-2">
            {editedOrder.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateItemQuantity(index, item.quantity - 1)}>
                    -
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => updateItemQuantity(index, item.quantity + 1)}>
                    +
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Guardar Cambios
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }
}

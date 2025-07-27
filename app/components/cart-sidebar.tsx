"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"
import OrderTypeModal, { type OrderData } from "./order-type-modal"

export default function CartSidebar() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart()
  const [showOrderModal, setShowOrderModal] = useState(false)

  const handleCheckout = () => {
    setShowOrderModal(true)
  }

  const handleOrderConfirm = (orderData: OrderData) => {
    // Guardar datos de la orden en localStorage para el checkout
    localStorage.setItem("orderData", JSON.stringify(orderData))
    router.push("/checkout")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <div className="flex w-80 flex-col border-l bg-gray-900/95 backdrop-blur-sm border-gray-700">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="flex items-center text-lg font-semibold text-white">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrito
          </h2>
          <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-medium text-white">
            {itemCount} productos
          </span>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-2 h-12 w-12 text-gray-500" />
              <h3 className="font-medium text-white">Tu carrito está vacío</h3>
              <p className="text-sm text-gray-400">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-600">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium line-clamp-1 text-white">{item.name}</h3>
                      <p className="font-medium text-orange-400">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <p className="text-sm text-gray-400">{formatPrice(item.price)} c/u</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-400"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-gray-300">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <div className="flex justify-between font-medium text-white">
              <p>Total</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
          </div>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Realizar Pedido
          </Button>
        </div>
      </div>

      <OrderTypeModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} onConfirm={handleOrderConfirm} />
    </>
  )
}

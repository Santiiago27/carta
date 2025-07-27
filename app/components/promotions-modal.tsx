"use client"

import { useState, useEffect } from "react"
import { Star, Clock, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../context/cart-context"

interface Promotion {
  id: number
  title: string
  description: string
  discount: string
  validUntil: string
  image: string
  isActive: boolean
}

interface PromotionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PromotionsModal({ isOpen, onClose }: PromotionsModalProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    // Cargar promociones desde localStorage
    const savedPromotions = localStorage.getItem("promotions")
    if (savedPromotions) {
      setPromotions(JSON.parse(savedPromotions))
    } else {
      // Promociones por defecto
      const defaultPromotions: Promotion[] = [
        {
          id: 1,
          title: "Hamburguesa Maxi Queso",
          description: "Hamburguesa doble carne con queso derretido, lechuga, tomate y papas francesas",
          discount: "30% OFF",
          validUntil: "2024-12-31",
          image: "/classic-beef-burger.png",
          isActive: true,
        },
        {
          id: 2,
          title: "Pizza Maxi Queso",
          description: "Pizza familiar con extra queso mozzarella, pepperoni y bordes rellenos de queso",
          discount: "25% OFF",
          validUntil: "2024-12-31",
          image: "/delicious-pizza.png",
          isActive: true,
        },
      ]
      setPromotions(defaultPromotions)
      localStorage.setItem("promotions", JSON.stringify(defaultPromotions))
    }
  }, [])

  const activePromotions = promotions.filter((promo) => promo.isActive)

  const addPromotionToCart = (promotion: Promotion) => {
    // Calcular precio con descuento
    const basePrice = 25000 // Precio base de ejemplo
    const discountPercent = Number.parseInt(promotion.discount.replace(/[^\d]/g, "")) || 0
    const discountedPrice = basePrice * (1 - discountPercent / 100)

    const promotionProduct = {
      id: Date.now(), // ID único para la promoción
      name: `🎉 ${promotion.title}`,
      price: discountedPrice,
      image: promotion.image,
      category: "promotion",
      description: `${promotion.description} - ${promotion.discount}`,
      specifications: `Promoción válida hasta: ${new Date(promotion.validUntil).toLocaleDateString("es-CO")}`,
    }

    addToCart(promotionProduct)
    alert(`¡${promotion.title} agregada al carrito con ${promotion.discount}!`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-orange-600 flex items-center justify-center gap-2">
            <Gift className="h-8 w-8" />
            ¡PROMOCIONES ESPECIALES!
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {activePromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="relative overflow-hidden rounded-xl border-3 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-600 text-white font-bold text-lg px-3 py-1">{promotion.discount}</Badge>
              </div>

              <div className="mb-4">
                <img
                  src={promotion.image || "/placeholder.svg"}
                  alt={promotion.title}
                  className="h-40 w-full object-cover rounded-lg shadow-md"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {promotion.title}
                </h3>

                <p className="text-gray-700 text-base leading-relaxed">{promotion.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Válido hasta: {new Date(promotion.validUntil).toLocaleDateString("es-CO")}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 text-lg shadow-lg"
                  onClick={() => addPromotionToCart(promotion)}
                >
                  🛒 ¡AGREGAR AL CARRITO!
                </Button>
              </div>
            </div>
          ))}
        </div>

        {activePromotions.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-600">No hay promociones activas</h3>
            <p className="text-gray-500 text-lg">¡Pronto tendremos nuevas ofertas increíbles para ti!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

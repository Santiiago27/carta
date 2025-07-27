"use client"

import { useState } from "react"
import { Settings, Gift, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGrid from "./components/product-grid"
import CartSidebar from "./components/cart-sidebar"
import CategorySidebar from "./components/category-sidebar"
import PromotionsModal from "./components/promotions-modal"
import WhatsAppButton from "./components/whatsapp-button"
import { useRouter } from "next/navigation"
import BirthdayPromotion from "./components/birthday-promotion"

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [showPromotions, setShowPromotions] = useState(false)
  const [showBirthdayPromo, setShowBirthdayPromo] = useState(false)
  const router = useRouter()

  const handleCategorySelect = (category: string, subcategory?: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory || "")
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src="/burger-background.png" alt="Burger Background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        <CategorySidebar
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSelectCategory={handleCategorySelect}
        />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 shadow-2xl border-b-4 border-yellow-400">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">🍔</span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white drop-shadow-lg">THE CONTAINER</h1>
                    <h2 className="text-2xl font-bold text-yellow-300 drop-shadow-md">BURGER</h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Order Status Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => router.push("/order-status")}
                    title="Consultar Estado del Pedido"
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {/* Admin Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => router.push("/admin")}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Promociones Section */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 border-b-2 border-orange-600">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowPromotions(true)}
              >
                <Gift className="mr-2 h-5 w-5" />
                ¡VER PROMOCIONES!
              </Button>

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowBirthdayPromo(true)}
              >
                🎂 ¡CUMPLEAÑOS GRATIS!
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push("/reservations")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                RESERVAR MESA
              </Button>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1 overflow-auto p-6">
            <ProductGrid category={selectedCategory} subcategory={selectedSubcategory} />
          </div>
        </main>

        <CartSidebar />
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Promotions Modal */}
      <PromotionsModal isOpen={showPromotions} onClose={() => setShowPromotions(false)} />

      {/* Birthday Promotion Modal */}
      <BirthdayPromotion isOpen={showBirthdayPromo} onClose={() => setShowBirthdayPromo(false)} />
    </div>
  )
}

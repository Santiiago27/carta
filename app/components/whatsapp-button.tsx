"use client"

import { MessageCircle, Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = "¡Hola! 👋 Gracias por contactarnos. Indícanos qué necesitas y con gusto te ayudaremos..."
    const whatsappUrl = `https://api.whatsapp.com/send?phone=573202466440&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/burgerthecontainer/?utm_source=ig_web_button_share_sheet", "_blank")
  }

  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/containerburgeraipe", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        size="lg"
      >
        <MessageCircle className="h-6 w-6 mr-2 group-hover:animate-bounce" />
        WhatsApp
      </Button>

      {/* Instagram Button */}
      <Button
        onClick={handleInstagramClick}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        size="lg"
      >
        <Instagram className="h-6 w-6 mr-2 group-hover:animate-pulse" />
        Instagram
      </Button>

      {/* Facebook Button */}
      <Button
        onClick={handleFacebookClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        size="lg"
      >
        <Facebook className="h-6 w-6 mr-2 group-hover:animate-pulse" />
        Facebook
      </Button>
    </div>
  )
}

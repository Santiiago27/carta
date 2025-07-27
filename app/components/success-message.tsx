"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Star, Sparkles, Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessMessageProps {
  message: string
  type?: "success" | "birthday" | "reservation" | "payment"
  onClose?: () => void
  duration?: number
}

export default function SuccessMessage({ message, type = "success", onClose, duration = 4000 }: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "birthday":
        return <Gift className="h-8 w-8 text-yellow-500" />
      case "reservation":
        return <Star className="h-8 w-8 text-blue-500" />
      case "payment":
        return <Sparkles className="h-8 w-8 text-purple-500" />
      default:
        return <CheckCircle className="h-8 w-8 text-green-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "birthday":
        return "from-yellow-400 via-orange-500 to-red-500"
      case "reservation":
        return "from-blue-400 via-purple-500 to-pink-500"
      case "payment":
        return "from-purple-400 via-pink-500 to-red-500"
      default:
        return "from-green-400 via-emerald-500 to-teal-500"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card
        className={`
          max-w-md mx-4 overflow-hidden border-0 shadow-2xl transform transition-all duration-500
          ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div className={`h-2 bg-gradient-to-r ${getColors()}`} />
        <CardContent className="p-8 text-center bg-white">
          <div className="mb-6 flex justify-center">
            <div
              className={`
              p-4 rounded-full bg-gradient-to-r ${getColors()} 
              animate-pulse shadow-lg transform transition-transform duration-300 hover:scale-110
            `}
            >
              {getIcon()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 text-yellow-400 animate-bounce`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Excelente! 🎉</h2>

            <p className="text-gray-600 text-lg leading-relaxed">{message}</p>

            <div className="pt-4">
              <div className={`h-1 bg-gradient-to-r ${getColors()} rounded-full animate-pulse`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

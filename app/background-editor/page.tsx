"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const gradientOptions = [
  "from-orange-400 via-red-500 to-pink-600",
  "from-purple-400 via-pink-500 to-red-500",
  "from-blue-400 via-purple-500 to-pink-500",
  "from-green-400 via-blue-500 to-purple-600",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-indigo-400 via-purple-500 to-pink-500",
]

export default function BackgroundEditor() {
  const router = useRouter()
  const [selectedGradient, setSelectedGradient] = useState(gradientOptions[0])
  const [customImage, setCustomImage] = useState("")
  const [currentBackground, setCurrentBackground] = useState("")

  useEffect(() => {
    const savedBackground = localStorage.getItem("backgroundImage")
    if (savedBackground) {
      setCurrentBackground(savedBackground)
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCustomImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveBackground = (background: string) => {
    localStorage.setItem("backgroundImage", background)
    setCurrentBackground(background)
    alert("¡Fondo guardado exitosamente!")
  }

  const saveGradient = () => {
    localStorage.removeItem("backgroundImage")
    setCurrentBackground("")
    alert("¡Gradiente aplicado exitosamente!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Sistema
          </Button>
          <h1 className="text-3xl font-bold text-white">Editor de Fondos</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gradients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Gradientes Predefinidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {gradientOptions.map((gradient, index) => (
                  <div
                    key={index}
                    className={`h-20 rounded-lg cursor-pointer border-4 transition-all ${
                      selectedGradient === gradient ? "border-white scale-105" : "border-transparent"
                    } bg-gradient-to-br ${gradient}`}
                    onClick={() => setSelectedGradient(gradient)}
                  />
                ))}
              </div>
              <Button onClick={saveGradient} className="w-full bg-orange-500 hover:bg-orange-600">
                <Save className="mr-2 h-4 w-4" />
                Aplicar Gradiente
              </Button>
            </CardContent>
          </Card>

          {/* Custom Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Imagen Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="background-image">Subir Imagen de Fondo</Label>
                <Input
                  id="background-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
              </div>

              {customImage && (
                <div className="space-y-3">
                  <div className="h-32 rounded-lg overflow-hidden">
                    <img src={customImage || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    onClick={() => saveBackground(customImage)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Imagen
                  </Button>
                </div>
              )}

              {currentBackground && (
                <div className="space-y-2">
                  <Label>Fondo Actual:</Label>
                  <div className="h-20 rounded-lg overflow-hidden">
                    <img
                      src={currentBackground || "/placeholder.svg"}
                      alt="Current background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-48 rounded-lg overflow-hidden">
              {currentBackground ? (
                <img
                  src={currentBackground || "/placeholder.svg"}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${selectedGradient}`} />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold">THE CONTAINER BURGER</h2>
                  <p className="text-sm opacity-90">Vista previa del fondo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

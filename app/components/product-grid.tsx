"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"
import type { Product } from "../context/cart-context"

interface ProductGridProps {
  category: string
  subcategory: string
}

export default function ProductGrid({ category, subcategory }: ProductGridProps) {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    // Cargar productos desde localStorage
    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "all" ||
      product.category === category ||
      (category === "promotion" && product.category === "promotion")
    const matchesSubcategory = !subcategory || product.subcategory === subcategory
    return matchesCategory && matchesSubcategory
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group bg-white/95 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 z-10">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(product)
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProduct(product)
                    }}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <div>
                <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                <p className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 border-2 border-dashed border-orange-300">
              <h3 className="text-xl font-bold text-gray-700 mb-2">¡No hay productos disponibles!</h3>
              <p className="text-gray-600">El administrador puede agregar productos desde el panel de control.</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-600">{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Descripción:</h4>
                  <p className="text-gray-600">{selectedProduct.description || "Sin descripción disponible"}</p>
                </div>
                {selectedProduct.specifications && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Especificaciones:</h4>
                    <p className="text-gray-600">{selectedProduct.specifications}</p>
                  </div>
                )}
                <div className="border-t pt-4">
                  <p className="text-3xl font-bold text-orange-600">{formatPrice(selectedProduct.price)}</p>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
                  onClick={() => {
                    addToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                >
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

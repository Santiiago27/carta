"use client"

import type React from "react"
import {
  Coffee,
  LayoutGrid,
  Utensils,
  Beef,
  Pizza,
  DogIcon as HotDog,
  CropIcon as Corn,
  Drumstick,
  Bone,
  Salad,
  Gift,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategorySidebarProps {
  selectedCategory: string
  selectedSubcategory: string
  onSelectCategory: (category: string, subcategory?: string) => void
}

interface CategoryItem {
  id: string
  name: string
  icon: React.ElementType
  subcategories?: SubcategoryItem[]
}

interface SubcategoryItem {
  id: string
  name: string
  icon: React.ElementType
}

const categories: CategoryItem[] = [
  {
    id: "all",
    name: "Todos los Productos",
    icon: LayoutGrid,
  },
  {
    id: "promotion",
    name: "Promociones",
    icon: Gift,
  },
  {
    id: "food",
    name: "Comida",
    icon: Utensils,
    subcategories: [
      { id: "hamburguesas", name: "Hamburguesas", icon: Beef },
      { id: "pizzas", name: "Pizzas", icon: Pizza },
      { id: "hotdogs", name: "Hot Dogs", icon: HotDog },
      { id: "mazorcadas", name: "Mazorcadas", icon: Corn },
      { id: "alitas", name: "Alitas", icon: Drumstick },
      { id: "costillas", name: "Costillas", icon: Bone },
      { id: "ensaladas", name: "Ensaladas", icon: Salad },
      { id: "adiciones", name: "Adiciones", icon: Plus },
    ],
  },
  {
    id: "drinks",
    name: "Bebidas",
    icon: Coffee,
  },
]

export default function CategorySidebar({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-64 border-r bg-gray-900/95 backdrop-blur-sm p-4 overflow-y-auto border-gray-700">
      <h2 className="mb-4 text-lg font-semibold text-white">Categorías</h2>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <div key={category.id}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto py-3 px-4 border bg-transparent",
                  isSelected && !selectedSubcategory
                    ? "border-2 border-orange-500 text-white font-medium bg-orange-500/30"
                    : "border-gray-600 text-gray-300 hover:border-orange-400 hover:text-white hover:bg-orange-500/20",
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="text-sm">{category.name}</span>
              </Button>

              {category.subcategories && isSelected && (
                <div className="ml-4 mt-2 space-y-1">
                  {category.subcategories.map((subcategory) => {
                    const SubIcon = subcategory.icon
                    const isSubSelected = selectedSubcategory === subcategory.id

                    return (
                      <Button
                        key={subcategory.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-auto py-2 px-3 border bg-transparent text-sm",
                          isSubSelected
                            ? "border-orange-400 text-white font-medium bg-orange-500/40"
                            : "border-gray-700 text-gray-400 hover:border-orange-300 hover:text-white hover:bg-orange-500/25",
                        )}
                        onClick={() => onSelectCategory(category.id, subcategory.id)}
                      >
                        <SubIcon className="mr-2 h-4 w-4" />
                        {subcategory.name}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

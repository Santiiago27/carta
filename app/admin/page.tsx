"use client"

import type React from "react"
import { Eye } from "lucide-react" // Import the Eye component

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  TrendingUp,
  Gift,
  Bell,
  FileText,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "../context/cart-context"

interface Sale {
  id: number
  date: string
  items: any[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  status?: "pending" | "completed"
  invoiceNumber?: string
}

interface Promotion {
  id: number
  title: string
  description: string
  discount: string
  validUntil: string
  image: string
  isActive: boolean
}

interface Invoice {
  invoiceNumber: string
  date: string
  customer: any
  orderType: string
  items: any[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  paymentMethod: string
}

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "food",
    subcategory: "",
    image: "/placeholder.svg",
    description: "",
    specifications: "",
  })
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
    image: "/placeholder.svg",
    isActive: true,
  })

  const [cashBase, setCashBase] = useState(0)
  const [showCashBaseDialog, setShowCashBaseDialog] = useState(false)
  const [cashBasePassword, setCashBasePassword] = useState("")
  const [newCashBase, setNewCashBase] = useState("")

  useEffect(() => {
    // Verificar autenticación
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth) {
      setIsAuthenticated(true)
    }

    const savedProducts = localStorage.getItem("products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      // Cargar productos por defecto si no hay productos guardados
      import("../data/products").then((module) => {
        setProducts(module.products)
        localStorage.setItem("products", JSON.stringify(module.products))
      })
    }

    const savedSales = localStorage.getItem("sales")
    if (savedSales) {
      setSales(JSON.parse(savedSales))
    }

    const savedInvoices = localStorage.getItem("invoices")
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices))
    }

    const savedPromotions = localStorage.getItem("promotions")
    if (savedPromotions) {
      setPromotions(JSON.parse(savedPromotions))
    } else {
      // Promociones por defecto
      const defaultPromotions = [
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

    const savedCashBase = localStorage.getItem("cashBase")
    if (savedCashBase) {
      setCashBase(Number.parseFloat(savedCashBase))
    } else {
      setCashBase(50000) // Base por defecto
      localStorage.setItem("cashBase", "50000")
    }
  }, [])

  const handleLogin = () => {
    if (password === "miNuevaContrasenaSegura") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    setIsAuthenticated(false)
    router.push("/")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const savePromotions = (updatedPromotions: Promotion[]) => {
    setPromotions(updatedPromotions)
    localStorage.setItem("promotions", JSON.stringify(updatedPromotions))
  }

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category || "food",
        subcategory: newProduct.subcategory,
        image: newProduct.image || "/placeholder.svg",
        description: newProduct.description || "",
        specifications: newProduct.specifications || "",
      }
      saveProducts([...products, product])
      setNewProduct({
        name: "",
        price: 0,
        category: "food",
        subcategory: "",
        image: "/placeholder.svg",
        description: "",
        specifications: "",
      })
      alert("Producto agregado exitosamente")
    }
  }

  const handleAddPromotion = () => {
    if (newPromotion.title && newPromotion.description) {
      const promotion: Promotion = {
        id: Date.now(),
        title: newPromotion.title,
        description: newPromotion.description,
        discount: newPromotion.discount || "10% OFF",
        validUntil: newPromotion.validUntil || new Date().toISOString().split("T")[0],
        image: newPromotion.image || "/placeholder.svg",
        isActive: newPromotion.isActive ?? true,
      }
      savePromotions([...promotions, promotion])
      setNewPromotion({
        title: "",
        description: "",
        discount: "",
        validUntil: "",
        image: "/placeholder.svg",
        isActive: true,
      })
      alert("Promoción agregada exitosamente")
    }
  }

  const handleEditProduct = (product: Product) => {
    const updatedProducts = products.map((p) => (p.id === product.id ? product : p))
    saveProducts(updatedProducts)
    setEditingProduct(null)
    alert("Producto actualizado exitosamente")
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      saveProducts(updatedProducts)
      alert("Producto eliminado exitosamente")
    }
  }

  const handleDeletePromotion = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
      const updatedPromotions = promotions.filter((p) => p.id !== id)
      savePromotions(updatedPromotions)
      alert("Promoción eliminada exitosamente")
    }
  }

  const resendInvoiceWhatsApp = (invoice: Invoice) => {
    const message = `
🧾 *FACTURA ELECTRÓNICA*
*Mi Nueva Empresa*

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

💳 *Método de pago:* ${invoice.paymentMethod}

¡Gracias por tu compra! 🍔
    `.trim()

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${invoice.customer.phone}&text=${encodeURIComponent(
      message,
    )}`
    window.open(whatsappUrl, "_blank")
  }

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "promotion",
    isEditing = false,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. Por favor selecciona una imagen menor a 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (type === "product") {
          if (isEditing && editingProduct) {
            setEditingProduct({ ...editingProduct, image: imageUrl })
          } else {
            setNewProduct({ ...newProduct, image: imageUrl })
          }
        } else {
          setNewPromotion({ ...newPromotion, image: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const getTodaysSales = () => {
    const today = new Date().toDateString()
    return sales.filter((sale) => new Date(sale.date).toDateString() === today)
  }

  const getTodaysRevenue = () => {
    return getTodaysSales().reduce((total, sale) => total + sale.total, 0)
  }

  const getPendingOrders = () => {
    return sales.filter((sale) => sale.status === "pending").length
  }

  const updateCashBase = () => {
    if (cashBasePassword !== "miNuevaContrasenaSegura") {
      alert("Contraseña incorrecta. Solo el dueño puede cambiar la base de caja.")
      return
    }

    const newBase = Number.parseFloat(newCashBase)
    if (isNaN(newBase) || newBase < 0) {
      alert("Por favor ingresa un valor válido")
      return
    }

    setCashBase(newBase)
    localStorage.setItem("cashBase", newBase.toString())
    setShowCashBaseDialog(false)
    setCashBasePassword("")
    setNewCashBase("")
    alert("Base de caja actualizada correctamente")
  }

  const getSubcategoryOptions = () => {
    if (newProduct.category === "food") {
      return [
        { value: "hamburguesas", label: "Hamburguesas" },
        { value: "pizzas", label: "Pizzas" },
        { value: "hotdogs", label: "Hot Dogs" },
        { value: "mazorcadas", label: "Mazorcadas" },
        { value: "alitas", label: "Alitas" },
        { value: "costillas", label: "Costillas" },
        { value: "ensaladas", label: "Ensaladas" },
        { value: "adiciones", label: "Adiciones" },
      ]
    }
    return []
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-400 to-red-600">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-orange-600">
              The Container BURGER - Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Contraseña de Administrador</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="mt-2"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-orange-500 hover:bg-orange-600">
              Ingresar al Panel
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Volver al Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Sistema
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/orders")}
              className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            >
              <Bell className="mr-2 h-4 w-4" />
              Ver Órdenes
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white border-red-500"
            >
              Cerrar Sesión
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white">Panel de Administración - The Container BURGER</h1>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTodaysSales().length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos de Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(getTodaysRevenue())}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promotions.filter((p) => p.isActive).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPendingOrders()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Base de Caja</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(cashBase)}</div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => setShowCashBaseDialog(true)}
              >
                Editar Base
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="promotions">Promociones</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestión de Productos</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nombre del Producto *</Label>
                            <Input
                              id="name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              placeholder="Ej: Hamburguesa Clásica"
                            />
                          </div>
                          <div>
                            <Label htmlFor="price">Precio (COP) *</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                              placeholder="Ej: 15000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Categoría *</Label>
                            <Select
                              value={newProduct.category}
                              onValueChange={(value) =>
                                setNewProduct({ ...newProduct, category: value, subcategory: "" })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="food">Comida</SelectItem>
                                <SelectItem value="drinks">Bebidas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {newProduct.category === "food" && (
                            <div>
                              <Label htmlFor="subcategory">Subcategoría</Label>
                              <Select
                                value={newProduct.subcategory}
                                onValueChange={(value) => setNewProduct({ ...newProduct, subcategory: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una subcategoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getSubcategoryOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                              id="description"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              placeholder="Describe el producto..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="specifications">Especificaciones</Label>
                            <Textarea
                              id="specifications"
                              value={newProduct.specifications}
                              onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                              placeholder="Ingredientes, peso, etc..."
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="image">Imagen del Producto</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "product")}
                                className="flex-1"
                              />
                              <Button type="button" variant="outline" size="icon" title="Subir imagen">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
                            {newProduct.image && newProduct.image !== "/placeholder.svg" && (
                              <div className="mt-3">
                                <Label>Vista previa:</Label>
                                <div className="mt-2 w-32 h-32 border rounded-lg overflow-hidden">
                                  <img
                                    src={newProduct.image || "/placeholder.svg"}
                                    alt="Vista previa"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 bg-transparent"
                                  onClick={() => setNewProduct({ ...newProduct, image: "/placeholder.svg" })}
                                >
                                  Quitar imagen
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleAddProduct} className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                        Agregar Producto
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.category} {product.subcategory && `- ${product.subcategory}`}
                            </p>
                            {product.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-2">
                            <Button size="icon" variant="outline" onClick={() => setEditingProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestión de Promociones</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Promoción
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Nueva Promoción</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="promo-title">Título de la Promoción *</Label>
                          <Input
                            id="promo-title"
                            value={newPromotion.title}
                            onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                            placeholder="Ej: Hamburguesa Maxi Queso"
                          />
                        </div>
                        <div>
                          <Label htmlFor="promo-description">Descripción *</Label>
                          <Textarea
                            id="promo-description"
                            value={newPromotion.description}
                            onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                            placeholder="Describe la promoción..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="promo-discount">Descuento *</Label>
                          <Input
                            id="promo-discount"
                            value={newPromotion.discount}
                            onChange={(e) => setNewPromotion({ ...newPromotion, discount: e.target.value })}
                            placeholder="Ej: 25% OFF"
                          />
                        </div>
                        <div>
                          <Label htmlFor="promo-valid">Válido hasta *</Label>
                          <Input
                            id="promo-valid"
                            type="date"
                            value={newPromotion.validUntil}
                            onChange={(e) => setNewPromotion({ ...newPromotion, validUntil: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="promo-image">Imagen de la Promoción</Label>
                          <Input
                            id="promo-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "promotion")}
                          />
                          <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
                        </div>
                        <Button onClick={handleAddPromotion} className="w-full bg-orange-500 hover:bg-orange-600">
                          Agregar Promoción
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {promotions.map((promotion) => (
                    <Card key={promotion.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{promotion.title}</h3>
                            <p className="text-sm text-muted-foreground">{promotion.discount}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{promotion.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Válido hasta: {new Date(promotion.validUntil).toLocaleDateString("es-CO")}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                promotion.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {promotion.isActive ? "Activa" : "Inactiva"}
                            </span>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <Button size="icon" variant="outline" onClick={() => handleDeletePromotion(promotion.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sales
                    .slice(-15)
                    .reverse()
                    .map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">Venta #{sale.invoiceNumber || sale.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.date).toLocaleString("es-CO")} - {sale.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(sale.total)}</p>
                          <p className="text-sm text-muted-foreground">{sale.items.length} productos</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Facturas Electrónicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay facturas generadas</p>
                  ) : (
                    invoices
                      .slice(-20)
                      .reverse()
                      .map((invoice) => (
                        <div key={invoice.invoiceNumber} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">Factura #{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Cliente: {invoice.customer.name} - {invoice.customer.phone}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(invoice.date).toLocaleString("es-CO")} - {invoice.paymentMethod}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="font-medium">{formatPrice(invoice.total)}</p>
                              <p className="text-sm text-muted-foreground">{invoice.items.length} productos</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => resendInvoiceWhatsApp(invoice)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Producto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nombre</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Precio (COP)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Descripción</Label>
                    <Textarea
                      id="edit-description"
                      value={editingProduct.description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-specifications">Especificaciones</Label>
                    <Textarea
                      id="edit-specifications"
                      value={editingProduct.specifications || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, specifications: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-image">Cambiar Imagen</Label>
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "product", true)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
                    {editingProduct.image && editingProduct.image !== "/placeholder.svg" && (
                      <div className="mt-3">
                        <Label>Vista previa:</Label>
                        <div className="mt-2 w-32 h-32 border rounded-lg overflow-hidden">
                          <img
                            src={editingProduct.image || "/placeholder.svg"}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() => setEditingProduct({ ...editingProduct, image: "/placeholder.svg" })}
                        >
                          Quitar imagen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleEditProduct(editingProduct)}
                className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
              >
                Guardar Cambios
              </Button>
            </DialogContent>
          </Dialog>
        )}

        {/* Cash Base Dialog */}
        {showCashBaseDialog && (
          <Dialog open={showCashBaseDialog} onOpenChange={() => setShowCashBaseDialog(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Base de Caja</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Base actual: {formatPrice(cashBase)}</Label>
                </div>
                <div>
                  <Label htmlFor="newCashBase">Nueva base (COP)</Label>
                  <Input
                    id="newCashBase"
                    type="number"
                    value={newCashBase}
                    onChange={(e) => setNewCashBase(e.target.value)}
                    placeholder="Ej: 100000"
                  />
                </div>
                <div>
                  <Label htmlFor="cashBasePassword">Contraseña del dueño</Label>
                  <Input
                    id="cashBasePassword"
                    type="password"
                    value={cashBasePassword}
                    onChange={(e) => setCashBasePassword(e.target.value)}
                    placeholder="Contraseña requerida"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateCashBase} className="bg-orange-500 hover:bg-orange-600">
                    Actualizar Base
                  </Button>
                  <Button variant="outline" onClick={() => setShowCashBaseDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

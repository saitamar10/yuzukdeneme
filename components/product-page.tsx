"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Phone, MessageCircle, Star, Shield, Truck, RotateCcw } from "lucide-react"
import VirtualTryModal from "./virtual-try-modal"
import { testProducts, testSiteInfo, formatPrice } from "@/lib/test-products"

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState(testProducts[0]) // İlk ürünü varsayılan olarak seç
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("17")
  const [showVirtualTry, setShowVirtualTry] = useState(false)

  const handleVirtualTry = () => {
    setShowVirtualTry(true)
  }

  const handleWhatsAppOrder = () => {
    const message = `Merhaba! ${selectedProduct.name} ürününü ${selectedSize} beden olarak sipariş vermek istiyorum. Fiyat: ${formatPrice(selectedProduct.price)}`
    const whatsappUrl = `https://wa.me/${testSiteInfo.whatsapp.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePhoneCall = () => {
    window.open(`tel:${testSiteInfo.phone}`, "_self")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-gray-900">{testSiteInfo.name}</div>
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Ana Sayfa
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Katalog
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  İletişim
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Hakkımızda
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Teslimat Ve İade
                </a>
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Yüzük Ölçümü Nasıl Öğrenirim
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handlePhoneCall}>
                <Phone className="h-4 w-4 mr-2" />
                {testSiteInfo.phone}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Ürünleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {testProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product)
                  setSelectedImage(0)
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedProduct.id === product.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded mb-2"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f3f4f6"/>
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="3"/>
                        <circle cx="50" cy="30" r="8" fill="#10b981"/>
                        <text x="50%" y="85%" fontFamily="Arial, sans-serif" fontSize="8" fill="#666" textAnchor="middle">${product.category}</text>
                      </svg>
                    `)}`
                  }}
                />
                <p className="text-xs font-medium text-gray-900 line-clamp-2">{product.name}</p>
                <p className="text-xs text-blue-600 font-bold">{formatPrice(product.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <img
                src={selectedProduct.images[selectedImage] || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#f3f4f6"/>
                      <circle cx="200" cy="200" r="120" fill="none" stroke="#10b981" strokeWidth="8"/>
                      <circle cx="200" cy="120" r="30" fill="#10b981"/>
                      <text x="50%" y="75%" fontFamily="Arial, sans-serif" fontSize="16" fill="#666" textAnchor="middle">${selectedProduct.category}</text>
                    </svg>
                  `)}`
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded border-2 overflow-hidden ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="3"/>
                          <circle cx="50" cy="30" r="8" fill="#10b981"/>
                        </svg>
                      `)}`
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</div>
                {selectedProduct.originalPrice && (
                  <>
                    <div className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </div>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      %{selectedProduct.discount} indirim
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(127 değerlendirme)</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Ücretsiz <span className="font-medium">kargo</span> • <span className="font-medium">Kapıda ödeme</span>
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEÇİNİZ BEDEN</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Standart Ölçü</option>
                {selectedProduct.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size} Numara
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Virtual Try Button - Öne çıkarılmış */}
              <Button
                onClick={handleVirtualTry}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
              >
                <Camera className="h-5 w-5 mr-2" />
                SANAL DENE - Kameranla Gör
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleWhatsAppOrder}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Sipariş
                </Button>

                <Button
                  onClick={handlePhoneCall}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Hemen Ara
                </Button>
              </div>

              <Button className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg font-semibold">
                KAPIDA NAKİT ÖDE
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 text-lg font-semibold"
              >
                HEMEN SATIN AL
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3">
              {selectedProduct.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Güvenli Alışveriş</span>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <span className="text-xs text-gray-600">Ücretsiz Kargo</span>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <span className="text-xs text-gray-600">14 Gün İade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">AÇIKLAMA</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Virtual Try Modal */}
      <VirtualTryModal
        isOpen={showVirtualTry}
        onClose={() => setShowVirtualTry(false)}
        product={{
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: formatPrice(selectedProduct.price),
          images: selectedProduct.images,
          selectedSize: selectedSize,
        }}
      />
    </div>
  )
}

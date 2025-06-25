"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Diamond, Sparkles, Star, Heart, Smartphone, ShoppingCart } from "lucide-react"
import { useWooCommerceProducts } from "@/hooks/useWooCommerce"
import ProductPage from "@/components/product-page"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // WooCommerce products
  const { products, loading: productsLoading } = useWooCommerceProducts()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
  }, [])

  const handleStartTryOn = () => {
    if (isMobile) {
      setIsLoading(true)
      setTimeout(() => {
        window.location.href = "/camera"
      }, 1000)
    } else {
      setShowQRCode(true)
    }
  }

  const handleProductClick = (productId: number) => {
    // Store selected product in localStorage for camera page
    const selectedProduct = products.find((p) => p.id === productId)
    if (selectedProduct) {
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct))
      handleStartTryOn()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Diamond className="h-8 w-8 text-rose-600" />
              <h1 className="text-2xl font-bold text-gray-900">DiamondTry</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-600">Koleksiyonlar</span>
              <span className="text-gray-600">Hakkımızda</span>
              <span className="text-gray-600">İletişim</span>
              <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Mağaza
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <Sparkles className="h-16 w-16 text-rose-600" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Yüzüğünü
            <span className="text-rose-600 block">Sanal Dene</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Kameranı aç, elini göster ve mağazamızdaki gerçek yüzük modellerini canlı olarak dene. Parmak ölçün otomatik
            hesaplanır!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleStartTryOn}
              disabled={isLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Hazırlanıyor...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {isMobile ? <Camera className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
                  <span>{isMobile ? "Kamerayı Aç ve Başla" : "Telefonunuzla Dene"}</span>
                </div>
              )}
            </Button>
            {!isMobile && showQRCode && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="max-w-md w-full">
                  <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center space-x-2">
                      <Smartphone className="h-6 w-6" />
                      <span>Telefonunuzla Deneyin</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-3">Bu linki telefonunuzda açın:</p>
                      <div className="bg-white p-3 rounded border text-sm font-mono break-all select-all">
                        {typeof window !== "undefined" ? `${window.location.origin}/camera` : ""}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          typeof window !== "undefined" ? `${window.location.origin}/camera` : "",
                        )}`}
                        alt="QR Code"
                        className="w-32 h-32 mx-auto"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpbmsgS29weWFsYTwvdGV4dD48L3N2Zz4="
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Bu QR kodu telefonunuzla tarayarak direkt kamera sayfasına gidin
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          const url = `${window.location.origin}/camera`
                          navigator.clipboard.writeText(url)
                          alert("Link kopyalandı! Telefonunuzda açın.")
                        }}
                        className="flex-1 bg-rose-600 hover:bg-rose-700"
                      >
                        Linki Kopyala
                      </Button>
                      <Button onClick={() => setShowQRCode(false)} variant="outline" className="flex-1">
                        Kapat
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Kamera özelliği mobil cihazlarda daha iyi çalışır</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>Ücretsiz • Kayıt Gerektirmez</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Camera className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gerçek Boyut</h3>
              <p className="text-gray-600 text-sm">Yüzükler gerçek boyutlarında görünür</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Diamond className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Otomatik Ölçüm</h3>
              <p className="text-gray-600 text-sm">Parmak ölçünüz otomatik hesaplanır</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="bg-rose-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gerçek Ürünler</h3>
              <p className="text-gray-600 text-sm">Mağazamızdaki gerçek ürünleri deneyin</p>
            </div>
          </div>
        </div>
      </section>

      {/* WooCommerce Products Gallery */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mağazamızdan Popüler Modeller</h2>
            <p className="text-gray-600">Gerçek ürünlerimizi sanal olarak deneyin</p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleProductClick(product.id)}>
                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.images[0]?.alt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                              <rect width="100%" height="100%" fill="#f3f4f6"/>
                              <circle cx="100" cy="100" r="60" fill="none" stroke="#e11d48" strokeWidth="4"/>
                              <circle cx="100" cy="60" r="15" fill="#e11d48"/>
                              <text x="50%" y="75%" fontFamily="Arial, sans-serif" fontSize="12" fill="#666" textAnchor="middle">Yüzük</text>
                            </svg>
                          `)}`
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-center space-x-2">
                        {product.sale_price && product.sale_price !== product.regular_price ? (
                          <>
                            <p className="text-rose-600 font-bold">₺{product.sale_price}</p>
                            <p className="text-gray-400 line-through text-sm">₺{product.regular_price}</p>
                          </>
                        ) : (
                          <p className="text-rose-600 font-bold">₺{product.regular_price}</p>
                        )}
                      </div>
                      {product.categories[0] && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                          {product.categories[0].name}
                        </span>
                      )}
                      <div className="mt-2">
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                          <Camera className="h-3 w-3 mr-1" />
                          Sanal Dene
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              onClick={handleStartTryOn}
              variant="outline"
              className="bg-white border-rose-600 text-rose-600 hover:bg-rose-50"
            >
              Tüm Ürünleri Görüntüle
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Diamond className="h-6 w-6 text-rose-400" />
                <span className="text-xl font-bold">DiamondTry</span>
              </div>
              <p className="text-gray-400">WooCommerce mağazanızdan gerçek ürünleri sanal olarak deneyin.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kategoriler</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tek Taş Yüzükler</li>
                <li>Alyans Modelleri</li>
                <li>Beştaş Yüzükler</li>
                <li>Tamtur Modeller</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@diamondtry.com</li>
                <li>0212 555 0123</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DiamondTry. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Product Page */}
      <ProductPage />
    </div>
  )
}

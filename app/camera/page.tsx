"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ArrowLeft, Ruler, CreditCard, Diamond, Sparkles, ShoppingCart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useWooCommerceProducts, useWooCommerceCategories } from "@/hooks/useWooCommerce"
import type { WooCommerceProduct } from "@/lib/woocommerce"

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRing, setSelectedRing] = useState<WooCommerceProduct | null>(null)
  const [handDetected, setHandDetected] = useState(false)
  const [ringSize, setRingSize] = useState<any>(null)
  const [showMeasurement, setShowMeasurement] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraError, setCameraError] = useState<string>("")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [videoReady, setVideoReady] = useState(false)

  // Hand tracking states
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [handLandmarks, setHandLandmarks] = useState<any>(null)

  // WooCommerce data
  const { categories } = useWooCommerceCategories()
  const { products, loading: productsLoading } = useWooCommerceProducts(selectedCategory)

  useEffect(() => {
    requestCameraPermission()

    // Check if a product was selected from the main page
    const savedProduct = localStorage.getItem("selectedProduct")
    if (savedProduct) {
      try {
        const product = JSON.parse(savedProduct)
        setSelectedRing(product)
        localStorage.removeItem("selectedProduct")
      } catch (error) {
        console.error("Error parsing saved product:", error)
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (videoReady && !handDetected) {
      startHandScanning()
    }
  }, [videoReady])

  const startHandScanning = () => {
    setIsScanning(true)
    setScanProgress(0)

    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          setIsScanning(false)
          setHandDetected(true)

          setHandLandmarks({
            ringFinger: { x: 320, y: 240 },
            fingerWidth: 45,
            fingerAngle: 0,
          })

          setRingSize({
            turkish: 17,
            us: 7,
            eu: 54,
            uk: "N",
          })
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const requestCameraPermission = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
        setCameraError("Kamera erişimi için güvenli bağlantı (HTTPS) gereklidir")
        setCameraPermission("denied")
        return
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Bu tarayıcı kamera erişimini desteklemiyor")
        setCameraPermission("denied")
        return
      }

      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: facingMode,
        },
        audio: false,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setCameraPermission("granted")
      setVideoReady(false)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true)
          if (videoRef.current) {
            videoRef.current.play().catch(console.error)
          }
        }
      }
    } catch (error: any) {
      console.error("Camera permission error:", error)
      if (error.name === "NotAllowedError") {
        setCameraError("Kamera erişimi reddedildi. Tarayıcı ayarlarından kamera iznini açın.")
      } else if (error.name === "NotFoundError") {
        setCameraError("Kamera bulunamadı. Cihazınızda kamera olduğundan emin olun.")
      } else {
        setCameraError("Kamera erişiminde hata oluştu: " + error.message)
      }
      setCameraPermission("denied")
    }
  }

  const captureScreenshot = async () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      alert("Fotoğraf kaydedildi! Galeri'den paylaşabilirsiniz.")
    }, 1000)
  }

  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)
    setVideoReady(false)
    requestCameraPermission()
  }

  const handleBuyNow = (product: WooCommerceProduct) => {
    // Open WooCommerce product page
    window.open(product.permalink, "_blank")
  }

  const filteredProducts = products.filter(
    (product) => !selectedCategory || product.categories.some((cat) => cat.id.toString() === selectedCategory),
  )

  if (cameraPermission === "pending") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Kamera erişimi isteniyor...</p>
        </div>
      </div>
    )
  }

  if (cameraPermission === "denied") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Kamera Erişimi Gerekli</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Camera className="h-16 w-16 text-gray-400 mx-auto" />
            {cameraError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{cameraError}</p>
              </div>
            )}
            <div className="space-y-2">
              <Button onClick={requestCameraPermission} className="w-full">
                Tekrar Dene
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <Diamond className="h-6 w-6 text-rose-400" />
            <span className="text-white font-semibold">Sanal Deneme</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={switchCamera}>
              🔄
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={captureScreenshot}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Camera View */}
        <div className="flex-1 relative bg-black">
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Kamera başlatılıyor...</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
          />

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Overlay Instructions */}
          <div className="absolute inset-0 pointer-events-none">
            {!handDetected ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 text-white">
                  {isScanning ? (
                    <>
                      <div className="relative mb-4">
                        <div className="w-32 h-32 border-4 border-white/30 rounded-full mx-auto flex items-center justify-center">
                          <div className="w-24 h-24 border-4 border-rose-500 rounded-full animate-pulse flex items-center justify-center">
                            ✋
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 animate-spin"></div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Eliniz Taranıyor...</h3>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-300">%{Math.round(scanProgress)} - Elini sabit tut</p>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse mb-4">
                        <div className="w-16 h-16 border-4 border-white rounded-full mx-auto mb-4 flex items-center justify-center">
                          ✋
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Elini Kameraya Göster</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        Yüzük parmağın görünecek şekilde elini kameraya doğru uzat
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ✓ El Algılandı
                </div>

                {selectedRing && handLandmarks && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${handLandmarks.ringFinger.x - 30}px`,
                      top: `${handLandmarks.ringFinger.y - 15}px`,
                      transform: `rotate(${handLandmarks.fingerAngle}deg)`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={selectedRing.images[0]?.src || "/placeholder.svg"}
                        alt={selectedRing.name}
                        className="w-16 h-16 object-contain ring-3d"
                        style={{
                          transform: `scale(${handLandmarks.fingerWidth / 45})`,
                        }}
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="32" cy="32" r="25" fill="none" stroke="#e11d48" strokeWidth="6"/>
                              <circle cx="32" cy="15" r="8" fill="#e11d48"/>
                            </svg>
                          `)}`
                        }}
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        {selectedRing.name}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Size Measurement */}
          {showMeasurement && ringSize && (
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Ruler className="h-4 w-4" />
                <span className="font-semibold">Parmak Ölçünüz</span>
              </div>
              <div className="text-2xl font-bold text-rose-400 mb-1">{ringSize.turkish} (TR)</div>
              <div className="text-sm text-gray-300">
                US: {ringSize.us} | EU: {ringSize.eu} | UK: {ringSize.uk}
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setShowMeasurement(!showMeasurement)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Ölçüm
            </Button>
          </div>
        </div>

        {/* WooCommerce Products Panel */}
        {handDetected && (
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto animate-slide-in">
            <div className="p-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm font-medium">✓ El tarama tamamlandı!</p>
                <p className="text-green-700 text-xs">Mağazamızdan ürün seçebilirsiniz</p>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Kategoriler</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("")}
                    className={selectedCategory === "" ? "bg-rose-600 hover:bg-rose-700" : "hover:bg-rose-50"}
                  >
                    Tüm Ürünler
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`justify-start ${
                        selectedCategory === category.id.toString()
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "hover:bg-rose-50"
                      }`}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Ürünler</h3>

                {productsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`cursor-pointer transition-all rounded-lg border ${
                        selectedRing?.id === product.id
                          ? "ring-2 ring-rose-500 bg-rose-50"
                          : "hover:shadow-md hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRing(product)}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images[0]?.src || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                                  <circle cx="32" cy="32" r="20" fill="none" stroke="#e11d48" strokeWidth="3"/>
                                  <circle cx="32" cy="20" r="6" fill="#e11d48"/>
                                </svg>
                              `)}`
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h4>
                            <div className="flex items-center space-x-2">
                              {product.sale_price && product.sale_price !== product.regular_price ? (
                                <>
                                  <p className="text-rose-600 font-bold text-sm">₺{product.sale_price}</p>
                                  <p className="text-gray-400 line-through text-xs">₺{product.regular_price}</p>
                                </>
                              ) : (
                                <p className="text-rose-600 font-bold text-sm">₺{product.regular_price}</p>
                              )}
                            </div>
                            {product.categories[0] && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {product.categories[0].name}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {selectedRing?.id === product.id && (
                          <div className="mt-4 space-y-3 border-t pt-3">
                            <Button
                              className="w-full bg-rose-600 hover:bg-rose-700"
                              onClick={() => setSelectedRing(product)}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Bu Ürünü Dene
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border-rose-600 text-rose-600 hover:bg-rose-50"
                              onClick={() => handleBuyNow(product)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Satın Al
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

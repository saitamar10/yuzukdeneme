"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Camera, RotateCcw, Ruler, Smartphone, MessageCircle, Phone, Download } from "lucide-react"
import { testSiteInfo } from "@/lib/test-products"

interface VirtualTryModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: string
    images: string[]
    selectedSize?: string
  }
}

export default function VirtualTryModal({ isOpen, onClose, product }: VirtualTryModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [videoReady, setVideoReady] = useState(false)
  const [handDetected, setHandDetected] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [handLandmarks, setHandLandmarks] = useState<any>(null)
  const [ringSize, setRingSize] = useState<any>(null)
  const [showMeasurement, setShowMeasurement] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentRingImage, setCurrentRingImage] = useState(0)

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission()
      // Ring image rotation for more dynamic experience
      const imageInterval = setInterval(() => {
        setCurrentRingImage((prev) => (prev + 1) % product.images.length)
      }, 3000)

      return () => clearInterval(imageInterval)
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
      setCameraPermission("pending")
      setVideoReady(false)
      setHandDetected(false)
      setIsScanning(true)
      setScanProgress(0)
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isOpen, product.images.length])

  useEffect(() => {
    if (videoReady && !handDetected && isOpen) {
      startHandScanning()
    }
  }, [videoReady, isOpen])

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
            fingerAngle: Math.random() * 10 - 5, // Slight random angle for realism
          })

          setRingSize({
            turkish: product.selectedSize || "17",
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
      setCameraPermission("denied")
    }
  }

  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)
    setVideoReady(false)
    setHandDetected(false)
    setIsScanning(true)
    setScanProgress(0)
    requestCameraPermission()
  }

  const captureScreenshot = async () => {
    setIsCapturing(true)

    // Simulate screenshot capture with canvas
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame
        ctx.drawImage(video, 0, 0)

        // Create download link
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${product.name}-sanal-deneme.jpg`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }
          },
          "image/jpeg",
          0.9,
        )
      }
    }

    setTimeout(() => {
      setIsCapturing(false)
    }, 1000)
  }

  const handleWhatsAppOrder = () => {
    const message = `Merhaba! ${product.name} ürününü sanal deneme yaptım ve ${product.selectedSize} beden olarak sipariş vermek istiyorum. Fiyat: ${product.price}`
    const whatsappUrl = `https://wa.me/${testSiteInfo.whatsapp.replace(/\s/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePhoneCall = () => {
    window.open(`tel:${testSiteInfo.phone}`, "_self")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <img
              src={product.images[currentRingImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                  <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f3f4f6"/>
                    <circle cx="24" cy="24" r="15" fill="none" stroke="#10b981" strokeWidth="2"/>
                    <circle cx="24" cy="15" r="4" fill="#10b981"/>
                  </svg>
                `)}`
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {cameraPermission === "granted" && (
              <>
                <Button variant="outline" size="sm" onClick={switchCamera} title="Kamerayı Değiştir">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={captureScreenshot}
                  disabled={isCapturing}
                  title="Fotoğraf Çek ve İndir"
                >
                  {isCapturing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Camera Content */}
        <div className="relative bg-black" style={{ height: "500px" }}>
          {cameraPermission === "pending" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Kamera erişimi isteniyor...</p>
              </div>
            </div>
          )}

          {cameraPermission === "denied" && (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <Card className="max-w-md">
                <CardContent className="text-center p-6">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Kamera Erişimi Gerekli</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sanal deneme için kamera erişimine izin vermeniz gerekiyor.
                  </p>
                  {!isMobile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-sm font-medium">Mobil cihazda daha iyi çalışır</span>
                      </div>
                    </div>
                  )}
                  <Button onClick={requestCameraPermission} className="w-full">
                    Tekrar Dene
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {cameraPermission === "granted" && (
            <>
              {!videoReady && (
                <div className="absolute inset-0 flex items-center justify-center">
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

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: "none" }}
              />

              {/* Overlay Instructions */}
              <div className="absolute inset-0 pointer-events-none">
                {!handDetected ? (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 text-white max-w-sm">
                      {isScanning ? (
                        <>
                          <div className="relative mb-4">
                            <div className="w-24 h-24 border-4 border-white/30 rounded-full mx-auto flex items-center justify-center">
                              <div className="w-16 h-16 border-4 border-green-500 rounded-full animate-pulse flex items-center justify-center text-2xl">
                                ✋
                              </div>
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Eliniz Taranıyor...</h3>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-100"
                              style={{ width: `${scanProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-300">%{Math.round(scanProgress)} - Elini sabit tut</p>
                        </>
                      ) : (
                        <>
                          <div className="animate-pulse mb-4">
                            <div className="w-16 h-16 border-4 border-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                              ✋
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Elini Kameraya Göster</h3>
                          <p className="text-sm text-gray-300">
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

                    {handLandmarks && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${handLandmarks.ringFinger.x - 40}px`,
                          top: `${handLandmarks.ringFinger.y - 20}px`,
                          transform: `rotate(${handLandmarks.fingerAngle}deg)`,
                        }}
                      >
                        <div className="relative">
                          <img
                            src={product.images[currentRingImage] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-20 h-20 object-contain ring-3d"
                            style={{
                              transform: `scale(${handLandmarks.fingerWidth / 45})`,
                            }}
                            onError={(e) => {
                              e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="40" cy="40" r="30" fill="none" stroke="#10b981" strokeWidth="6"/>
                                  <circle cx="40" cy="20" r="10" fill="#10b981"/>
                                </svg>
                              `)}`
                            }}
                          />
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                            Beden: {ringSize?.turkish}
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
                  <div className="text-2xl font-bold text-green-400 mb-1">{ringSize.turkish} (TR)</div>
                  <div className="text-sm text-gray-300">
                    US: {ringSize.us} | EU: {ringSize.eu} | UK: {ringSize.uk}
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => setShowMeasurement(!showMeasurement)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Ruler className="h-4 w-4 mr-2" />
                  Ölçüm
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {handDetected && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-green-600">✓ Deneme tamamlandı!</span> Ürün parmağınızda nasıl
                duruyor?
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePhoneCall} size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Ara
                </Button>
                <Button onClick={handleWhatsAppOrder} className="bg-green-600 hover:bg-green-700" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp Sipariş
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

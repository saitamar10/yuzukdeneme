"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ArrowLeft, Ruler, CreditCard, Diamond, Sparkles, ShoppingCart, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useWooCommerceProducts, useWooCommerceCategories } from "@/hooks/useWooCommerce"
import type { WooCommerceProduct } from "@/lib/woocommerce"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

// El takip modelini ve diğer yardımcıları tanımla
let handLandmarker: HandLandmarker | undefined = undefined;
let lastVideoTime = -1;
let animationFrameId: number;

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRing, setSelectedRing] = useState<WooCommerceProduct | null>(null)
  const [handDetected, setHandDetected] = useState(false)
  const [cameraError, setCameraError] = useState<string>("")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [videoReady, setVideoReady] = useState(false)
  const [handLandmarks, setHandLandmarks] = useState<any>(null)
  const [loadingModel, setLoadingModel] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  // WooCommerce data
  const { categories } = useWooCommerceCategories()
  const { products, loading: productsLoading } = useWooCommerceProducts(selectedCategory)

  // MediaPipe el takip modelini oluşturma ve yükleme
  useEffect(() => {
    async function createHandLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `/hand_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        setLoadingModel(false);
        console.log("HandLandmarker modeli başarıyla yüklendi.");
      } catch (error) {
        console.error("HandLandmarker modeli yüklenemedi:", error);
        setCameraError("El takip modeli yüklenemedi. Lütfen sayfayı yenileyin.");
      }
    }
    createHandLandmarker();

    return () => {
        cancelAnimationFrame(animationFrameId);
        if (handLandmarker) {
            handLandmarker.close();
        }
    }
  }, []);

  // Gerçek zamanlı parmak takibi
  const predictWebcam = useCallback(() => {
    if (!videoRef.current || !handLandmarker || !videoReady) {
      return;
    }

    const video = videoRef.current;
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const results = handLandmarker.detectForVideo(video, performance.now());

      if (results.landmarks && results.landmarks.length > 0) {
        setHandDetected(true);
        const landmarks = results.landmarks[0];
        const ringFingerPip = landmarks[14];
        const ringFingerMcp = landmarks[13];
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        const x = ringFingerPip.x * videoWidth;
        const y = ringFingerPip.y * videoHeight;

        const dx = ringFingerPip.x - ringFingerMcp.x;
        const dy = ringFingerPip.y - ringFingerMcp.y;
        
        const fingerWidth = Math.sqrt(dx * dx + dy * dy) * videoWidth * 3.5;
        const fingerAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        setHandLandmarks({
          ringFinger: { x, y },
          fingerWidth: fingerWidth,
          fingerAngle: fingerAngle,
        });
      } else {
        setHandDetected(false);
        setHandLandmarks(null);
      }
    }
    animationFrameId = window.requestAnimationFrame(predictWebcam);
  }, [videoReady]);

  useEffect(() => {
    if (!loadingModel && cameraPermission === 'granted' && videoReady) {
      predictWebcam();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  }, [loadingModel, cameraPermission, videoReady, predictWebcam]);


  const requestCameraPermission = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode,
        },
      });
      setStream(mediaStream);
      setCameraPermission("granted");
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadeddata = () => setVideoReady(true);
      }
    } catch (err: any) {
      console.error("Kamera Hatası:", err);
      setCameraError(err.name === "NotAllowedError" ? "Kamera izni reddedildi." : "Kamera bulunamadı veya bir hata oluştu.");
      setCameraPermission("denied");
    }
  }, [stream, facingMode]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  useEffect(() => {
    if (products.length > 0 && !selectedRing) {
      setSelectedRing(products[0]);
    }
  }, [products, selectedRing]);

  useEffect(() => {
    if (!carouselApi) {
      return
    }
    carouselApi.on("select", () => {
        const selectedIndex = carouselApi.selectedScrollSnap();
        setSelectedRing(filteredProducts[selectedIndex]);
    })
  }, [carouselApi, filteredProducts])

  // Diğer fonksiyonlar
  const switchCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
  };
  
  const handleBuyNow = (product: WooCommerceProduct) => window.open(product.permalink, "_blank");

  const filteredProducts = products.filter(
    (product) => !selectedCategory || product.categories.some((cat) => cat.id.toString() === selectedCategory),
  )

  if (loadingModel || cameraPermission === "pending") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{loadingModel ? "Sanal deneme motoru yükleniyor..." : "Kamera erişimi bekleniyor..."}</p>
        </div>
      </div>
    );
  }

  if (cameraPermission === "denied") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader><CardTitle className="text-center">Kamera Erişimi Gerekli</CardTitle></CardHeader>
          <CardContent className="text-center space-y-4">
            <Camera className="h-16 w-16 text-gray-400 mx-auto" />
            <p className="text-red-600">{cameraError}</p>
            <Button onClick={requestCameraPermission} className="w-full">İzin Vermeyi Tekrar Dene</Button>
            <Link href="/"><Button variant="outline" className="w-full">Ana Sayfaya Dön</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4 mr-2" />Geri</Button></Link>
          <div className="flex items-center space-x-2"><Diamond className="h-6 w-6 text-rose-400" /><span className="text-white font-semibold">Sanal Deneme</span></div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={switchCamera}>🔄</Button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <div className="flex-1 relative bg-black">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`} />
          <div className="absolute inset-0 pointer-events-none">
            {!handDetected && (<div className="absolute inset-0 flex items-center justify-center"><div className="bg-black/70 p-6 rounded-lg text-white text-center"><div className="animate-pulse">✋</div>Elini göster</div></div>)}
            {handDetected && (
              <>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">✓ El Algılandı</div>
                {selectedRing && handLandmarks && (
                  <div
                    className="absolute pointer-events-none transition-all duration-100 ease-linear"
                    style={{
                      left: `${handLandmarks.ringFinger.x}px`,
                      top: `${handLandmarks.ringFinger.y}px`,
                      width: `${handLandmarks.fingerWidth}px`,
                      height: `${handLandmarks.fingerWidth}px`,
                      transform: `translate(-50%, -50%) rotate(${handLandmarks.fingerAngle}deg)`,
                    }}
                  >
                    <img
                      src={selectedRing.images[0]?.src || "/placeholder.svg"}
                      alt={selectedRing.name}
                      className="w-full h-full object-contain ring-3d"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-96 bg-white border-l overflow-y-auto p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm font-medium">✨ Parmağınıza en uygun yüzüğü bulun!</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Kategoriler</h3>
            {/* Kategori Butonları */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Ürünler</h3>
            {productsLoading ? (
              <p>Yükleniyor...</p>
            ) : (
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {filteredProducts.map((product) => (
                    <CarouselItem key={product.id}>
                      <div className="p-1">
                        <Card className={selectedRing?.id === product.id ? "border-rose-500" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <img src={product.images[0]?.src} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                                <p className="text-rose-600 font-bold text-sm">₺{product.price}</p>
                              </div>
                            </div>
                            {selectedRing?.id === product.id && (
                               <div className="mt-4 space-y-2 border-t pt-3">
                                  <Button className="w-full bg-rose-600 hover:bg-rose-700" onClick={() => setSelectedRing(product)}><Sparkles className="h-4 w-4 mr-2"/>Bu Ürünü Dene</Button>
                                  <Button variant="outline" className="w-full" onClick={() => handleBuyNow(product)}><ShoppingCart className="h-4 w-4 mr-2" />Satın Al</Button>
                               </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

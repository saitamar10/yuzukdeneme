"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function MobileRedirectPage() {
  useEffect(() => {
    // Auto redirect to camera on mobile after 3 seconds
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      const timer = setTimeout(() => {
        window.location.href = "/camera"
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const installPWA = () => {
    // PWA install prompt would be handled here
    alert("Tarayıcınızın menüsünden 'Ana ekrana ekle' seçeneğini kullanın")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-rose-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
            <Smartphone className="h-8 w-8 text-rose-600" />
          </div>
          <CardTitle>Mobil Deneyim İçin Hazır!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p className="mb-4">Kamera özelliği mobil cihazlarda en iyi şekilde çalışır.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-800 text-sm">✓ Mobil cihaz algılandı - 3 saniye içinde yönlendirileceksiniz</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/camera">
              <Button className="w-full bg-rose-600 hover:bg-rose-700">Hemen Başla</Button>
            </Link>

            <Button onClick={installPWA} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Ana Ekrana Ekle
            </Button>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "DiamondTry",
                    text: "Sanal yüzük deneme uygulaması",
                    url: window.location.origin,
                  })
                }
              }}
              variant="outline"
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Arkadaşlarınla Paylaş
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">En iyi deneyim için Chrome veya Safari kullanın</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Test amaçlı gerçek mücevher sitesi ürünleri
export interface TestProduct {
  id: string
  name: string
  price: string
  originalPrice?: string
  discount?: string
  images: string[]
  category: string
  description: string
  sizes: string[]
  features: string[]
}

// Gerçek mücevher sitelerinden test ürünleri
export const testProducts: TestProduct[] = [
  {
    id: "erkek-yuzuk-1",
    name: "Yeşil Zirkon Taşlı Erkek Yüzük",
    price: "1,599.90",
    originalPrice: "2,499.90",
    discount: "36",
    images: [
      "https://cdn.dsmcdn.com/ty1063/product/media/images/prod/QC/20240101/14/c8b8a8f1-7c8a-3c5a-8b2a-1d4e5f6a7b8c/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1064/product/media/images/prod/QC/20240101/14/c8b8a8f1-7c8a-3c5a-8b2a-1d4e5f6a7b8c/2_org_zoom.jpg",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Erkek Yüzük",
    description:
      "925 ayar gümüş üzerine altın kaplama, yeşil zirkon taşlı erkek yüzüğü. El işçiliği ile özenle hazırlanmış, kaliteli ve şık tasarım.",
    sizes: ["15", "16", "17", "18", "19", "20", "21", "22"],
    features: ["925 Ayar Gümüş", "Altın Kaplama", "Yeşil Zirkon Taş", "El İşçiliği", "Garantili"],
  },
  {
    id: "pırlanta-yuzuk-1",
    name: "Pırlanta Montür Tek Taş Yüzük",
    price: "3,299.00",
    originalPrice: "4,500.00",
    discount: "27",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Tek Taş",
    description:
      "0.25 karat pırlanta montür tek taş yüzük. 14 ayar altın üzerine özenle işlenmiş, klasik ve zarif tasarım.",
    sizes: ["13", "14", "15", "16", "17", "18", "19"],
    features: ["14 Ayar Altın", "0.25 Karat Pırlanta", "Sertifikalı Taş", "Klasik Tasarım", "Garantili"],
  },
  {
    id: "alyans-1",
    name: "Altın Alyans Çifti",
    price: "2,850.00",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Alyans",
    description:
      "14 ayar altın alyans çifti. Mat ve parlak yüzey seçenekleri ile klasik tasarım. Evlilik için ideal seçim.",
    sizes: ["13", "14", "15", "16", "17", "18", "19", "20"],
    features: ["14 Ayar Altın", "Çift Alyans", "Mat/Parlak Seçenek", "Klasik Tasarım", "Garantili"],
  },
  {
    id: "bestas-yuzuk-1",
    name: "Beştaş Pırlanta Yüzük",
    price: "4,750.00",
    originalPrice: "6,200.00",
    discount: "23",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Beştaş",
    description:
      "Toplam 0.50 karat beştaş pırlanta yüzük. 18 ayar beyaz altın üzerine sıralanmış 5 adet pırlanta ile göz alıcı tasarım.",
    sizes: ["13", "14", "15", "16", "17", "18", "19"],
    features: ["18 Ayar Beyaz Altın", "0.50 Karat Toplam", "5 Adet Pırlanta", "Sertifikalı", "Garantili"],
  },
  {
    id: "tamtur-yuzuk-1",
    name: "Tamtur Pırlanta Yüzük",
    price: "8,900.00",
    originalPrice: "12,500.00",
    discount: "29",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Tamtur",
    description:
      "1.00 karat tamtur pırlanta yüzük. 18 ayar beyaz altın üzerine çevresinde küçük pırlantalarla süslenmiş lüks tasarım.",
    sizes: ["13", "14", "15", "16", "17", "18", "19"],
    features: ["18 Ayar Beyaz Altın", "1.00 Karat Merkez Taş", "Çevre Pırlantalar", "Lüks Tasarım", "Sertifikalı"],
  },
  {
    id: "cocktail-yuzuk-1",
    name: "Cocktail Renkli Taş Yüzük",
    price: "2,150.00",
    images: [
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=400&fit=crop&crop=center",
    ],
    category: "Cocktail",
    description:
      "Renkli doğal taşlarla süslenmiş cocktail yüzük. 925 ayar gümüş üzerine altın kaplama ile modern ve şık tasarım.",
    sizes: ["14", "15", "16", "17", "18", "19"],
    features: ["925 Ayar Gümüş", "Altın Kaplama", "Doğal Renkli Taşlar", "Modern Tasarım", "Garantili"],
  },
]

// Kategoriler
export const testCategories = [
  { id: "all", name: "Tüm Ürünler", icon: "💎" },
  { id: "erkek", name: "Erkek Yüzük", icon: "👨" },
  { id: "tek-tas", name: "Tek Taş", icon: "💎" },
  { id: "alyans", name: "Alyans", icon: "💍" },
  { id: "bestas", name: "Beştaş", icon: "✨" },
  { id: "tamtur", name: "Tamtur", icon: "🌟" },
  { id: "cocktail", name: "Cocktail", icon: "🍸" },
]

// Test sitesi bilgileri
export const testSiteInfo = {
  name: "Mücevher Dünyası",
  description: "Kaliteli mücevher ve yüzük koleksiyonu",
  phone: "+90 555 123 45 67",
  whatsapp: "+90 555 123 45 67",
  email: "info@mucevherdunyasi.com",
  address: "İstanbul, Türkiye",
}

// Ürün filtreleme fonksiyonu
export function getProductsByCategory(category: string): TestProduct[] {
  if (category === "all" || !category) {
    return testProducts
  }

  return testProducts.filter(
    (product) =>
      product.category.toLowerCase().includes(category.toLowerCase()) ||
      product.name.toLowerCase().includes(category.toLowerCase()),
  )
}

// Tek ürün getirme fonksiyonu
export function getProductById(id: string): TestProduct | undefined {
  return testProducts.find((product) => product.id === id)
}

// Popüler ürünler (indirimli olanlar)
export function getPopularProducts(): TestProduct[] {
  return testProducts.filter((product) => product.discount).slice(0, 6)
}

// Fiyat formatı
export function formatPrice(price: string): string {
  return `${price} TL`
}

// İndirim hesaplama
export function calculateDiscount(originalPrice: string, salePrice: string): number {
  const original = Number.parseFloat(originalPrice.replace(",", "."))
  const sale = Number.parseFloat(salePrice.replace(",", "."))
  return Math.round(((original - sale) / original) * 100)
}

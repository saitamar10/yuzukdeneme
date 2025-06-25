"use client"

import { useState, useEffect } from "react"
import { wooAPI, type WooCommerceProduct } from "@/lib/woocommerce"

export function useWooCommerceProducts(category?: string) {
  const [products, setProducts] = useState<WooCommerceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await wooAPI.getProducts({ category, per_page: 50 })
        setProducts(data)
      } catch (err) {
        setError("Ürünler yüklenirken hata oluştu")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return { products, loading, error }
}

export function useWooCommerceCategories() {
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)
        const data = await wooAPI.getProductCategories()
        // Filter ring categories
        const ringCategories = data.filter(
          (cat) =>
            cat.name.toLowerCase().includes("yüzük") ||
            cat.name.toLowerCase().includes("ring") ||
            cat.name.toLowerCase().includes("alyans") ||
            cat.name.toLowerCase().includes("pırlanta"),
        )
        setCategories(ringCategories)
      } catch (err) {
        setError("Kategoriler yüklenirken hata oluştu")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// WooCommerce API configuration
export interface WooCommerceProduct {
  id: number
  name: string
  price: string
  regular_price: string
  sale_price: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  attributes: Array<{
    id: number
    name: string
    options: string[]
  }>
  meta_data: Array<{
    key: string
    value: string
  }>
  permalink: string
  short_description: string
}

export interface WooCommerceConfig {
  baseURL: string
  consumerKey: string
  consumerSecret: string
}

// WooCommerce API client
export class WooCommerceAPI {
  private config: WooCommerceConfig

  constructor(config: WooCommerceConfig) {
    this.config = config
  }

  private getAuthHeader() {
    const credentials = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`)
    return `Basic ${credentials}`
  }

  async getProducts(
    params: {
      category?: string
      per_page?: number
      page?: number
      search?: string
    } = {},
  ): Promise<WooCommerceProduct[]> {
    try {
      const queryParams = new URLSearchParams({
        per_page: (params.per_page || 20).toString(),
        page: (params.page || 1).toString(),
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search }),
      })

      const response = await fetch(`${this.config.baseURL}/wp-json/wc/v3/products?${queryParams}`, {
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("WooCommerce API error:", error)
      return []
    }
  }

  async getProductCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
    try {
      const response = await fetch(`${this.config.baseURL}/wp-json/wc/v3/products/categories?per_page=100`, {
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("WooCommerce API error:", error)
      return []
    }
  }
}

// Demo configuration - replace with your WooCommerce store details
export const wooCommerceConfig: WooCommerceConfig = {
  baseURL: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://your-store.com",
  consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || "ck_demo",
  consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || "cs_demo",
}

export const wooAPI = new WooCommerceAPI(wooCommerceConfig)

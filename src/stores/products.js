import { defineStore } from 'pinia'
import { ref } from 'vue'

const seedProducts = [
  { id: 'pr1', code: 'SH001', name: '地渡り足場', summary: '仮設足場工事一式', categoryLarge: 'C001', categoryMid: 'M001', unit: '式', sellingPrice: 30000, costPrice: 18000, note: null, createdAt: '2024-01-01' },
  { id: 'pr2', code: 'SH002', name: '外足場工事', summary: '建設外部足場一式', categoryLarge: 'C001', categoryMid: 'M001', unit: '式', sellingPrice: 50000, costPrice: 32000, note: null, createdAt: '2024-01-01' },
  { id: 'pr3', code: 'SH003', name: '掘削工事', summary: '土砂掘削一式', categoryLarge: 'C001', categoryMid: 'M002', unit: 'm3', sellingPrice: 8000, costPrice: 5500, note: null, createdAt: '2024-01-05' },
  { id: 'pr4', code: 'SH004', name: '基礎コンクリート打設', summary: 'コンクリート打設一式', categoryLarge: 'C002', categoryMid: 'M003', unit: 'm3', sellingPrice: 45000, costPrice: 30000, note: null, createdAt: '2024-01-10' },
  { id: 'pr5', code: 'SH005', name: '型枠工事', summary: '型枠組立解体', categoryLarge: 'C002', categoryMid: 'M003', unit: 'm2', sellingPrice: 12000, costPrice: 8000, note: null, createdAt: '2024-02-01' },
]

export const useProductsStore = defineStore('products', () => {
  const products = ref(JSON.parse(localStorage.getItem('mikans_products') || 'null') || seedProducts)

  function save() { localStorage.setItem('mikans_products', JSON.stringify(products.value)) }

  function getProduct(id) { return products.value.find(p => p.id === id) }

  function searchProducts(query) {
    if (!query) return products.value
    const q = query.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.summary || '').toLowerCase().includes(q)
    )
  }

  function createProduct(data) {
    const product = {
      id: `pr${Date.now()}`,
      code: `SH${String(products.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    products.value.push(product)
    save()
    return product
  }

  function updateProduct(id, data) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) { products.value[idx] = { ...products.value[idx], ...data }; save() }
  }

  function deleteProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
    save()
  }

  return { products, getProduct, searchProducts, createProduct, updateProduct, deleteProduct }
})

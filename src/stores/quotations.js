import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── Calculation helpers ──
export function calcItem(item) {
  const qty = parseFloat(item.quantity) || 0
  const sell = parseFloat(item.sellingPrice) || 0
  const cost = parseFloat(item.costPrice) || 0
  const taxRate = parseFloat(item.taxRate) || 0.1

  const subtotalSell = qty * sell
  const taxSell = subtotalSell * taxRate
  const totalSell = subtotalSell + taxSell
  const totalCost = qty * cost
  const grossProfit = subtotalSell - totalCost
  const marginRate = subtotalSell > 0 ? (grossProfit / subtotalSell) * 100 : 0

  return { subtotalSell, taxSell, totalSell, totalCost, grossProfit, marginRate }
}

// ── Seed quotations ──
const seedQuotations = [
  {
    id: 'q1',
    title: 'A社工事 外構工事一式',
    clientName: '株式会社ABC',
    quoteDate: '2024-03-15',
    projectName: 'A社工事',
    status: 'confirmed',
    note: null,
    coverLayout: {},
    items: [
      { id: 'qi1', parentId: null, level: 1, productId: null, name: '仮設工事', description: '', quantity: 1, unit: '式', sellingPrice: 0, costPrice: 0, taxRate: 0.1 },
      { id: 'qi2', parentId: 'qi1', level: 2, productId: 'pr1', name: '地渡り足場', description: '仮設足場工事一式', quantity: 10, unit: '式', sellingPrice: 30000, costPrice: 18000, taxRate: 0.1 },
      { id: 'qi3', parentId: 'qi1', level: 2, productId: 'pr2', name: '外足場工事', description: '建設外部足場一式', quantity: 5, unit: '式', sellingPrice: 50000, costPrice: 32000, taxRate: 0.1 },
    ],
    createdAt: '2024-03-15'
  },
  {
    id: 'q2',
    title: 'XYZ社 基礎工事',
    clientName: '株式会社XYZ',
    quoteDate: '2024-04-01',
    projectName: 'XYZ本社建設',
    status: 'draft',
    note: null,
    coverLayout: {},
    items: [],
    createdAt: '2024-04-01'
  }
]

export const useQuotationsStore = defineStore('quotations', () => {
  const quotations = ref(JSON.parse(localStorage.getItem('mikans_quotations') || 'null') || seedQuotations)
  const settings = ref(JSON.parse(localStorage.getItem('mikans_quote_settings') || 'null') || {
    levels: 2,
    headerFields: [
      { id: 'hf1', label: 'Tên dự án', key: 'projectName', type: 'text' },
      { id: 'hf2', label: 'Tên khách hàng', key: 'clientName', type: 'text' },
      { id: 'hf3', label: 'Ngày báo giá', key: 'quoteDate', type: 'date' },
      { id: 'hf4', label: 'Tiêu đề', key: 'title', type: 'text' },
    ]
  })

  function save() { localStorage.setItem('mikans_quotations', JSON.stringify(quotations.value)) }
  function saveSettings() { localStorage.setItem('mikans_quote_settings', JSON.stringify(settings.value)) }

  function getQuotation(id) { return quotations.value.find(q => q.id === id) }

  function createQuotation(data) {
    const q = {
      id: `q${Date.now()}`,
      status: 'draft',
      coverLayout: {},
      items: [],
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    quotations.value.unshift(q)
    save()
    return q
  }

  function updateQuotation(id, data) {
    const idx = quotations.value.findIndex(q => q.id === id)
    if (idx !== -1) {
      quotations.value[idx] = { ...quotations.value[idx], ...data }
      save()
    }
  }

  function deleteQuotation(id) {
    quotations.value = quotations.value.filter(q => q.id !== id)
    save()
  }

  // Items
  function addItem(quotationId, itemData, afterId = null) {
    const q = getQuotation(quotationId)
    if (!q) return
    const newItem = {
      id: `qi${Date.now()}`,
      parentId: null,
      level: 1,
      productId: null,
      name: '',
      description: '',
      quantity: 1,
      unit: '式',
      sellingPrice: 0,
      costPrice: 0,
      taxRate: 0.1,
      ...itemData
    }
    if (afterId) {
      const idx = q.items.findIndex(i => i.id === afterId)
      q.items.splice(idx + 1, 0, newItem)
    } else {
      q.items.push(newItem)
    }
    save()
    return newItem
  }

  function updateItem(quotationId, itemId, data) {
    const q = getQuotation(quotationId)
    if (!q) return
    const idx = q.items.findIndex(i => i.id === itemId)
    if (idx !== -1) { q.items[idx] = { ...q.items[idx], ...data }; save() }
  }

  function deleteItem(quotationId, itemId) {
    const q = getQuotation(quotationId)
    if (!q) return
    // Also delete children
    const toDelete = new Set([itemId])
    let changed = true
    while (changed) {
      changed = false
      q.items.forEach(i => {
        if (i.parentId && toDelete.has(i.parentId) && !toDelete.has(i.id)) {
          toDelete.add(i.id)
          changed = true
        }
      })
    }
    q.items = q.items.filter(i => !toDelete.has(i.id))
    save()
  }

  function copyItem(quotationId, itemId) {
    const q = getQuotation(quotationId)
    if (!q) return
    const original = q.items.find(i => i.id === itemId)
    if (!original) return
    const copy = { ...original, id: `qi${Date.now()}`, name: `${original.name} (コピー)` }
    const idx = q.items.findIndex(i => i.id === itemId)
    q.items.splice(idx + 1, 0, copy)
    save()
    return copy
  }

  function reorderItems(quotationId, newItems) {
    const q = getQuotation(quotationId)
    if (!q) return
    q.items = newItems
    save()
  }

  // Totals computation for a quotation
  function computeTotals(quotationId) {
    const q = getQuotation(quotationId)
    if (!q) return {}
    let totalSellBeforeTax = 0, totalTax = 0, totalSellWithTax = 0, totalCost = 0
    q.items.forEach(item => {
      const c = calcItem(item)
      totalSellBeforeTax += c.subtotalSell
      totalTax += c.taxSell
      totalSellWithTax += c.totalSell
      totalCost += c.totalCost
    })
    const grossProfit = totalSellBeforeTax - totalCost
    const marginRate = totalSellBeforeTax > 0 ? (grossProfit / totalSellBeforeTax) * 100 : 0
    return { totalSellBeforeTax, totalTax, totalSellWithTax, totalCost, grossProfit, marginRate }
  }

  return {
    quotations, settings,
    getQuotation, createQuotation, updateQuotation, deleteQuotation,
    addItem, updateItem, deleteItem, copyItem, reorderItems,
    computeTotals, calcItem
  }
})

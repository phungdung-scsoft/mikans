import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── Available Services ──
export const ALL_SERVICES = [
  { code: 'quotation', name: '見積管理', nameVi: 'Quản lý báo giá', icon: '📋' },
  { code: 'quotation_import', name: '見積インポート', nameVi: 'Import báo giá', icon: '📥' },
  { code: 'accounting', name: '管理会計表', nameVi: 'Kế toán quản trị', icon: '📊' },
  { code: 'department_master', name: '部門管理', nameVi: 'Quản lý phòng ban', icon: '🏬' },
  { code: 'product_master', name: '商品管理', nameVi: 'Quản lý sản phẩm', icon: '📦' },
  { code: 'custom_master', name: 'カスタムマスタ', nameVi: 'Custom Master', icon: '🗂️' },
  { code: 'allocation_rule', name: '配賦ルール', nameVi: 'Quy tắc phân bổ', icon: '⚖️' },
  { code: 'ai_import', name: 'AIインポート', nameVi: 'AI Import', icon: '🤖' },
]

// ── Seed Plans ──
const seedPlans = [
  {
    id: 'p1', code: 'P0001', name: 'スターター',
    maxUsers: 5, maxQuotations: 3000, storageLimit: 5,
    services: ['quotation', 'accounting'],
    status: 'active', description: '小規模向け', createdAt: '2024-01-01'
  },
  {
    id: 'p2', code: 'P0002', name: 'ビジネス',
    maxUsers: 10, maxQuotations: 6000, storageLimit: 10,
    services: ['quotation', 'quotation_import', 'accounting', 'department_master', 'product_master'],
    status: 'active', description: '中規模向け', createdAt: '2024-01-01'
  },
  {
    id: 'p3', code: 'P0003', name: 'エンタープライズ',
    maxUsers: 30, maxQuotations: 9000, storageLimit: 50,
    services: ['quotation', 'quotation_import', 'accounting', 'department_master', 'product_master', 'custom_master', 'allocation_rule', 'ai_import'],
    status: 'active', description: '大規模向け', createdAt: '2024-01-01'
  },
]

// ── Seed Tenants / Customers ──
const seedCustomers = [
  {
    id: 'ten1', code: '100001', name: '株式会社ABC', planId: 'p2',
    contactName: '田中 将大', phone: '03-1234-5678', email: 'abc@gmail.com',
    status: 'active', userCount: 5, quotationCount: 124,
    storageUsed: 2.5,
    // Per-tenant enabled services (overrideable from plan defaults)
    enabledServices: ['quotation', 'quotation_import', 'accounting', 'department_master', 'product_master'],
    // Publish state
    publishedAt: '2024-02-01', publishVersion: 3, isPublished: true,
    companyInfo: {
      name: '株式会社ABC', nameKana: 'カブシキガイシャエービーシー',
      postalCode: '100-0001', address: '東京都千代田区丸の内1-1-1',
      phone: '03-1234-5678', fax: '03-1234-5679',
      email: 'abc@gmail.com', website: 'https://abc.example.com',
      registrationNumber: '1234567890123'
    },
    note: null, createdAt: '2024-01-10'
  },
  {
    id: 'ten2', code: '100002', name: '株式会社DEF', planId: 'p1',
    contactName: '清宮 宗', phone: '06-8765-4321', email: 'def@gmail.com',
    status: 'active', userCount: 3, quotationCount: 88, storageUsed: 1.2,
    enabledServices: ['quotation', 'accounting'],
    publishedAt: null, publishVersion: 0, isPublished: false,
    companyInfo: { name: '株式会社DEF', nameKana: '', postalCode: '', address: '', phone: '', fax: '', email: '', website: '', registrationNumber: '' },
    note: null, createdAt: '2024-02-05'
  },
  {
    id: 'ten3', code: '100003', name: '株式会社XYZ', planId: 'p3',
    contactName: '野村 勝也', phone: '092-9999-0000', email: 'xyz@gmail.com',
    status: 'active', userCount: 10, quotationCount: 312, storageUsed: 8.7,
    enabledServices: ['quotation', 'quotation_import', 'accounting', 'department_master', 'product_master', 'custom_master', 'allocation_rule'],
    publishedAt: '2024-03-15', publishVersion: 5, isPublished: true,
    companyInfo: { name: '株式会社XYZ', nameKana: '', postalCode: '', address: '', phone: '', fax: '', email: '', website: '', registrationNumber: '' },
    note: null, createdAt: '2024-03-01'
  },
  {
    id: 'ten4', code: '100004', name: '有限会社山田工務店', planId: 'p2',
    contactName: '山田 一郎', phone: '03-2222-3333', email: 'yamada@gmail.com',
    status: 'suspended', userCount: 7, quotationCount: 0, storageUsed: 0,
    enabledServices: ['quotation', 'accounting'],
    publishedAt: null, publishVersion: 0, isPublished: false,
    companyInfo: { name: '有限会社山田工務店', nameKana: '', postalCode: '', address: '', phone: '', fax: '', email: '', website: '', registrationNumber: '' },
    note: null, createdAt: '2024-03-15'
  },
  {
    id: 'ten5', code: '100005', name: '合同会社サクラ', planId: 'p1',
    contactName: '吉村 和馬', phone: '011-1111-2222', email: 'sakura@gmail.com',
    status: 'active', userCount: 2, quotationCount: 45, storageUsed: 0.8,
    enabledServices: ['quotation', 'accounting'],
    publishedAt: '2024-04-10', publishVersion: 1, isPublished: true,
    companyInfo: { name: '合同会社サクラ', nameKana: '', postalCode: '', address: '', phone: '', fax: '', email: '', website: '', registrationNumber: '' },
    note: null, createdAt: '2024-04-01'
  },
]

// ── Seed Audit Logs ──
const seedAuditLogs = [
  { id: 'a1', user: 'System Admin', action: 'Create', screen: 'Tenant Create', before: null, after: '株式会社ABC', ip: '192.168.1.1', createdAt: '2024-01-10T09:00:00' },
  { id: 'a2', user: 'System Admin', action: 'Update', screen: 'Service Configuration', before: 'quotation', after: 'quotation, accounting', ip: '192.168.1.1', createdAt: '2024-01-10T09:15:00' },
  { id: 'a3', user: 'System Admin', action: 'Publish', screen: 'Publish Configuration', before: 'v2', after: 'v3', ip: '192.168.1.1', createdAt: '2024-02-01T10:00:00' },
  { id: 'a4', user: 'System Admin', action: 'Create', screen: 'Master Configuration', before: null, after: 'Product Master', ip: '192.168.1.2', createdAt: '2024-02-15T14:30:00' },
  { id: 'a5', user: 'System Admin', action: 'Update', screen: 'Plan Detail', before: 'maxUsers: 8', after: 'maxUsers: 10', ip: '192.168.1.1', createdAt: '2024-03-01T11:00:00' },
]

export const useAdminStore = defineStore('admin', () => {
  const plans = ref(JSON.parse(localStorage.getItem('mikans_plans') || 'null') || seedPlans)
  const customers = ref(JSON.parse(localStorage.getItem('mikans_customers') || 'null') || seedCustomers)
  const auditLogs = ref(JSON.parse(localStorage.getItem('mikans_audit') || 'null') || seedAuditLogs)

  function savePlans() { localStorage.setItem('mikans_plans', JSON.stringify(plans.value)) }
  function saveCustomers() { localStorage.setItem('mikans_customers', JSON.stringify(customers.value)) }

  function addAuditLog(entry) {
    auditLogs.value.unshift({ id: `a${Date.now()}`, ...entry, ip: '127.0.0.1', createdAt: new Date().toISOString() })
    localStorage.setItem('mikans_audit', JSON.stringify(auditLogs.value))
  }

  // ── Plans ──
  function getPlan(id) { return plans.value.find(p => p.id === id) }
  function createPlan(data) {
    const plan = {
      id: `p${Date.now()}`,
      code: `P${String(plans.value.length + 1).padStart(4, '0')}`,
      status: 'active',
      services: [],
      storageLimit: 10,
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    plans.value.push(plan)
    savePlans()
    return plan
  }
  function updatePlan(id, data) {
    const idx = plans.value.findIndex(p => p.id === id)
    if (idx !== -1) { plans.value[idx] = { ...plans.value[idx], ...data }; savePlans() }
  }
  function deletePlan(id) { plans.value = plans.value.filter(p => p.id !== id); savePlans() }

  // ── Customers/Tenants ──
  function getCustomer(id) { return customers.value.find(c => c.id === id) }
  function createCustomer(data) {
    const plan = getPlan(data.planId)
    const customer = {
      id: `ten${Date.now()}`,
      code: String(100000 + customers.value.length + 1),
      status: 'active',
      userCount: 0, quotationCount: 0, storageUsed: 0,
      enabledServices: plan ? [...(plan.services || [])] : ['quotation'],
      publishedAt: null, publishVersion: 0, isPublished: false,
      companyInfo: { name: data.name || '', nameKana: '', postalCode: '', address: '', phone: data.phone || '', fax: '', email: data.email || '', website: '', registrationNumber: '' },
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    customers.value.push(customer)
    saveCustomers()
    addAuditLog({ user: 'System Admin', action: 'Create', screen: 'Tenant Create', before: null, after: customer.name })
    return customer
  }
  function updateCustomer(id, data) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      customers.value[idx] = { ...customers.value[idx], ...data }
      saveCustomers()
      addAuditLog({ user: 'System Admin', action: 'Update', screen: 'Tenant Detail', before: null, after: JSON.stringify(data) })
    }
  }
  function deleteCustomer(id) { customers.value = customers.value.filter(c => c.id !== id); saveCustomers() }

  function publishTenant(id) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      const v = (customers.value[idx].publishVersion || 0) + 1
      customers.value[idx] = {
        ...customers.value[idx],
        isPublished: true,
        publishVersion: v,
        publishedAt: new Date().toISOString().slice(0, 10)
      }
      saveCustomers()
      addAuditLog({ user: 'System Admin', action: 'Publish', screen: 'Publish Configuration', before: `v${v - 1}`, after: `v${v}` })
    }
  }

  // ── Dashboard stats ──
  const dashboardStats = ref({
    totalActiveCustomers: 300,
    totalUsers: 1250,
    totalQuotations: 1000000,
    totalImports: 45000,
    totalAllocations: 12000,
    topCustomers: [
      { name: '株式会社ABC', count: 312 },
      { name: '株式会社DEF', count: 280 },
      { name: '株式会社XYZ', count: 245 },
      { name: '有限会社山田工務店', count: 220 },
      { name: '合同会社サクラ', count: 190 },
      { name: 'キャロル建設', count: 167 },
      { name: 'エリーテック', count: 145 },
      { name: 'ミラン産業', count: 132 },
      { name: 'ソフィア工業', count: 118 },
      { name: 'アイナ設計', count: 100 },
    ],
    planDistribution: [
      { name: 'スターター', count: 120 },
      { name: 'ビジネス', count: 130 },
      { name: 'エンタープライズ', count: 50 },
    ],
    monthlyTrend: [
      { month: '1月', count: 8200 },
      { month: '2月', count: 9100 },
      { month: '3月', count: 10500 },
      { month: '4月', count: 11200 },
      { month: '5月', count: 12800 },
      { month: '6月', count: 14100 },
    ]
  })

  return {
    plans, customers, auditLogs, dashboardStats, ALL_SERVICES,
    getPlan, createPlan, updatePlan, deletePlan,
    getCustomer, createCustomer, updateCustomer, deleteCustomer, publishTenant,
    addAuditLog
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── Seed departments ──
const seedDepartments = [
  { id: 'd1', code: 'B00001', name: '営業部', note: '営業部門', createdAt: '2024-01-01' },
  { id: 'd2', code: 'B00002', name: '事務部', note: null, createdAt: '2024-01-01' },
  { id: 'd3', code: 'B00003', name: '経理部', note: null, createdAt: '2024-01-01' },
  { id: 'd4', code: 'B00004', name: '技術部', note: null, createdAt: '2024-02-01' },
]

// ── Seed users ──
const seedUsers = [
  { id: 'tu1', code: 'U00001', firstName: '田中', lastName: '太郎', email: 'tanaka@example.com', phone: '090-1111-2222', departmentId: 'd1', role: 'admin', note: null, createdAt: '2024-01-10' },
  { id: 'tu2', code: 'U00002', firstName: '佐藤', lastName: '花子', email: 'sato@example.com', phone: '090-3333-4444', departmentId: 'd2', role: 'member', note: null, createdAt: '2024-01-12' },
  { id: 'tu3', code: 'U00003', firstName: '鈴木', lastName: '一郎', email: 'suzuki@example.com', phone: '090-5555-6666', departmentId: 'd1', role: 'member', note: null, createdAt: '2024-02-01' },
  { id: 'tu4', code: 'U00004', firstName: '高橋', lastName: '次郎', email: 'takahashi@example.com', phone: '090-7777-8888', departmentId: 'd3', role: 'member', note: null, createdAt: '2024-03-01' },
]

// ── Seed company ──
const seedCompany = {
  name: '株式会社EXAMPLE',
  representative: '代表 太郎',
  postalCode: '100-0001',
  address1: '東京都千代田区丸の内',
  address2: '1-1-1',
  phone: '03-1234-5678',
  email: 'info@example.com',
  note: null
}

export const useTenantStore = defineStore('tenant', () => {
  const departments = ref(JSON.parse(localStorage.getItem('mikans_departments') || 'null') || seedDepartments)
  const users = ref(JSON.parse(localStorage.getItem('mikans_users') || 'null') || seedUsers)
  const company = ref(JSON.parse(localStorage.getItem('mikans_company') || 'null') || seedCompany)
  const enabledServices = ref(JSON.parse(localStorage.getItem('mikans_tenant_services') || 'null') || ['quotation', 'quotation_import', 'accounting', 'department_master', 'product_master', 'custom_master'])

  function saveDepts() { localStorage.setItem('mikans_departments', JSON.stringify(departments.value)) }
  function saveUsers() { localStorage.setItem('mikans_users', JSON.stringify(users.value)) }
  function saveCompany() { localStorage.setItem('mikans_company', JSON.stringify(company.value)) }

  // Departments
  function getDepartment(id) { return departments.value.find(d => d.id === id) }
  function createDepartment(data) {
    const dept = {
      id: `d${Date.now()}`,
      code: `B${String(departments.value.length + 1).padStart(5, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    departments.value.push(dept)
    saveDepts()
    return dept
  }
  function updateDepartment(id, data) {
    const idx = departments.value.findIndex(d => d.id === id)
    if (idx !== -1) { departments.value[idx] = { ...departments.value[idx], ...data }; saveDepts() }
  }
  function deleteDepartment(id) {
    departments.value = departments.value.filter(d => d.id !== id)
    saveDepts()
  }

  // Users
  function getUser(id) { return users.value.find(u => u.id === id) }
  function createUser(data) {
    const user = {
      id: `tu${Date.now()}`,
      code: `U${String(users.value.length + 1).padStart(5, '0')}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    users.value.push(user)
    saveUsers()
    return user
  }
  function updateUser(id, data) {
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) { users.value[idx] = { ...users.value[idx], ...data }; saveUsers() }
  }
  function deleteUser(id) {
    users.value = users.value.filter(u => u.id !== id)
    saveUsers()
  }

  // Company
  function updateCompany(data) {
    company.value = { ...company.value, ...data }
    saveCompany()
  }

  return {
    departments, users, company, enabledServices,
    getDepartment, createDepartment, updateDepartment, deleteDepartment,
    getUser, createUser, updateUser, deleteUser,
    updateCompany
  }
})

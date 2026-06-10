import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_USERS = [
  {
    id: 'u1',
    email: 'admin@mikans.io',
    password: 'admin123',
    name: 'System Admin',
    role: 'super_admin',
    avatar: null
  },
  {
    id: 'u2',
    email: 'tenant@example.com',
    password: 'tenant123',
    name: '田中 太郎',
    role: 'tenant_admin',
    tenantId: 'ten1',
    avatar: null
  },
  {
    id: 'u3',
    email: 'member@example.com',
    password: 'member123',
    name: '佐藤 花子',
    role: 'member',
    tenantId: 'ten1',
    avatar: null
  }
]

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem('mikans_user')
  const user = ref(storedUser ? JSON.parse(storedUser) : null)
  const isLoggedIn = computed(() => !!user.value)

  function login(email, password) {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('メールアドレスまたはパスワードが間違っています。')
    const { password: _, ...safeUser } = found
    user.value = safeUser
    localStorage.setItem('mikans_user', JSON.stringify(safeUser))
    return safeUser
  }

  function logout() {
    user.value = null
    localStorage.removeItem('mikans_user')
  }

  function sendResetEmail(email) {
    // Mock: just validate email exists
    const exists = MOCK_USERS.some(u => u.email === email)
    if (!exists) throw new Error('このメールアドレスは登録されていません。')
    return true
  }

  function resetPassword(_token, _newPassword) {
    // Mock: always succeeds
    return true
  }

  return { user, isLoggedIn, login, logout, sendResetEmail, resetPassword }
})

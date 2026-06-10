<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#2563eb"/>
            <path d="M10 28V12l10 8 10-8v16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="sidebar-title">MIKANS</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <span>{{ sidebarCollapsed ? '›' : '‹' }}</span>
        </button>
      </div>

      <div class="sidebar-role-badge" v-if="!sidebarCollapsed">
        <span class="role-label">{{ roleLabel }}</span>
      </div>

      <nav class="sidebar-nav">
        <div v-for="section in navSections" :key="section.label" class="nav-section">
          <div v-if="!sidebarCollapsed" class="nav-section-label">{{ section.label }}</div>
          <router-link
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item) }"
            :title="sidebarCollapsed ? item.label : ''"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
            <span v-if="!sidebarCollapsed && item.badge" class="nav-badge">{{ item.badge }}</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!sidebarCollapsed">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-details">
            <div class="user-name">{{ user?.name }}</div>
            <div class="user-email">{{ user?.email }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="doLogout" :title="sidebarCollapsed ? 'ログアウト' : ''">
          <span>🚪</span>
          <span v-if="!sidebarCollapsed">ログアウト</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-left">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="header-user">
            <div class="user-avatar sm">{{ userInitials }}</div>
            <span class="text-sm font-medium">{{ user?.name }}</span>
          </div>
        </div>
      </header>

      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const tenant = useTenantStore()
const { user } = auth

const sidebarCollapsed = ref(false)

const userInitials = computed(() => {
  if (!user?.name) return 'U'
  return user.name.split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

const roleLabel = computed(() => {
  const map = { super_admin: 'Super Admin', tenant_admin: 'Admin', member: 'Member' }
  return map[user?.role] || user?.role
})

const isAdminRole = computed(() => user?.role === 'super_admin')

const adminNavSections = [
  {
    label: '管理メニュー',
    items: [
      { to: '/admin/dashboard', icon: '📊', label: 'ダッシュボード' },
      { to: '/admin/plans', icon: '📦', label: 'プラン管理' },
      { to: '/admin/customers', icon: '🏢', label: '顧客管理' },
    ]
  }
]

const tenantNavSections = computed(() => {
  const enabled = tenant.enabledServices || []
  const sections = []

  sections.push({
    label: '基本設定',
    items: [
      { to: '/tenant/dashboard', icon: '🏠', label: 'ダッシュボード' },
      { to: '/tenant/company', icon: '🏢', label: '会社設定' },
      { to: '/tenant/departments', icon: '🏬', label: '部門管理' },
      { to: '/tenant/users', icon: '👥', label: 'ユーザー管理' },
    ]
  })

  const masterItems = []
  if (enabled.includes('custom_master')) masterItems.push({ to: '/tenant/masters', icon: '🗂️', label: 'マスタ参照' })
  if (enabled.includes('product_master')) masterItems.push({ to: '/tenant/products', icon: '📦', label: '商品管理' })
  if (masterItems.length) sections.push({ label: 'マスタ管理', items: masterItems })

  const quoteItems = []
  if (enabled.includes('quotation')) {
    quoteItems.push({ to: '/tenant/quotation-settings', icon: '⚙️', label: '見積設定' })
    quoteItems.push({ to: '/tenant/quotations', icon: '📋', label: '見積一覧' })
    quoteItems.push({ to: '/tenant/quotations/create', icon: '➕', label: '見積作成' })
  }
  if (quoteItems.length) sections.push({ label: '見積管理', items: quoteItems })

  const accItems = []
  if (enabled.includes('accounting')) {
    accItems.push({ to: '/tenant/accounting', icon: '📊', label: '管理会計表' })
  }
  if (accItems.length) sections.push({ label: '会計管理', items: accItems })

  return sections
})

const navSections = computed(() => isAdminRole.value ? adminNavSections : tenantNavSections.value)

function isActive(item) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}

const PAGE_TITLES = {
  '/admin/dashboard': 'ダッシュボード',
  '/admin/plans': 'プラン管理',
  '/admin/customers': '顧客管理',
  '/admin/tenants': 'テナント管理',
  '/tenant/dashboard': 'ダッシュボード',
  '/tenant/company': '会社設定',
  '/tenant/departments': '部門管理',
  '/tenant/users': 'ユーザー管理',
  '/tenant/masters': 'マスタ参照',
  '/tenant/products': '商品管理',
  '/tenant/quotation-settings': '見積フォーマット設定',
  '/tenant/quotations': '見積一覧',
  '/tenant/quotations/create': '見積登録',
  '/tenant/accounting': '管理会計表',
  '/tenant/profile': 'プロフィール',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (route.path.startsWith(path)) return title
  }
  return 'MIKANS'
})

function doLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--surface-bg);
}

/* ── Sidebar ── */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: var(--z-fixed);
  transition: width 0.25s ease;
  overflow: hidden;
}
.sidebar.collapsed { width: 72px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid var(--sidebar-border);
  min-height: 68px;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  overflow: hidden;
}
.sidebar-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: #fff;
  letter-spacing: 1px;
  white-space: nowrap;
}
.collapse-btn {
  background: var(--sidebar-item-hover-bg);
  border: none;
  color: var(--sidebar-color);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: var(--transition-fast);
}
.collapse-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

.sidebar-role-badge {
  padding: 8px 16px;
}
.role-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-primary-light);
  background: rgba(37,99,235,0.2);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-2);
  scrollbar-width: none;
}
.sidebar-nav::-webkit-scrollbar { display: none; }

.nav-section { margin-bottom: var(--space-4); }
.nav-section-label {
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 12px;
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 9px 12px;
  border-radius: var(--radius-md);
  color: var(--sidebar-color);
  text-decoration: none;
  transition: var(--transition-fast);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover { background: var(--sidebar-item-hover-bg); color: #fff; }
.nav-item.active {
  background: var(--sidebar-item-active-bg);
  color: var(--sidebar-color-active);
  font-weight: var(--font-medium);
}
.nav-icon { font-size: 1rem; flex-shrink: 0; width: 20px; text-align: center; }
.nav-label { font-size: var(--text-sm); }
.nav-badge {
  margin-left: auto;
  background: var(--color-primary);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.sidebar-footer {
  border-top: 1px solid var(--sidebar-border);
  padding: var(--space-4) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  overflow: hidden;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font-weight: var(--font-bold);
  font-size: var(--text-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-avatar.sm { width: 30px; height: 30px; font-size: 11px; }
.user-details { overflow: hidden; }
.user-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-email {
  font-size: var(--text-xs);
  color: var(--sidebar-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 9px 12px;
  border-radius: var(--radius-md);
  background: none;
  border: none;
  color: var(--sidebar-color);
  cursor: pointer;
  font-size: var(--text-sm);
  width: 100%;
  transition: var(--transition-fast);
}
.logout-btn:hover { background: rgba(220,38,38,0.15); color: #fca5a5; }

/* ── Main content ── */
.main-wrapper {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.25s ease;
}
.sidebar.collapsed ~ .main-wrapper { margin-left: 72px; }

.top-header {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  box-shadow: var(--header-shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
.page-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
}
.header-right { display: flex; align-items: center; gap: var(--space-4); }
.header-user { display: flex; align-items: center; gap: var(--space-2); color: var(--color-gray-700); }

.main-content {
  flex: 1;
  padding: var(--space-8);
  overflow-y: auto;
}
</style>

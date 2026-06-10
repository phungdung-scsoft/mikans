import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ─── Auth ──────────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'auth', guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { layout: 'auth', guest: true }
  },

  // ─── Super Admin ────────────────────────────────────────
  {
    path: '/admin',
    meta: { layout: 'admin', requiresAuth: true, role: 'super_admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'plans', name: 'AdminPlans', component: () => import('@/views/admin/PlansView.vue') },
      { path: 'plans/create', name: 'AdminPlanCreate', component: () => import('@/views/admin/PlanFormView.vue') },
      { path: 'plans/:id/edit', name: 'AdminPlanEdit', component: () => import('@/views/admin/PlanFormView.vue') },
      { path: 'customers', name: 'AdminCustomers', component: () => import('@/views/admin/CustomersView.vue') },
      { path: 'customers/create', name: 'AdminCustomerCreate', component: () => import('@/views/admin/CustomerFormView.vue') },
      { path: 'customers/:id', name: 'AdminCustomerDetail', component: () => import('@/views/admin/CustomerDetailView.vue') },
      { path: 'customers/:id/edit', name: 'AdminCustomerEdit', component: () => import('@/views/admin/CustomerFormView.vue') },
      { path: 'tenants/:id/setup', name: 'AdminTenantSetup', component: () => import('@/views/admin/TenantSetupView.vue') },
      { path: 'tenants/:id/setup/masters/create', name: 'AdminMasterCreate', component: () => import('@/views/admin/MasterBuilderView.vue') },
      { path: 'tenants/:id/setup/masters/:masterId/settings', name: 'AdminMasterSettings', component: () => import('@/views/admin/MasterBuilderView.vue') },
    ]
  },

  // ─── Tenant ─────────────────────────────────────────────
  {
    path: '/tenant',
    meta: { layout: 'tenant', requiresAuth: true, role: 'tenant' },
    children: [
      { path: '', redirect: '/tenant/dashboard' },
      { path: 'dashboard', name: 'TenantDashboard', component: () => import('@/views/tenant/DashboardView.vue') },
      // Company settings
      { path: 'company', name: 'CompanySettings', component: () => import('@/views/tenant/CompanySettingsView.vue') },
      // Departments
      { path: 'departments', name: 'Departments', component: () => import('@/views/tenant/DepartmentsView.vue') },
      // Users
      { path: 'users', name: 'Users', component: () => import('@/views/tenant/UsersView.vue') },
      { path: 'users/create', name: 'UserCreate', component: () => import('@/views/tenant/UserFormView.vue') },
      { path: 'users/:id/edit', name: 'UserEdit', component: () => import('@/views/tenant/UserFormView.vue') },
      // Dynamic Masters (only records list)
      { path: 'masters', name: 'Masters', component: () => import('@/views/tenant/masters/MasterListView.vue') },
      { path: 'masters/:masterId', name: 'MasterRecords', component: () => import('@/views/tenant/masters/MasterRecordsView.vue') },
      // Products
      { path: 'products', name: 'Products', component: () => import('@/views/tenant/products/ProductListView.vue') },
      { path: 'products/create', name: 'ProductCreate', component: () => import('@/views/tenant/products/ProductFormView.vue') },
      { path: 'products/:id/edit', name: 'ProductEdit', component: () => import('@/views/tenant/products/ProductFormView.vue') },
      // Quotation Settings
      { path: 'quotation-settings', name: 'QuotationSettings', component: () => import('@/views/tenant/quotations/QuotationSettingsView.vue') },
      // Quotations
      { path: 'quotations', name: 'Quotations', component: () => import('@/views/tenant/quotations/QuotationListView.vue') },
      { path: 'quotations/create', name: 'QuotationCreate', component: () => import('@/views/tenant/quotations/QuotationEditorView.vue') },
      { path: 'quotations/:id/edit', name: 'QuotationEdit', component: () => import('@/views/tenant/quotations/QuotationEditorView.vue') },
      { path: 'quotations/:id', name: 'QuotationDetail', component: () => import('@/views/tenant/quotations/QuotationDetailView.vue') },
      // Accounting
      { path: 'accounting', name: 'Accounting', component: () => import('@/views/tenant/AccountingView.vue') },
      // Profile
      { path: 'profile', name: 'Profile', component: () => import('@/views/tenant/ProfileView.vue') },
    ]
  },

  // ─── Root redirect ─────────────────────────────────────
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore()
      if (!auth.isLoggedIn) return '/login'
      if (auth.user?.role === 'super_admin') return '/admin/dashboard'
      return '/tenant/dashboard'
    }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')
  if (to.meta.guest && auth.isLoggedIn) {
    return next(auth.user?.role === 'super_admin' ? '/admin/dashboard' : '/tenant/dashboard')
  }
  next()
})

export default router

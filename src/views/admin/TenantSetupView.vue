<template>
  <div class="tenant-setup">
    <div class="page-header">
      <router-link to="/admin/customers" class="back-link">← 顧客一覧に戻る</router-link>
      <h2>{{ customer?.name }} のセットアップ</h2>
    </div>

    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" 
              class="tab-btn" 
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- 会社設定 -->
      <div v-if="activeTab === 'company'">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">会社情報</h3></div>
          <div class="card-body">
            <p class="text-sm text-muted mb-4">テナントの基本情報を設定します。</p>
            <div class="form-grid">
              <div class="form-group">
                <label>会社名</label>
                <input v-model="companyForm.name" class="form-input" />
              </div>
              <div class="form-group">
                <label>電話番号</label>
                <input v-model="companyForm.phone" class="form-input" />
              </div>
              <div class="form-group">
                <label>メールアドレス</label>
                <input v-model="companyForm.email" class="form-input" />
              </div>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary" @click="saveCompany">保存する</button>
            </div>
          </div>
        </div>
      </div>

      <!-- サービス設定 -->
      <div v-if="activeTab === 'services'">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">サービス構成 (Service Configuration)</h3></div>
          <div class="card-body">
            <p class="text-sm text-muted mb-4">このテナントで利用可能な機能をON/OFFします。プランのデフォルト設定が初期適用されています。</p>
            <div class="services-grid">
              <label v-for="svc in ALL_SERVICES" :key="svc.code" class="service-card" :class="{ active: enabledServices.includes(svc.code) }">
                <input type="checkbox" :value="svc.code" v-model="enabledServices" class="hidden-checkbox" />
                <span class="svc-icon">{{ svc.icon }}</span>
                <div class="svc-info">
                  <div class="svc-name">{{ svc.name }}</div>
                  <div class="svc-code">{{ svc.code }}</div>
                </div>
                <span class="status-indicator"></span>
              </label>
            </div>
            <div class="mt-4 border-t pt-4">
              <button class="btn btn-primary" @click="saveServices">サービス構成を保存</button>
            </div>
          </div>
        </div>
      </div>

      <!-- マスタ設定 -->
      <div v-if="activeTab === 'masters'">
        <div class="card">
          <div class="card-header flex justify-between items-center">
            <h3 class="font-semibold">マスタ構成 (Master Configuration)</h3>
            <router-link :to="`/admin/tenants/${customerId}/setup/masters/create`" class="btn btn-primary btn-sm">＋ マスタ追加</router-link>
          </div>
          <div class="card-body">
            <p class="text-sm text-muted mb-4">ダイナミックマスタの定義を行います。</p>
            <table class="simple-table">
              <thead>
                <tr>
                  <th>マスタコード</th>
                  <th>マスタ名</th>
                  <th>フィールド数</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="master in mastersStore.masters" :key="master.id">
                  <td>{{ master.code }}</td>
                  <td>{{ master.name }}</td>
                  <td>{{ master.fields.length }}</td>
                  <td><span class="badge bg-success">有効</span></td>
                  <td>
                    <router-link :to="`/admin/tenants/${customerId}/setup/masters/${master.id}/settings`" class="btn btn-outline btn-sm">構成</router-link>
                  </td>
                </tr>
                <tr v-if="!mastersStore.masters.length">
                  <td colspan="5" class="text-center text-muted p-4">マスタがありません</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 配賦ルール -->
      <div v-if="activeTab === 'allocation'">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">配賦ルール (Allocation Rule)</h3></div>
          <div class="card-body">
            <p class="text-sm text-muted">見積明細の売上・原価をどの部門に配賦するかを定義します。(準備中)</p>
          </div>
        </div>
      </div>

      <!-- パブリッシュ -->
      <div v-if="activeTab === 'publish'">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">構成のパブリッシュ (Publish Configuration)</h3></div>
          <div class="card-body">
            <p class="text-sm text-muted mb-4">設定した構成をテナントに反映します。</p>
            <div class="publish-status mb-4">
              <div class="status-item">
                <span class="label">現在のバージョン:</span>
                <span class="value font-semibold">v{{ customer?.publishVersion || 0 }}</span>
              </div>
              <div class="status-item">
                <span class="label">最終パブリッシュ日:</span>
                <span class="value">{{ customer?.publishedAt || '未実施' }}</span>
              </div>
            </div>
            
            <button class="btn btn-primary" @click="publishConfig" :disabled="publishing">
              {{ publishing ? '反映中...' : '構成をパブリッシュする' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useMastersStore } from '@/stores/masters'

const route = useRoute()
const adminStore = useAdminStore()
const mastersStore = useMastersStore()
const { ALL_SERVICES } = adminStore

const customerId = computed(() => route.params.id)
const customer = computed(() => adminStore.getCustomer(customerId.value))

const tabs = [
  { id: 'company', label: '会社設定' },
  { id: 'users', label: 'ユーザー管理' },
  { id: 'services', label: 'サービス構成' },
  { id: 'masters', label: 'マスタ構成' },
  { id: 'relations', label: 'リレーション構成' },
  { id: 'import', label: 'インポート構成' },
  { id: 'allocation', label: '配賦ルール' },
  { id: 'publish', label: 'パブリッシュ' },
]

const activeTab = ref('services')

// Company Form
const companyForm = ref({ name: '', phone: '', email: '' })
// Services Form
const enabledServices = ref([])
const publishing = ref(false)

onMounted(() => {
  loadData()
})

watch(customer, () => {
  loadData()
})

function loadData() {
  if (customer.value) {
    companyForm.value = { 
      name: customer.value.name, 
      phone: customer.value.phone, 
      email: customer.value.email 
    }
    enabledServices.value = [...(customer.value.enabledServices || [])]
  }
}

function saveCompany() {
  adminStore.updateCustomer(customerId.value, { ...companyForm.value })
  alert('会社情報を保存しました。')
}

function saveServices() {
  adminStore.updateCustomer(customerId.value, { enabledServices: enabledServices.value })
  alert('サービス構成を保存しました。テナント環境に反映するにはパブリッシュが必要です。')
}

function publishConfig() {
  publishing.value = true
  setTimeout(() => {
    adminStore.publishTenant(customerId.value)
    publishing.value = false
    alert('構成をパブリッシュしました。テナント側に反映されました。')
  }, 800)
}
</script>

<style scoped>
.tenant-setup {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.page-header { margin-bottom: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); display: inline-block; margin-bottom: 8px; }
h2 { font-size: var(--text-xl); font-weight: 600; }

.tabs {
  display: flex;
  gap: 2px;
  border-bottom: 1px solid var(--color-gray-200);
  background: white;
  padding: 0 var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow-x: auto;
}
.tab-btn {
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-gray-500);
  font-weight: 500;
  font-size: var(--text-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.tab-btn:hover { color: var(--color-gray-800); }
.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content { padding: var(--space-4) 0; }

.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 13px; font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 8px 12px; border: 1px solid var(--color-gray-200); border-radius: 6px; font-size: 14px; }
.form-input:focus { outline: none; border-color: var(--color-primary); }

.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4); }
.service-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  position: relative;
}
.service-card:hover { border-color: var(--color-primary-light); background: var(--color-gray-50); }
.service-card.active { border-color: var(--color-primary); background: var(--color-primary-light); }
.hidden-checkbox { display: none; }
.svc-icon { font-size: 24px; }
.svc-info { flex: 1; }
.svc-name { font-weight: 600; font-size: 14px; color: var(--color-gray-800); }
.svc-code { font-size: 11px; color: var(--color-gray-500); }
.status-indicator {
  width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--color-gray-300); background: white;
}
.service-card.active .status-indicator {
  border-color: var(--color-primary); background: var(--color-primary);
  box-shadow: inset 0 0 0 2px white;
}

.publish-status { display: flex; gap: 24px; padding: 16px; background: var(--color-gray-50); border-radius: 8px; }
.status-item { display: flex; flex-direction: column; gap: 4px; }
.status-item .label { font-size: 12px; color: var(--color-gray-500); }
.status-item .value { font-size: 16px; color: var(--color-gray-800); }

.simple-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
.simple-table th { padding: 12px; border-bottom: 2px solid var(--color-gray-200); color: var(--color-gray-500); font-weight: 600; }
.simple-table td { padding: 12px; border-bottom: 1px solid var(--color-gray-100); }
.badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.bg-success { background: #dcfce7; color: #166534; }
</style>

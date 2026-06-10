<template>
  <div class="customers-view animate-fade-in">
    <div class="page-toolbar">
      <input v-model="search" class="search-input" placeholder="顧客名、担当者、電話、Mailで検索..." style="min-width:360px" />
      <router-link to="/admin/customers/create" class="btn btn-primary">＋ 顧客登録</router-link>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>顧客コード</th>
            <th>顧客名</th>
            <th>ユーザー数</th>
            <th>担当者名</th>
            <th>電話番号</th>
            <th>メール</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in paginated" :key="c.id" class="animate-fade-in">
            <td class="text-muted">{{ (page - 1) * perPage + i + 1 }}</td>
            <td><span class="code-chip">{{ c.code }}</span></td>
            <td class="font-medium">{{ c.name }}</td>
            <td>{{ c.userCount }}</td>
            <td>{{ c.contactName }}</td>
            <td>{{ c.phone }}</td>
            <td>{{ c.email }}</td>
            <td>
              <span class="status-chip" :class="c.active ? 'active' : 'inactive'">
                {{ c.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <router-link :to="`/admin/customers/${c.id}`" class="action-btn view">詳細</router-link>
                <router-link :to="`/admin/customers/${c.id}/edit`" class="action-btn edit">編集</router-link>
                <button class="action-btn delete" @click="deleteTarget = c">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="9" class="empty-row">顧客が見つかりません</td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <div class="per-page-select">
          表示件数
          <select v-model="perPage" class="select-sm">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="pagination">
          <button class="page-btn" :disabled="page <= 1" @click="page--">‹</button>
          <span class="page-info">{{ page }} / {{ totalPages }}</span>
          <button class="page-btn" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">顧客を削除しますか？</h3>
          <p class="text-sm text-muted mb-6">「{{ deleteTarget.name }}」を削除します。</p>
          <div class="flex justify-end gap-3">
            <button class="btn btn-ghost" @click="deleteTarget = null">キャンセル</button>
            <button class="btn btn-danger" @click="doDelete">削除する</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const search = ref('')
const page = ref(1)
const perPage = ref(10)
const deleteTarget = ref(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return admin.customers
  return admin.customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.contactName || '').toLowerCase().includes(q) ||
    (c.phone || '').includes(q) ||
    (c.email || '').toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

function doDelete() { admin.deleteCustomer(deleteTarget.value.id); deleteTarget.value = null }
</script>

<style scoped>
.customers-view { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.search-input { padding: 9px 14px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--font-medium); cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 14px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: var(--font-semibold); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); }
.data-table td { border-bottom: 1px solid var(--color-gray-50); color: var(--color-gray-700); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.code-chip { font-family: var(--font-mono); font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-sm); }
.status-chip { display: inline-flex; padding: 2px 8px; border-radius: var(--radius-full); font-size: 11px; font-weight: 600; }
.status-chip.active { background: var(--color-success-light); color: var(--color-success); }
.status-chip.inactive { background: var(--color-gray-100); color: var(--color-gray-500); }
.action-btns { display: flex; gap: var(--space-1); }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.action-btn.view { background: var(--color-gray-100); color: var(--color-gray-700); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.table-footer { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4) var(--space-4); border-top: 1px solid var(--color-gray-100); }
.per-page-select { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-gray-500); }
.select-sm { padding: 4px 8px; border: 1px solid var(--color-gray-200); border-radius: var(--radius-sm); font-size: var(--text-sm); }
.pagination { display: flex; align-items: center; gap: var(--space-2); }
.page-btn { width: 32px; height: 32px; border: 1px solid var(--color-gray-200); border-radius: var(--radius-sm); background: white; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: var(--transition-fast); }
.page-btn:hover:not(:disabled) { background: var(--color-primary-light); border-color: var(--color-primary); color: var(--color-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: var(--text-sm); color: var(--color-gray-600); min-width: 60px; text-align: center; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: var(--z-modal); }
.modal-box { background: white; border-radius: var(--radius-xl); padding: var(--space-8); max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

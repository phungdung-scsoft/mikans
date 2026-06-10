<template>
  <div class="quotations-list animate-fade-in">
    <div class="page-toolbar">
      <input v-model="search" class="search-input" placeholder="案件名・顧客名で検索..." />
      <div class="flex gap-3">
        <button class="btn btn-outline">📥 Import</button>
        <router-link to="/tenant/quotations/create" class="btn btn-primary">＋ 見積作成</router-link>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>No.</th><th>見積ID</th><th>見積日</th><th>案件名</th><th>顧客名</th><th>売上金額</th><th>原価合計</th><th>ステータス</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="(q, i) in filtered" :key="q.id">
            <td class="text-muted">{{ i + 1 }}</td>
            <td><span class="code-chip">{{ q.id }}</span></td>
            <td>{{ q.quoteDate || '—' }}</td>
            <td class="font-medium">{{ q.projectName || q.title }}</td>
            <td>{{ q.clientName }}</td>
            <td class="num-cell text-success font-medium">¥{{ totals(q).totalSellBeforeTax.toLocaleString() }}</td>
            <td class="num-cell text-muted">¥{{ totals(q).totalCost.toLocaleString() }}</td>
            <td><span class="status-chip" :class="q.status">{{ statusLabel(q.status) }}</span></td>
            <td>
              <div class="action-btns">
                <router-link :to="`/tenant/quotations/${q.id}`" class="action-btn view">詳細</router-link>
                <router-link :to="`/tenant/quotations/${q.id}/edit`" class="action-btn edit">編集</router-link>
                <button class="action-btn delete" @click="deleteTarget = q">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="9" class="empty-row">見積が見つかりません</td></tr>
        </tbody>
      </table>
    </div>

    <teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">見積を削除しますか？</h3>
          <p class="text-sm text-muted mb-6">「{{ deleteTarget.title }}」を削除します。</p>
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
import { useQuotationsStore, calcItem } from '@/stores/quotations'

const quotStore = useQuotationsStore()
const search = ref('')
const deleteTarget = ref(null)

const STATUS_MAP = { draft: '下書き', confirmed: '承認済', cancelled: 'キャンセル' }
function statusLabel(s) { return STATUS_MAP[s] || s }

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return quotStore.quotations.filter(qt =>
    (qt.projectName || qt.title || '').toLowerCase().includes(q) ||
    (qt.clientName || '').toLowerCase().includes(q)
  )
})

function totals(q) {
  let totalSellBeforeTax = 0, totalCost = 0
  q.items.forEach(item => {
    const c = calcItem(item)
    totalSellBeforeTax += c.subtotalSell
    totalCost += c.totalCost
  })
  return { totalSellBeforeTax, totalCost }
}

function doDelete() { quotStore.deleteQuotation(deleteTarget.value.id); deleteTarget.value = null }
</script>

<style scoped>
.quotations-list { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.search-input { padding: 9px 14px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); min-width: 300px; }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 12px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); white-space: nowrap; }
.data-table td { border-bottom: 1px solid var(--color-gray-50); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.code-chip { font-family: monospace; font-size: 11px; background: var(--color-gray-100); padding: 2px 8px; border-radius: 4px; }
.num-cell { text-align: right; font-variant-numeric: tabular-nums; }
.status-chip { display: inline-flex; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
.status-chip.draft { background: var(--color-gray-100); color: var(--color-gray-600); }
.status-chip.confirmed { background: var(--color-success-light); color: var(--color-success); }
.status-chip.cancelled { background: var(--color-danger-light); color: var(--color-danger); }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.action-btns { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.action-btn.view { background: var(--color-gray-100); color: var(--color-gray-700); }
.action-btn.view:hover { background: var(--color-gray-200); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-box { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

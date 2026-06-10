<template>
  <div class="products-view animate-fade-in">
    <div class="page-toolbar">
      <input v-model="search" class="search-input" placeholder="商品名・コードで検索..." />
      <div class="flex gap-3">
        <button class="btn btn-outline">📥 Import</button>
        <router-link to="/tenant/products/create" class="btn btn-primary">＋ 商品登録</router-link>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>No.</th><th>商品コード</th><th>商品名</th><th>概要</th><th>大分類</th><th>単位</th><th>売単価</th><th>仕入単価</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in paginated" :key="p.id">
            <td class="text-muted">{{ (page-1)*perPage + i + 1 }}</td>
            <td><span class="code-chip">{{ p.code }}</span></td>
            <td class="font-medium">{{ p.name }}</td>
            <td class="text-muted truncate" style="max-width:160px">{{ p.summary || '—' }}</td>
            <td>{{ p.categoryLarge || '—' }}</td>
            <td>{{ p.unit }}</td>
            <td class="num-cell">¥{{ p.sellingPrice.toLocaleString() }}</td>
            <td class="num-cell text-muted">¥{{ p.costPrice.toLocaleString() }}</td>
            <td>
              <div class="action-btns">
                <router-link :to="`/tenant/products/${p.id}/edit`" class="action-btn edit">編集</router-link>
                <button class="action-btn delete" @click="deleteTarget = p">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="9" class="empty-row">商品が見つかりません</td></tr>
        </tbody>
      </table>
      <div class="table-footer">
        <div class="text-sm text-muted">{{ filtered.length }} 件</div>
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
          <h3 class="font-semibold mb-2">商品を削除しますか？</h3>
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
import { useProductsStore } from '@/stores/products'

const prods = useProductsStore()
const search = ref('')
const page = ref(1)
const perPage = 20
const deleteTarget = ref(null)

const filtered = computed(() => prods.searchProducts(search.value))
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

function doDelete() { prods.deleteProduct(deleteTarget.value.id); deleteTarget.value = null }
</script>

<style scoped>
.products-view { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.search-input { padding: 9px 14px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); min-width: 280px; }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 11px 12px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); white-space: nowrap; }
.data-table td { border-bottom: 1px solid var(--color-gray-50); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.code-chip { font-family: monospace; font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: 4px; }
.num-cell { text-align: right; font-variant-numeric: tabular-nums; }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.action-btns { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.table-footer { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); border-top: 1px solid var(--color-gray-100); }
.pagination { display: flex; align-items: center; gap: var(--space-2); }
.page-btn { width: 32px; height: 32px; border: 1px solid var(--color-gray-200); border-radius: 4px; background: white; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: var(--transition-fast); }
.page-btn:hover:not(:disabled) { background: var(--color-primary-light); border-color: var(--color-primary); color: var(--color-primary); }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: var(--text-sm); color: var(--color-gray-600); min-width: 60px; text-align: center; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-box { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

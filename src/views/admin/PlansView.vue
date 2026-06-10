<template>
  <div class="plans-view animate-fade-in">
    <div class="page-toolbar">
      <div class="search-wrap">
        <input v-model="search" class="search-input" placeholder="プランを検索..." />
      </div>
      <router-link to="/admin/plans/create" class="btn btn-primary" id="create-plan-btn">
        ＋ プラン登録
      </router-link>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>プランコード</th>
            <th>プラン名</th>
            <th>最大ユーザー数</th>
            <th>最大見積数</th>
            <th>メモ</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plan, i) in filtered" :key="plan.id" class="animate-fade-in">
            <td class="text-muted">{{ i + 1 }}</td>
            <td><span class="code-chip">{{ plan.code }}</span></td>
            <td class="font-medium">{{ plan.name }}</td>
            <td>{{ plan.maxUsers.toLocaleString() }} 人</td>
            <td>{{ plan.maxQuotations.toLocaleString() }} 件</td>
            <td class="text-muted">{{ plan.note || '—' }}</td>
            <td>
              <div class="action-btns">
                <router-link :to="`/admin/plans/${plan.id}/edit`" class="action-btn edit">編集</router-link>
                <button class="action-btn delete" @click="confirmDelete(plan)">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="7" class="empty-row">プランが見つかりません</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">プランを削除しますか？</h3>
          <p class="text-sm text-muted mb-6">「{{ deleteTarget.name }}」を削除します。この操作は取り消せません。</p>
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
const deleteTarget = ref(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return admin.plans.filter(p =>
    p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
  )
})

function confirmDelete(plan) { deleteTarget.value = plan }
function doDelete() {
  admin.deletePlan(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<style scoped>
.plans-view { display: flex; flex-direction: column; gap: var(--space-5); }

.page-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.search-input {
  padding: 9px 14px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  min-width: 260px;
  transition: var(--transition-fast);
}
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }

/* Buttons */
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--font-medium); cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; display: inline-flex; align-items: center; gap: var(--space-1); }
.btn-primary { background: var(--color-primary); color: white; box-shadow: 0 2px 6px rgba(37,99,235,0.25); }
.btn-primary:hover { background: var(--color-primary-hover); transform: translateY(-1px); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-ghost:hover { background: var(--color-gray-200); }
.btn-danger { background: var(--color-danger); color: white; }
.btn-danger:hover { filter: brightness(0.9); }

/* Table */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 16px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: var(--font-semibold); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); }
.data-table td { border-bottom: 1px solid var(--color-gray-50); color: var(--color-gray-700); }
.data-table tbody tr:hover { background: var(--color-gray-50); }

.code-chip { font-family: var(--font-mono); font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-sm); }
.empty-row { text-align: center; color: var(--color-gray-400); padding: var(--space-12) !important; }

.action-btns { display: flex; gap: var(--space-2); }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: var(--font-medium); cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: var(--z-modal); }
.modal-box { background: white; border-radius: var(--radius-xl); padding: var(--space-8); max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

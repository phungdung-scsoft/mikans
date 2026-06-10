<template>
  <div class="users-view animate-fade-in">
    <div class="page-toolbar">
      <input v-model="search" class="search-input" placeholder="名前、メールで検索..." />
      <router-link to="/tenant/users/create" class="btn btn-primary">＋ ユーザー登録</router-link>
    </div>
    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>No.</th><th>ユーザーコード</th><th>氏名</th><th>メール</th><th>部門</th><th>権限</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) in filtered" :key="u.id">
            <td class="text-muted">{{ i + 1 }}</td>
            <td><span class="code-chip">{{ u.code }}</span></td>
            <td class="font-medium">{{ u.firstName }} {{ u.lastName }}</td>
            <td>{{ u.email }}</td>
            <td>{{ getDeptName(u.departmentId) }}</td>
            <td><span class="role-chip" :class="u.role">{{ u.role === 'admin' ? 'Admin' : 'Member' }}</span></td>
            <td>
              <div class="action-btns">
                <router-link :to="`/tenant/users/${u.id}/edit`" class="action-btn edit">編集</router-link>
                <button class="action-btn delete" @click="deleteTarget = u">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7" class="empty-row">ユーザーが見つかりません</td></tr>
        </tbody>
      </table>
    </div>
    <teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">ユーザーを削除しますか？</h3>
          <p class="text-sm text-muted mb-6">「{{ deleteTarget.firstName }} {{ deleteTarget.lastName }}」を削除します。</p>
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
import { useTenantStore } from '@/stores/tenant'
const tenant = useTenantStore()
const search = ref('')
const deleteTarget = ref(null)
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return tenant.users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
})
function getDeptName(id) { return tenant.departments.find(d => d.id === id)?.name || '—' }
function doDelete() { tenant.deleteUser(deleteTarget.value.id); deleteTarget.value = null }
</script>
<style scoped>
.users-view { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
.search-input { padding: 9px 14px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); min-width: 300px; }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 16px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); }
.data-table td { border-bottom: 1px solid var(--color-gray-50); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.code-chip { font-family: monospace; font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: 4px; }
.role-chip { display: inline-flex; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
.role-chip.admin { background: var(--color-primary-light); color: var(--color-primary-dark); }
.role-chip.member { background: var(--color-gray-100); color: var(--color-gray-600); }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.action-btns { display: flex; gap: 8px; }
.action-btn { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-box { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

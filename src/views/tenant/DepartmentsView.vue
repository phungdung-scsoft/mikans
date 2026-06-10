<template>
  <div class="depts-view animate-fade-in">
    <div class="page-toolbar">
      <input v-model="search" class="search-input" placeholder="部門名を検索..." />
      <button class="btn btn-primary" @click="openForm(null)">＋ 部門登録</button>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr><th>No.</th><th>部門コード</th><th>部門名</th><th>メモ</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="(d, i) in filtered" :key="d.id">
            <td class="text-muted">{{ i + 1 }}</td>
            <td><span class="code-chip">{{ d.code }}</span></td>
            <td class="font-medium">{{ d.name }}</td>
            <td class="text-muted">{{ d.note || '—' }}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit" @click="openForm(d)">編集</button>
                <button class="action-btn delete" @click="deleteTarget = d">削除</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="5" class="empty-row">部門が見つかりません</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal -->
    <teleport to="body">
      <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-6">{{ editing ? '部門編集' : '部門登録' }}</h3>
          <form @submit.prevent="saveForm" class="flex flex-col gap-4">
            <div class="form-group">
              <label class="form-label">部門コード <span class="req">※自動生成</span></label>
              <input :value="editing?.code || '自動生成'" class="form-input" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">部門名 *</label>
              <input v-model="formData.name" class="form-input" placeholder="例: 営業部" autofocus />
              <span v-if="nameError" class="form-error">{{ nameError }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">メモ</label>
              <textarea v-model="formData.note" class="form-input" rows="2"></textarea>
            </div>
            <div class="flex justify-end gap-3 mt-2">
              <button type="button" class="btn btn-ghost" @click="showForm = false">キャンセル</button>
              <button type="submit" class="btn btn-primary">{{ editing ? '更新' : '登録' }}</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">部門を削除しますか？</h3>
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
import { ref, reactive, computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'

const tenant = useTenantStore()
const search = ref('')
const showForm = ref(false)
const editing = ref(null)
const deleteTarget = ref(null)
const formData = reactive({ name: '', note: '' })
const nameError = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return tenant.departments.filter(d => d.name.toLowerCase().includes(q))
})

function openForm(dept) {
  editing.value = dept
  formData.name = dept?.name || ''
  formData.note = dept?.note || ''
  nameError.value = ''
  showForm.value = true
}

function saveForm() {
  nameError.value = formData.name ? '' : '部門名を入力してください'
  if (nameError.value) return
  if (editing.value) tenant.updateDepartment(editing.value.id, { name: formData.name, note: formData.note })
  else tenant.createDepartment({ name: formData.name, note: formData.note })
  showForm.value = false
}

function doDelete() { tenant.deleteDepartment(deleteTarget.value.id); deleteTarget.value = null }
</script>

<style scoped>
.depts-view { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
.search-input { padding: 9px 14px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); min-width: 260px; transition: var(--transition-fast); }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 16px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); }
.data-table td { border-bottom: 1px solid var(--color-gray-50); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.code-chip { font-family: var(--font-mono); font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-sm); }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.action-btns { display: flex; gap: var(--space-2); }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--text-xs); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: var(--z-modal); }
.modal-box { background: white; border-radius: var(--radius-xl); padding: var(--space-8); max-width: 480px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.req { font-size: var(--text-xs); color: var(--color-gray-400); font-weight: normal; margin-left: 4px; }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-input:disabled { background: var(--color-gray-50); color: var(--color-gray-400); }
.form-error { font-size: var(--text-xs); color: var(--color-danger); }
</style>

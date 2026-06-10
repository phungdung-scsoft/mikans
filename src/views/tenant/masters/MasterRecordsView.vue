<template>
  <div class="master-records animate-fade-in">
    <div v-if="!master" class="text-muted">マスタが見つかりません</div>
    <template v-else>
      <div class="page-toolbar">
        <div class="flex items-center gap-3">
          <router-link to="/tenant/masters" class="back-link">← マスタ一覧</router-link>
          <span class="text-muted">/</span>
          <h2 class="text-lg font-semibold">{{ master.name }}</h2>
        </div>
        <div class="flex gap-3">
          <router-link :to="`/tenant/masters/${master.id}/settings`" class="btn btn-outline">
            ⚙️ フィールド設定
          </router-link>
          <button class="btn btn-primary" @click="openForm(null)">＋ レコードを追加</button>
        </div>
      </div>

      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>No.</th>
              <th v-for="f in master.fields" :key="f.id">
                {{ f.name }}
                <span v-if="f.required" class="req-mark">*</span>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, idx) in master.records" :key="record.id">
              <td class="text-muted">{{ idx + 1 }}</td>
              <td v-for="f in master.fields" :key="f.id">
                <span v-if="f.type === 'lookup'" class="text-sm">
                  {{ getLookupValue(f, record[f.code]) }}
                </span>
                <span v-else>{{ record[f.code] || '—' }}</span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="action-btn edit" @click="openForm(record)">編集</button>
                  <button class="action-btn delete" @click="deleteTarget = record">削除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!master.records.length">
              <td :colspan="master.fields.length + 2" class="empty-row">レコードがありません</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Record form modal -->
      <teleport to="body">
        <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
          <div class="modal-box wide animate-scale-in">
            <h3 class="font-semibold mb-6">{{ editingRecord ? 'レコード編集' : 'レコード登録' }}</h3>
            <form @submit.prevent="saveRecord" class="flex flex-col gap-4">
              <div v-for="f in master.fields" :key="f.id" class="form-group">
                <label class="form-label">{{ f.name }} <span v-if="f.required" class="text-danger">*</span></label>
                <select v-if="f.type === 'lookup' && f.lookupMasterId" v-model="formData[f.code]" class="form-input">
                  <option value="">選択してください</option>
                  <option v-for="r in getLookupRecords(f.lookupMasterId)" :key="r.id" :value="r[getLookupKey(f)]">
                    {{ r[getLookupKey(f)] }}
                  </option>
                </select>
                <textarea v-else-if="f.type === 'textarea'" v-model="formData[f.code]" class="form-input" rows="3"></textarea>
                <input v-else v-model="formData[f.code]" :type="f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : f.type === 'date' ? 'date' : 'text'" class="form-input" />
              </div>
              <div class="flex justify-end gap-3 mt-2">
                <button type="button" class="btn btn-ghost" @click="showForm = false">キャンセル</button>
                <button type="submit" class="btn btn-primary">{{ editingRecord ? '更新' : '登録' }}</button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
          <div class="modal-box animate-scale-in">
            <h3 class="font-semibold mb-2">レコードを削除しますか？</h3>
            <p class="text-sm text-muted mb-6">このレコードを削除します。元に戻せません。</p>
            <div class="flex justify-end gap-3">
              <button class="btn btn-ghost" @click="deleteTarget = null">キャンセル</button>
              <button class="btn btn-danger" @click="doDelete">削除する</button>
            </div>
          </div>
        </div>
      </teleport>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMastersStore } from '@/stores/masters'

const route = useRoute()
const mastersStore = useMastersStore()
const master = computed(() => mastersStore.getMaster(route.params.masterId))

const showForm = ref(false)
const editingRecord = ref(null)
const deleteTarget = ref(null)
const formData = reactive({})

function openForm(record) {
  editingRecord.value = record
  // Reset formData
  Object.keys(formData).forEach(k => delete formData[k])
  if (record) { master.value.fields.forEach(f => { formData[f.code] = record[f.code] ?? '' }) }
  else { master.value.fields.forEach(f => { formData[f.code] = '' }) }
  showForm.value = true
}

function saveRecord() {
  if (editingRecord.value) mastersStore.updateRecord(master.value.id, editingRecord.value.id, { ...formData })
  else mastersStore.addRecord(master.value.id, { ...formData })
  showForm.value = false
}

function doDelete() { mastersStore.deleteRecord(master.value.id, deleteTarget.value.id); deleteTarget.value = null }

function getLookupRecords(masterId) { return mastersStore.getMaster(masterId)?.records || [] }
function getLookupKey(field) {
  const targetMaster = mastersStore.getMaster(field.lookupMasterId)
  const targetField = targetMaster?.fields.find(f => f.id === field.lookupFieldId)
  return targetField?.code || 'id'
}
function getLookupValue(field, value) { return value || '—' }
</script>

<style scoped>
.master-records { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 11px 14px; text-align: left; font-size: var(--text-sm); }
.data-table th { color: var(--color-gray-500); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); background: var(--color-gray-50); white-space: nowrap; }
.data-table td { border-bottom: 1px solid var(--color-gray-50); }
.data-table tbody tr:hover { background: var(--color-gray-50); }
.req-mark { color: var(--color-danger); }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 48px !important; }
.action-btns { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover { background: var(--color-danger); color: white; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-box { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
.modal-box.wide { max-width: 600px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
</style>

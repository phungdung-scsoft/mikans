<template>
  <div class="master-builder animate-fade-in">
    <router-link to="/tenant/masters" class="back-link">← マスタ一覧</router-link>
    <h2 class="text-xl font-semibold mt-2 mb-6">{{ isNew ? '新しいマスタを作成' : `「${master?.name}」の設定` }}</h2>

    <!-- Step 1: Master name (new only) -->
    <div v-if="isNew" class="card mb-6" style="max-width:520px">
      <div class="card-body">
        <h3 class="font-semibold mb-4">マスタ情報</h3>
        <div class="form-group mb-4">
          <label class="form-label">マスタ名 *</label>
          <input v-model="newMasterName" class="form-input" placeholder="例: 協力会社マスタ" />
        </div>
        <button class="btn btn-primary" @click="createMaster">マスタを作成してフィールドを設定</button>
      </div>
    </div>

    <!-- Field builder -->
    <div v-if="master" class="fields-section">
      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold">フィールド設定 <span class="text-xs text-muted font-normal ml-2">（{{ master.fields.length }} フィールド）</span></h3>
          <button class="btn btn-outline" @click="addField">＋ フィールドを追加</button>
        </div>
        <div class="card-body">
          <div v-if="!master.fields.length" class="empty-fields">
            <p class="text-muted text-sm">フィールドがありません。「フィールドを追加」をクリックして設定を開始してください。</p>
          </div>

          <div v-for="(field, idx) in master.fields" :key="field.id" class="field-row animate-fade-in">
            <div class="field-order">{{ idx + 1 }}</div>
            <div class="field-config">
              <div class="field-config-row">
                <div class="form-group">
                  <label class="form-label-sm">フィールド名 *</label>
                  <input v-model="field.name" class="form-input-sm" @change="saveField(field)" />
                </div>
                <div class="form-group">
                  <label class="form-label-sm">フィールドコード</label>
                  <input v-model="field.code" class="form-input-sm font-mono" @change="saveField(field)" />
                </div>
                <div class="form-group">
                  <label class="form-label-sm">タイプ *</label>
                  <select v-model="field.type" class="form-input-sm" @change="saveField(field)">
                    <option v-for="t in FIELD_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
                  </select>
                </div>
              </div>
              <div class="field-options">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="field.required" @change="saveField(field)" />
                  <span>必須</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="field.isKey" @change="saveField(field)" />
                  <span>Key</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="field.isImport" @change="saveField(field)" />
                  <span>Import対象</span>
                </label>

                <div v-if="field.type === 'lookup'" class="lookup-config">
                  <select v-model="field.lookupMasterId" class="form-input-sm" @change="saveField(field)">
                    <option value="">参照マスタを選択</option>
                    <option v-for="m in otherMasters(master.id)" :key="m.id" :value="m.id">{{ m.name }}</option>
                  </select>
                  <select v-if="field.lookupMasterId" v-model="field.lookupFieldId" class="form-input-sm" @change="saveField(field)">
                    <option value="">参照フィールドを選択</option>
                    <option v-for="f in getLookupFields(field.lookupMasterId)" :key="f.id" :value="f.id">{{ f.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <button class="delete-field-btn" @click="deleteField(field.id)" title="削除">✕</button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <router-link :to="`/tenant/masters/${master.id}`" class="btn btn-primary">
          レコード一覧を見る →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMastersStore, FIELD_TYPES } from '@/stores/masters'

const route = useRoute()
const router = useRouter()
const mastersStore = useMastersStore()

const isNew = computed(() => route.path.endsWith('/create'))
const master = computed(() => isNew.value ? null : mastersStore.getMaster(route.params.masterId))
const newMasterName = ref('')

function createMaster() {
  if (!newMasterName.value.trim()) return
  const m = mastersStore.createMaster({ name: newMasterName.value })
  router.replace(`/tenant/masters/${m.id}/settings`)
}

function addField() {
  mastersStore.addField(master.value.id, {
    name: `フィールド${master.value.fields.length + 1}`,
    type: 'text',
    code: `field_${Date.now()}`,
    required: false,
    isKey: false,
    isImport: true
  })
}

function saveField(field) {
  mastersStore.updateField(master.value.id, field.id, { ...field })
}

function deleteField(fieldId) {
  mastersStore.deleteField(master.value.id, fieldId)
}

function otherMasters(currentId) {
  return mastersStore.masters.filter(m => m.id !== currentId)
}

function getLookupFields(masterId) {
  return mastersStore.getMaster(masterId)?.fields || []
}
</script>

<style scoped>
.master-builder { display: flex; flex-direction: column; gap: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-outline { border: 1.5px solid var(--color-primary); color: var(--color-primary); background: white; }
.btn-outline:hover { background: var(--color-primary); color: white; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.empty-fields { padding: var(--space-8); text-align: center; border: 2px dashed var(--color-gray-200); border-radius: var(--radius-lg); }
.field-row {
  display: flex; align-items: flex-start; gap: var(--space-4);
  padding: var(--space-4); border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-md); margin-bottom: var(--space-3);
  background: var(--color-gray-50); transition: var(--transition-fast);
}
.field-row:hover { border-color: var(--color-primary-light); background: white; }
.field-order { width: 24px; height: 24px; background: var(--color-primary-light); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
.field-config { flex: 1; }
.field-config-row { display: grid; grid-template-columns: 2fr 1.5fr 1.5fr; gap: var(--space-3); margin-bottom: var(--space-3); }
.field-options { display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.checkbox-item { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); cursor: pointer; }
.lookup-config { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.form-label-sm { font-size: 11px; font-weight: 600; color: var(--color-gray-500); text-transform: uppercase; letter-spacing: 0.5px; }
.form-input-sm { padding: 7px 10px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-sm); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; width: 100%; }
.form-input-sm:focus { outline: none; border-color: var(--color-primary); }
.font-mono { font-family: monospace; }
.delete-field-btn { background: none; border: none; color: var(--color-gray-300); cursor: pointer; font-size: 1rem; padding: 4px; border-radius: 4px; transition: var(--transition-fast); flex-shrink: 0; }
.delete-field-btn:hover { background: var(--color-danger-light); color: var(--color-danger); }
</style>

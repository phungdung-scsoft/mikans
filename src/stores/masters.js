import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── Field Types ──
export const FIELD_TYPES = [
  { value: 'text', label: 'テキスト (1行)' },
  { value: 'textarea', label: 'テキスト (複数行)' },
  { value: 'number', label: '数値' },
  { value: 'email', label: 'メールアドレス' },
  { value: 'date', label: '日付' },
  { value: 'lookup', label: '参照 (Lookup)' },
]

// ── Seed masters ──
const seedMasters = [
  {
    id: 'mst_dept',
    code: 'MST001',
    name: '部門管理',
    isFixed: true,
    fields: [
      { id: 'f1', code: 'dept_code', name: '部門コード', type: 'text', required: true, isImport: true, isKey: false },
      { id: 'f2', code: 'dept_name', name: '部門名', type: 'text', required: true, isImport: true, isKey: false },
      { id: 'f3', code: 'dept_note', name: 'メモ', type: 'textarea', required: false, isImport: false, isKey: false },
    ],
    records: [
      { id: 'r1', dept_code: 'B00001', dept_name: '営業部', dept_note: '' },
      { id: 'r2', dept_code: 'B00002', dept_name: '事務部', dept_note: '' },
    ],
    createdAt: '2024-01-01'
  },
  {
    id: 'mst_category_large',
    code: 'MST002',
    name: '大分類',
    isFixed: false,
    fields: [
      { id: 'f4', code: 'cat_code', name: 'コード', type: 'text', required: true, isImport: true, isKey: false },
      { id: 'f5', code: 'cat_name', name: '分類名', type: 'text', required: true, isImport: true, isKey: false },
    ],
    records: [
      { id: 'r3', cat_code: 'C001', cat_name: '土木工事' },
      { id: 'r4', cat_code: 'C002', cat_name: '建築工事' },
      { id: 'r5', cat_code: 'C003', cat_name: '設備工事' },
    ],
    createdAt: '2024-01-05'
  },
  {
    id: 'mst_category_mid',
    code: 'MST003',
    name: '中分類',
    isFixed: false,
    fields: [
      { id: 'f6', code: 'mcat_code', name: 'コード', type: 'text', required: true, isImport: true, isKey: false },
      { id: 'f7', code: 'mcat_name', name: '中分類名', type: 'text', required: true, isImport: true, isKey: false },
      { id: 'f8', code: 'mcat_parent', name: '大分類', type: 'lookup', required: true, isImport: false, isKey: false, lookupMasterId: 'mst_category_large', lookupFieldId: 'f5' },
    ],
    records: [
      { id: 'r6', mcat_code: 'M001', mcat_name: '仮設工事', mcat_parent: 'C001' },
      { id: 'r7', mcat_code: 'M002', mcat_name: '土工事', mcat_parent: 'C001' },
      { id: 'r8', mcat_code: 'M003', mcat_name: '基礎工事', mcat_parent: 'C002' },
    ],
    createdAt: '2024-01-05'
  }
]

export const useMastersStore = defineStore('masters', () => {
  const masters = ref(JSON.parse(localStorage.getItem('mikans_masters') || 'null') || seedMasters)

  function save() { localStorage.setItem('mikans_masters', JSON.stringify(masters.value)) }

  function getMaster(id) { return masters.value.find(m => m.id === id) }

  function createMaster(data) {
    const master = {
      id: `mst_${Date.now()}`,
      code: `MST${String(masters.value.length + 1).padStart(3, '0')}`,
      isFixed: false,
      fields: [],
      records: [],
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    masters.value.push(master)
    save()
    return master
  }

  function updateMaster(id, data) {
    const idx = masters.value.findIndex(m => m.id === id)
    if (idx !== -1) { masters.value[idx] = { ...masters.value[idx], ...data }; save() }
  }

  function deleteMaster(id) {
    masters.value = masters.value.filter(m => m.id !== id)
    save()
  }

  // Fields
  function addField(masterId, fieldData) {
    const master = getMaster(masterId)
    if (!master) return
    const field = {
      id: `f${Date.now()}`,
      code: fieldData.code || `field_${Date.now()}`,
      required: false,
      isImport: false,
      isKey: false,
      ...fieldData
    }
    master.fields.push(field)
    save()
    return field
  }
  function updateField(masterId, fieldId, data) {
    const master = getMaster(masterId)
    if (!master) return
    const idx = master.fields.findIndex(f => f.id === fieldId)
    if (idx !== -1) { master.fields[idx] = { ...master.fields[idx], ...data }; save() }
  }
  function deleteField(masterId, fieldId) {
    const master = getMaster(masterId)
    if (!master) return
    master.fields = master.fields.filter(f => f.id !== fieldId)
    save()
  }
  function reorderFields(masterId, newFields) {
    const master = getMaster(masterId)
    if (!master) return
    master.fields = newFields
    save()
  }

  // Records
  function addRecord(masterId, recordData) {
    const master = getMaster(masterId)
    if (!master) return
    const record = { id: `r${Date.now()}`, ...recordData }
    master.records.push(record)
    save()
    return record
  }
  function updateRecord(masterId, recordId, data) {
    const master = getMaster(masterId)
    if (!master) return
    const idx = master.records.findIndex(r => r.id === recordId)
    if (idx !== -1) { master.records[idx] = { ...master.records[idx], ...data }; save() }
  }
  function deleteRecord(masterId, recordId) {
    const master = getMaster(masterId)
    if (!master) return
    master.records = master.records.filter(r => r.id !== recordId)
    save()
  }

  return {
    masters,
    getMaster, createMaster, updateMaster, deleteMaster,
    addField, updateField, deleteField, reorderFields,
    addRecord, updateRecord, deleteRecord,
    FIELD_TYPES
  }
})

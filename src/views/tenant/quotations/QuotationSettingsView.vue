<template>
  <div class="quotation-settings animate-fade-in">
    <div class="card" style="max-width:800px">
      <div class="card-header">
        <h3 class="font-semibold">⚙️ 見積フォーマット設定</h3>
        <button class="btn btn-primary" @click="save" :disabled="saved">
          {{ saved ? '✓ 保存済み' : '保存する' }}
        </button>
      </div>
      <div class="card-body flex flex-col gap-8">
        <!-- Quotation levels -->
        <div>
          <h4 class="section-title">見積階層数</h4>
          <div class="level-selector">
            <button
              v-for="n in [1, 2, 3]" :key="n"
              class="level-btn"
              :class="{ active: form.levels === n }"
              @click="form.levels = n"
            >
              {{ n }}階層
            </button>
          </div>
          <p class="text-xs text-muted mt-2">例: 2階層 = 「1.0 仮設工事」→「1.1 足場工事」</p>
        </div>

        <!-- Header fields -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h4 class="section-title">見積ヘッダー項目</h4>
            <button class="btn btn-outline" @click="addHeaderField">＋ 追加</button>
          </div>
          <div class="header-fields-list">
            <div v-for="(f, idx) in form.headerFields" :key="f.id" class="header-field-row">
              <span class="field-num">{{ idx + 1 }}</span>
              <input v-model="f.label" class="form-input-sm flex-1" placeholder="項目名" />
              <input v-model="f.key" class="form-input-sm" style="width:140px" placeholder="フィールドキー" />
              <select v-model="f.type" class="form-input-sm" style="width:110px">
                <option value="text">テキスト</option>
                <option value="date">日付</option>
                <option value="number">数値</option>
              </select>
              <button class="del-btn" @click="form.headerFields.splice(idx, 1)">✕</button>
            </div>
          </div>
        </div>

        <!-- Cover settings placeholder -->
        <div>
          <h4 class="section-title">表紙スタイル設定</h4>
          <div class="cover-styles">
            <div
              v-for="style in coverStyles" :key="style.id"
              class="cover-style-card"
              :class="{ selected: form.coverStyle === style.id }"
              @click="form.coverStyle = style.id"
            >
              <div class="cover-preview" :style="style.preview"></div>
              <div class="text-xs font-medium mt-2">{{ style.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuotationsStore } from '@/stores/quotations'

const quotStore = useQuotationsStore()
const saved = ref(false)

const form = reactive({
  levels: quotStore.settings.levels || 2,
  headerFields: [...(quotStore.settings.headerFields || [])],
  coverStyle: 'style1'
})

const coverStyles = [
  { id: 'style1', name: 'シンプル', preview: { background: 'linear-gradient(135deg, #1e293b, #334155)' } },
  { id: 'style2', name: 'ビジネス', preview: { background: 'linear-gradient(135deg, #1e40af, #3b82f6)' } },
  { id: 'style3', name: 'エレガント', preview: { background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' } },
]

function addHeaderField() {
  form.headerFields.push({ id: `hf${Date.now()}`, label: '', key: `field_${Date.now()}`, type: 'text' })
}

function save() {
  quotStore.settings.levels = form.levels
  quotStore.settings.headerFields = form.headerFields
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
}
</script>

<style scoped>
.quotation-settings {}
.section-title { font-size: var(--text-sm); font-weight: 600; color: var(--color-gray-500); text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-gray-100); margin-bottom: var(--space-4); }
.level-selector { display: flex; gap: var(--space-3); }
.level-btn { padding: 8px 24px; border-radius: var(--radius-md); border: 1.5px solid var(--color-gray-200); background: white; font-size: var(--text-sm); font-weight: 500; cursor: pointer; transition: var(--transition-fast); color: var(--color-gray-600); }
.level-btn.active { border-color: var(--color-primary); background: var(--color-primary-light); color: var(--color-primary); }
.header-fields-list { display: flex; flex-direction: column; gap: var(--space-2); }
.header-field-row { display: flex; align-items: center; gap: var(--space-3); }
.field-num { width: 24px; height: 24px; background: var(--color-gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--color-gray-500); flex-shrink: 0; }
.form-input-sm { padding: 8px 10px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-sm); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input-sm:focus { outline: none; border-color: var(--color-primary); }
.del-btn { background: none; border: none; color: var(--color-gray-300); cursor: pointer; font-size: 1rem; padding: 4px 6px; border-radius: 4px; transition: var(--transition-fast); }
.del-btn:hover { background: var(--color-danger-light); color: var(--color-danger); }
.cover-styles { display: flex; gap: var(--space-4); flex-wrap: wrap; }
.cover-style-card { cursor: pointer; border-radius: var(--radius-md); border: 2px solid transparent; padding: 8px; text-align: center; transition: var(--transition-fast); }
.cover-style-card:hover { border-color: var(--color-gray-200); }
.cover-style-card.selected { border-color: var(--color-primary); background: var(--color-primary-light); }
.cover-preview { width: 80px; height: 60px; border-radius: var(--radius-sm); }
.btn { padding: 8px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:disabled { background: var(--color-success); }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
</style>

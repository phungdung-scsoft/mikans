<template>
  <div class="quotation-editor animate-fade-in">
    <!-- Top bar -->
    <div class="editor-topbar">
      <router-link to="/tenant/quotations" class="back-link">← 見積一覧</router-link>
      <div class="flex items-center gap-3">
        <select v-model="form.status" class="form-input-sm">
          <option value="draft">下書き</option>
          <option value="confirmed">承認済</option>
          <option value="cancelled">キャンセル</option>
        </select>
        <button class="btn btn-outline" @click="exportPdf" :disabled="exporting">
          {{ exporting ? '出力中...' : '📄 PDF出力' }}
        </button>
        <button class="btn btn-ghost" @click="cancel">キャンセル</button>
        <button class="btn btn-primary" @click="save">{{ isEdit ? '更新する' : '登録する' }}</button>
      </div>
    </div>

    <div class="editor-body" id="quotation-print-area">
      <!-- Header info -->
      <div class="card mb-5">
        <div class="card-header">
          <h3 class="font-semibold">📋 基本情報</h3>
        </div>
        <div class="card-body">
          <div class="header-grid">
            <div class="form-group">
              <label class="form-label">案件名</label>
              <input v-model="form.projectName" class="form-input" placeholder="例: A社 外構工事" />
            </div>
            <div class="form-group">
              <label class="form-label">顧客名</label>
              <input v-model="form.clientName" class="form-input" placeholder="例: 株式会社ABC" />
            </div>
            <div class="form-group">
              <label class="form-label">見積日</label>
              <input v-model="form.quoteDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">タイトル</label>
              <input v-model="form.title" class="form-input" placeholder="見積書タイトル" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quotation sheet -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold">📊 明細</h3>
          <div class="flex gap-2">
            <button class="btn btn-sm" @click="addItem(null, 1)">＋ 行追加（大）</button>
            <button class="btn btn-sm btn-outline" @click="showAiDrawer = true">🤖 AIアシスト</button>
          </div>
        </div>

        <!-- Items table -->
        <div class="sheet-wrap">
          <table class="sheet-table">
            <thead>
              <tr>
                <th style="width:40px">No.</th>
                <th style="width:200px">商品名</th>
                <th>説明</th>
                <th style="width:70px">数量</th>
                <th style="width:60px">単位</th>
                <th style="width:110px">売単価</th>
                <th style="width:110px">売上合計</th>
                <th style="width:60px">税率</th>
                <th style="width:110px">税込合計</th>
                <th style="width:110px">仕入単価</th>
                <th style="width:80px">粗利率</th>
                <th style="width:100px">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in items" :key="item.id">
                <tr :class="`level-${item.level}`">
                  <td class="num-cell text-muted">{{ getItemNo(item) }}</td>
                  <td>
                    <div class="name-cell" :style="{ paddingLeft: `${(item.level - 1) * 16}px` }">
                      <input
                        v-model="item.name"
                        class="cell-input"
                        placeholder="項目名"
                        @change="saveItem(item)"
                      />
                    </div>
                  </td>
                  <td>
                    <input v-model="item.description" class="cell-input text-muted" placeholder="説明" @change="saveItem(item)" />
                  </td>
                  <td>
                    <input v-model.number="item.quantity" type="number" min="0" class="cell-input num-cell" @input="saveItem(item)" />
                  </td>
                  <td>
                    <select v-model="item.unit" class="cell-select" @change="saveItem(item)">
                      <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
                    </select>
                  </td>
                  <td>
                    <input v-model.number="item.sellingPrice" type="number" min="0" class="cell-input num-cell" @input="saveItem(item)" />
                  </td>
                  <td class="num-cell computed">¥{{ calc(item).subtotalSell.toLocaleString() }}</td>
                  <td>
                    <select v-model.number="item.taxRate" class="cell-select" @change="saveItem(item)">
                      <option :value="0.1">10%</option>
                      <option :value="0.08">8%</option>
                      <option :value="0">0%</option>
                    </select>
                  </td>
                  <td class="num-cell computed">¥{{ calc(item).totalSell.toLocaleString() }}</td>
                  <td>
                    <input v-model.number="item.costPrice" type="number" min="0" class="cell-input num-cell text-muted" @input="saveItem(item)" />
                  </td>
                  <td class="num-cell" :class="marginClass(calc(item).marginRate)">
                    {{ calc(item).subtotalSell > 0 ? calc(item).marginRate.toFixed(1) + '%' : '—' }}
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="row-btn" title="子行追加" @click="addItem(item.id, item.level + 1)">＋子</button>
                      <button class="row-btn copy" title="コピー" @click="copyItem(item.id)">⎘</button>
                      <button class="row-btn del" title="削除" @click="deleteItem(item.id)">✕</button>
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="!items.length">
                <td colspan="12" class="empty-sheet">
                  <div>
                    <p class="text-muted mb-3">明細が空です。行を追加してください。</p>
                    <button class="btn btn-primary btn-sm" @click="addItem(null, 1)">＋ 最初の行を追加</button>
                  </div>
                </td>
              </tr>
            </tbody>
            <!-- Footer totals -->
            <tfoot v-if="items.length">
              <tr class="total-row">
                <td colspan="6" class="text-right font-semibold">売上合計 (税抜)</td>
                <td class="num-cell font-semibold text-success">¥{{ grandTotals.totalSellBeforeTax.toLocaleString() }}</td>
                <td></td>
                <td class="num-cell font-semibold">¥{{ grandTotals.totalSellWithTax.toLocaleString() }}</td>
                <td class="num-cell text-muted">¥{{ grandTotals.totalCost.toLocaleString() }}</td>
                <td class="num-cell font-semibold" :class="marginClass(grandTotals.marginRate)">
                  {{ grandTotals.marginRate.toFixed(1) }}%
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6" class="text-right text-sm text-muted">消費税合計</td>
                <td class="num-cell text-muted text-sm">¥{{ grandTotals.totalTax.toLocaleString() }}</td>
                <td colspan="5"></td>
              </tr>
              <tr>
                <td colspan="6" class="text-right text-sm text-muted">粗利益</td>
                <td class="num-cell text-sm" :class="grandTotals.grossProfit >= 0 ? 'text-success' : 'text-danger'">
                  ¥{{ grandTotals.grossProfit.toLocaleString() }}
                </td>
                <td colspan="5"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- AI Assist Drawer -->
    <teleport to="body">
      <div v-if="showAiDrawer" class="drawer-overlay" @click.self="showAiDrawer = false">
        <div class="ai-drawer animate-slide-in">
          <div class="drawer-header">
            <h3 class="font-semibold">🤖 AIアシスト</h3>
            <button class="close-btn" @click="showAiDrawer = false">✕</button>
          </div>
          <div class="drawer-body">
            <p class="text-sm text-muted mb-4">工事内容を入力してください。AIが明細行を自動生成します。</p>
            <textarea
              v-model="aiInput"
              class="form-input"
              rows="5"
              placeholder="例: 外壁塗装工事一式（高圧洗浄、下地処理、上塗り2回）、仮設足場設置10m、足場解体"
            ></textarea>
            <button class="btn btn-primary w-full mt-4" @click="runAi" :disabled="aiLoading">
              <span v-if="aiLoading" class="animate-spin">⟳</span>
              <span v-else>AIで明細を生成</span>
            </button>

            <div v-if="aiResults.length" class="ai-results animate-fade-in mt-4">
              <h4 class="text-sm font-semibold mb-3">生成された明細 (確認して追加)</h4>
              <div v-for="(r, i) in aiResults" :key="i" class="ai-result-item">
                <input type="checkbox" v-model="r.selected" :id="`ai-result-${i}`" />
                <div class="flex-1">
                  <label :for="`ai-result-${i}`" class="text-sm font-medium cursor-pointer">{{ r.name }}</label>
                  <div class="text-xs text-muted">{{ r.description }} | {{ r.quantity }}{{ r.unit }} | ¥{{ r.sellingPrice.toLocaleString() }}</div>
                </div>
              </div>
              <button class="btn btn-primary w-full mt-3" @click="insertAiResults">
                選択した行を追加 ({{ aiResults.filter(r => r.selected).length }}行)
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationsStore, calcItem } from '@/stores/quotations'

const route = useRoute()
const router = useRouter()
const quotStore = useQuotationsStore()

const isEdit = computed(() => !!route.params.id)
const quotation = computed(() => isEdit.value ? quotStore.getQuotation(route.params.id) : null)

const units = ['式', 'm', 'm2', 'm3', '本', '個', '台', '枚', '冊', '人工', '日']

// Form data
const form = reactive({
  title: '',
  projectName: '',
  clientName: '',
  quoteDate: new Date().toISOString().slice(0, 10),
  status: 'draft'
})

// Items (reactive clone)
const items = ref([])

// AI
const showAiDrawer = ref(false)
const aiInput = ref('')
const aiLoading = ref(false)
const aiResults = ref([])

// PDF
const exporting = ref(false)

// Working quotation ID (for new quotation)
const workingId = ref(null)

onMounted(() => {
  if (quotation.value) {
    Object.assign(form, {
      title: quotation.value.title,
      projectName: quotation.value.projectName,
      clientName: quotation.value.clientName,
      quoteDate: quotation.value.quoteDate,
      status: quotation.value.status
    })
    items.value = [...quotation.value.items.map(i => ({ ...i }))]
    workingId.value = quotation.value.id
  } else {
    // Create a temporary draft quotation
    const q = quotStore.createQuotation({ title: '新規見積', projectName: '', clientName: '', quoteDate: form.quoteDate })
    workingId.value = q.id
    items.value = []
  }
})

function calc(item) { return calcItem(item) }

function marginClass(rate) {
  if (rate > 30) return 'text-success'
  if (rate > 10) return 'text-warning'
  return 'text-danger'
}

const grandTotals = computed(() => {
  let totalSellBeforeTax = 0, totalTax = 0, totalSellWithTax = 0, totalCost = 0
  items.value.forEach(item => {
    const c = calcItem(item)
    totalSellBeforeTax += c.subtotalSell
    totalTax += c.taxSell
    totalSellWithTax += c.totalSell
    totalCost += c.totalCost
  })
  const grossProfit = totalSellBeforeTax - totalCost
  const marginRate = totalSellBeforeTax > 0 ? (grossProfit / totalSellBeforeTax) * 100 : 0
  return { totalSellBeforeTax, totalTax, totalSellWithTax, totalCost, grossProfit, marginRate }
})

// Item numbering
function getItemNo(item) {
  let parentCount = 0, childCount = 0
  for (const i of items.value) {
    if (i.id === item.id) break
    if (i.level === 1) { parentCount++; childCount = 0 }
    else if (i.level === 2 && item.level === 2) childCount++
  }
  if (item.level === 1) return `${parentCount + 1}`
  return `${parentCount}.${childCount + 1}`
}

function addItem(afterId, level) {
  const newItem = {
    id: `qi${Date.now()}`,
    parentId: afterId && level > 1 ? afterId : null,
    level: Math.min(level, 3),
    productId: null,
    name: '',
    description: '',
    quantity: 1,
    unit: '式',
    sellingPrice: 0,
    costPrice: 0,
    taxRate: 0.1
  }
  if (afterId) {
    const idx = items.value.findIndex(i => i.id === afterId)
    items.value.splice(idx + 1, 0, newItem)
  } else {
    items.value.push(newItem)
  }
}

function saveItem(item) {
  // Items stored in reactive ref, no separate save needed
}

function copyItem(itemId) {
  const original = items.value.find(i => i.id === itemId)
  if (!original) return
  const copy = { ...original, id: `qi${Date.now()}`, name: `${original.name} (コピー)` }
  const idx = items.value.findIndex(i => i.id === itemId)
  items.value.splice(idx + 1, 0, copy)
}

function deleteItem(itemId) {
  const toDelete = new Set([itemId])
  let changed = true
  while (changed) {
    changed = false
    items.value.forEach(i => {
      if (i.parentId && toDelete.has(i.parentId) && !toDelete.has(i.id)) {
        toDelete.add(i.id); changed = true
      }
    })
  }
  items.value = items.value.filter(i => !toDelete.has(i.id))
}

function save() {
  const data = { ...form, items: items.value }
  if (isEdit.value) {
    quotStore.updateQuotation(route.params.id, data)
  } else {
    quotStore.updateQuotation(workingId.value, data)
  }
  router.push('/tenant/quotations')
}

function cancel() {
  if (!isEdit.value && workingId.value) {
    quotStore.deleteQuotation(workingId.value)
  }
  router.push('/tenant/quotations')
}

// Mock AI
async function runAi() {
  if (!aiInput.value.trim()) return
  aiLoading.value = true
  await new Promise(r => setTimeout(r, 1800))
  aiResults.value = [
    { name: '高圧洗浄工事', description: '外壁高圧洗浄一式', quantity: 1, unit: '式', sellingPrice: 80000, costPrice: 50000, taxRate: 0.1, selected: true },
    { name: '下地処理', description: 'ひび割れ補修・シーリング', quantity: 1, unit: '式', sellingPrice: 120000, costPrice: 75000, taxRate: 0.1, selected: true },
    { name: '外壁上塗り', description: 'シリコン塗装2回塗り', quantity: 150, unit: 'm2', sellingPrice: 2500, costPrice: 1500, taxRate: 0.1, selected: true },
    { name: '仮設足場設置', description: '枠組足場一式', quantity: 10, unit: '式', sellingPrice: 30000, costPrice: 18000, taxRate: 0.1, selected: true },
    { name: '足場解体撤去', description: '解体及び清掃', quantity: 1, unit: '式', sellingPrice: 40000, costPrice: 25000, taxRate: 0.1, selected: false },
  ]
  aiLoading.value = false
}

function insertAiResults() {
  const selected = aiResults.value.filter(r => r.selected)
  selected.forEach(r => {
    items.value.push({
      id: `qi${Date.now()}_${Math.random()}`,
      parentId: null, level: 1,
      productId: null,
      name: r.name, description: r.description,
      quantity: r.quantity, unit: r.unit,
      sellingPrice: r.sellingPrice, costPrice: r.costPrice, taxRate: r.taxRate
    })
  })
  showAiDrawer.value = false
  aiResults.value = []
  aiInput.value = ''
}

async function exportPdf() {
  exporting.value = true
  try {
    const { default: html2pdf } = await import('html2pdf.js')
    const el = document.getElementById('quotation-print-area')
    await html2pdf().set({
      margin: 10, filename: `${form.title || '見積書'}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).from(el).save()
  } catch (e) { console.error(e) }
  finally { exporting.value = false }
}
</script>

<style scoped>
.quotation-editor { display: flex; flex-direction: column; gap: var(--space-5); }

.editor-topbar {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  background: white; border: 1px solid var(--color-gray-200); border-radius: var(--card-radius);
  padding: var(--space-3) var(--space-5); position: sticky; top: calc(var(--header-height) + 8px); z-index: 10;
  box-shadow: var(--card-shadow);
}
.back-link { font-size: var(--text-sm); color: var(--color-primary); }

.header-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }

/* Sheet */
.sheet-wrap { overflow-x: auto; }
.sheet-table { width: 100%; border-collapse: collapse; min-width: 1100px; font-size: var(--text-sm); }
.sheet-table th { background: var(--color-gray-50); color: var(--color-gray-500); font-weight: 600; font-size: 11px; padding: 10px 8px; text-align: left; border-bottom: 2px solid var(--color-gray-200); white-space: nowrap; position: sticky; top: 0; }
.sheet-table td { padding: 6px 8px; border-bottom: 1px solid var(--color-gray-100); vertical-align: middle; }
.sheet-table tbody tr:hover { background: var(--color-gray-50); }

.level-1 { background: white; }
.level-2 { background: #fafbff; }
.level-2 td:first-child { border-left: 3px solid var(--color-primary-light); }
.level-3 { background: #f9f9ff; }
.level-3 td:first-child { border-left: 3px solid var(--color-secondary-light); }

.name-cell { display: flex; align-items: center; }
.cell-input { border: none; background: transparent; font-size: var(--text-sm); width: 100%; padding: 4px 6px; border-radius: 4px; font-family: inherit; color: var(--color-gray-800); }
.cell-input:focus { outline: none; background: var(--color-primary-light); }
.cell-select { border: 1px solid var(--color-gray-200); background: transparent; font-size: var(--text-sm); padding: 4px 6px; border-radius: 4px; font-family: inherit; width: 100%; }
.cell-select:focus { outline: none; border-color: var(--color-primary); }
.num-cell { text-align: right; font-variant-numeric: tabular-nums; }
.computed { color: var(--color-gray-700); background: var(--color-gray-50); font-weight: 500; }

.empty-sheet { text-align: center; padding: 60px 24px !important; }
.total-row { background: var(--color-gray-50); border-top: 2px solid var(--color-gray-200); }
.total-row td { padding: 12px 8px; }
.text-right { text-align: right; }

.row-actions { display: flex; gap: 4px; justify-content: center; }
.row-btn { padding: 3px 7px; border-radius: 4px; border: none; cursor: pointer; font-size: 11px; font-weight: 600; transition: var(--transition-fast); background: var(--color-gray-100); color: var(--color-gray-600); }
.row-btn:hover { background: var(--color-primary-light); color: var(--color-primary); }
.row-btn.copy:hover { background: var(--color-accent-light); color: var(--color-info); }
.row-btn.del:hover { background: var(--color-danger-light); color: var(--color-danger); }

/* Buttons */
.btn { padding: 8px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
.btn-sm { padding: 5px 12px; font-size: var(--text-xs); }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.w-full { width: 100%; justify-content: center; }
.form-input-sm { padding: 7px 10px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-sm); font-size: var(--text-sm); font-family: inherit; }
.form-input-sm:focus { outline: none; border-color: var(--color-primary); }

/* AI Drawer */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: var(--z-modal); display: flex; justify-content: flex-end; }
.ai-drawer { width: 420px; height: 100vh; background: white; box-shadow: -8px 0 32px rgba(0,0,0,0.15); display: flex; flex-direction: column; }
.drawer-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-gray-100); }
.close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--color-gray-400); padding: 4px; border-radius: 4px; }
.close-btn:hover { background: var(--color-gray-100); color: var(--color-gray-700); }
.drawer-body { flex: 1; overflow-y: auto; padding: var(--space-6); }
.ai-result-item { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--color-gray-100); border-radius: var(--radius-md); margin-bottom: var(--space-2); transition: var(--transition-fast); }
.ai-result-item:hover { border-color: var(--color-primary-light); background: var(--color-gray-50); }
</style>

<template>
  <div class="quotation-detail animate-fade-in">
    <div v-if="!q">見積が見つかりません</div>
    <template v-else>
      <div class="detail-topbar">
        <router-link to="/tenant/quotations" class="back-link">← 見積一覧</router-link>
        <div class="flex gap-3">
          <router-link :to="`/tenant/quotations/${q.id}/edit`" class="btn btn-outline">✏️ 編集</router-link>
          <button class="btn btn-primary" @click="exportPdf" :disabled="exporting">
            {{ exporting ? '...' : '📄 PDF出力' }}
          </button>
        </div>
      </div>

      <div id="print-area">
        <!-- Header -->
        <div class="card mb-5">
          <div class="card-body">
            <div class="detail-header-grid">
              <div>
                <p class="info-label">案件名</p>
                <p class="info-value">{{ q.projectName || '—' }}</p>
              </div>
              <div>
                <p class="info-label">顧客名</p>
                <p class="info-value">{{ q.clientName }}</p>
              </div>
              <div>
                <p class="info-label">見積日</p>
                <p class="info-value">{{ q.quoteDate }}</p>
              </div>
              <div>
                <p class="info-label">ステータス</p>
                <span class="status-chip" :class="q.status">{{ statusLabel(q.status) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="card">
          <div class="card-header">
            <h3 class="font-semibold">明細</h3>
          </div>
          <div style="overflow-x:auto">
            <table class="sheet-table">
              <thead>
                <tr>
                  <th>No.</th><th>項目名</th><th>数量</th><th>単位</th>
                  <th>売単価</th><th>売上(税抜)</th><th>税率</th><th>税込合計</th><th>粗利率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in q.items" :key="item.id" :class="`level-${item.level}`">
                  <td class="text-muted text-xs">{{ item.level }}</td>
                  <td class="font-medium" :style="{ paddingLeft: `${(item.level-1)*16 + 12}px` }">{{ item.name }}</td>
                  <td class="num-cell">{{ item.quantity }}</td>
                  <td>{{ item.unit }}</td>
                  <td class="num-cell">¥{{ item.sellingPrice.toLocaleString() }}</td>
                  <td class="num-cell">¥{{ calc(item).subtotalSell.toLocaleString() }}</td>
                  <td>{{ (item.taxRate * 100).toFixed(0) }}%</td>
                  <td class="num-cell font-medium">¥{{ calc(item).totalSell.toLocaleString() }}</td>
                  <td class="num-cell" :class="marginClass(calc(item).marginRate)">
                    {{ calc(item).subtotalSell > 0 ? calc(item).marginRate.toFixed(1)+'%' : '—' }}
                  </td>
                </tr>
                <tr v-if="!q.items.length">
                  <td colspan="9" class="empty-row">明細なし</td>
                </tr>
              </tbody>
              <tfoot v-if="q.items.length">
                <tr class="total-row">
                  <td colspan="5" class="text-right font-semibold">合計 (税抜)</td>
                  <td class="num-cell font-bold text-success">¥{{ totals.totalSellBeforeTax.toLocaleString() }}</td>
                  <td></td>
                  <td class="num-cell font-bold">¥{{ totals.totalSellWithTax.toLocaleString() }}</td>
                  <td class="num-cell font-bold" :class="marginClass(totals.marginRate)">{{ totals.marginRate.toFixed(1) }}%</td>
                </tr>
                <tr>
                  <td colspan="5" class="text-right text-sm text-muted">消費税</td>
                  <td class="num-cell text-muted">¥{{ totals.totalTax.toLocaleString() }}</td>
                  <td colspan="3"></td>
                </tr>
                <tr>
                  <td colspan="5" class="text-right text-sm text-muted">粗利益</td>
                  <td class="num-cell" :class="totals.grossProfit >= 0 ? 'text-success' : 'text-danger'">
                    ¥{{ totals.grossProfit.toLocaleString() }}
                  </td>
                  <td colspan="3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuotationsStore, calcItem } from '@/stores/quotations'

const route = useRoute()
const quotStore = useQuotationsStore()
const q = computed(() => quotStore.getQuotation(route.params.id))
const exporting = ref(false)

const STATUS_MAP = { draft: '下書き', confirmed: '承認済', cancelled: 'キャンセル' }
function statusLabel(s) { return STATUS_MAP[s] || s }
function calc(item) { return calcItem(item) }
function marginClass(rate) {
  if (rate > 30) return 'text-success'
  if (rate > 10) return 'text-warning'
  return 'text-danger'
}

const totals = computed(() => {
  if (!q.value) return {}
  return quotStore.computeTotals(q.value.id)
})

async function exportPdf() {
  exporting.value = true
  try {
    const { default: html2pdf } = await import('html2pdf.js')
    await html2pdf().set({
      margin: 10, filename: `${q.value.title || '見積書'}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).from(document.getElementById('print-area')).save()
  } finally { exporting.value = false }
}
</script>

<style scoped>
.quotation-detail { display: flex; flex-direction: column; gap: var(--space-5); }
.detail-topbar { display: flex; align-items: center; justify-content: space-between; }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.detail-header-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }
.info-label { font-size: var(--text-xs); color: var(--color-gray-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.info-value { font-size: var(--text-base); font-weight: var(--font-medium); }
.status-chip { display: inline-flex; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
.status-chip.draft { background: var(--color-gray-100); color: var(--color-gray-600); }
.status-chip.confirmed { background: var(--color-success-light); color: var(--color-success); }
.status-chip.cancelled { background: var(--color-danger-light); color: var(--color-danger); }
.btn { padding: 8px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.btn-outline { border: 1.5px solid var(--color-gray-200); background: white; color: var(--color-gray-700); }
.btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }
.sheet-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); min-width: 900px; }
.sheet-table th { background: var(--color-gray-50); color: var(--color-gray-500); font-weight: 600; font-size: 11px; padding: 10px 12px; text-align: left; border-bottom: 2px solid var(--color-gray-200); white-space: nowrap; }
.sheet-table td { padding: 10px 12px; border-bottom: 1px solid var(--color-gray-100); }
.level-2 { background: #fafbff; }
.level-2 td:first-child { border-left: 3px solid var(--color-primary-light); }
.num-cell { text-align: right; font-variant-numeric: tabular-nums; }
.empty-row { text-align: center; color: var(--color-gray-400); padding: 32px !important; }
.total-row { background: var(--color-gray-50); border-top: 2px solid var(--color-gray-200); }
.total-row td { padding: 12px; }
.text-right { text-align: right; }
</style>

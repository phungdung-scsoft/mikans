<template>
  <div class="tenant-accounting animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">管理会計表 (Management Accounting)</h2>
      <button class="btn btn-outline">エクスポート</button>
    </div>

    <div class="card mb-6">
      <div class="card-body">
        <div class="flex gap-4 items-end">
          <div class="form-group">
            <label>対象期間</label>
            <input type="month" class="form-input" value="2024-06" />
          </div>
          <div class="form-group">
            <label>表示モード</label>
            <select v-model="viewMode" class="form-input">
              <option value="revenue">売上 (Revenue)</option>
              <option value="cost">原価 (Cost)</option>
              <option value="gross">粗利益 (Gross Profit)</option>
              <option value="margin">粗利率 (Profit Rate)</option>
            </select>
          </div>
          <button class="btn btn-primary">集計する</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3 class="font-semibold">部門別集計 (Mock Data)</h3></div>
      <div class="card-body p-0" style="overflow-x:auto">
        <table class="pivot-table">
          <thead>
            <tr>
              <th>部門 / 月</th>
              <th class="text-right">1月</th>
              <th class="text-right">2月</th>
              <th class="text-right">3月</th>
              <th class="text-right">4月</th>
              <th class="text-right">5月</th>
              <th class="text-right">6月</th>
              <th class="text-right font-bold">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-medium">営業部</td>
              <td class="text-right">¥1,200,000</td>
              <td class="text-right">¥1,500,000</td>
              <td class="text-right">¥2,100,000</td>
              <td class="text-right">¥1,800,000</td>
              <td class="text-right">¥2,400,000</td>
              <td class="text-right">¥3,000,000</td>
              <td class="text-right font-bold">¥12,000,000</td>
            </tr>
            <tr>
              <td class="font-medium">技術部</td>
              <td class="text-right">¥800,000</td>
              <td class="text-right">¥900,000</td>
              <td class="text-right">¥1,100,000</td>
              <td class="text-right">¥1,050,000</td>
              <td class="text-right">¥1,300,000</td>
              <td class="text-right">¥1,600,000</td>
              <td class="text-right font-bold">¥6,750,000</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td class="font-bold">総合計</td>
              <td class="text-right font-bold text-primary">¥2,000,000</td>
              <td class="text-right font-bold text-primary">¥2,400,000</td>
              <td class="text-right font-bold text-primary">¥3,200,000</td>
              <td class="text-right font-bold text-primary">¥2,850,000</td>
              <td class="text-right font-bold text-primary">¥3,700,000</td>
              <td class="text-right font-bold text-primary">¥4,600,000</td>
              <td class="text-right font-bold text-primary">¥18,750,000</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const viewMode = ref('revenue')
</script>

<style scoped>
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: 12px; font-weight: 500; color: var(--color-gray-600); }
.form-input { padding: 8px 12px; border: 1px solid var(--color-gray-200); border-radius: 6px; font-size: 14px; min-width: 200px; }
.pivot-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.pivot-table th { background: var(--color-gray-50); padding: 12px; border-bottom: 2px solid var(--color-gray-200); color: var(--color-gray-500); }
.pivot-table td { padding: 12px; border-bottom: 1px solid var(--color-gray-100); }
.pivot-table tfoot td { border-top: 2px solid var(--color-gray-200); border-bottom: none; }
</style>

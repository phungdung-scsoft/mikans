<template>
  <div class="tenant-dashboard animate-fade-in">
    <div class="welcome-box mb-6">
      <h2 class="text-xl font-bold mb-2">こんにちは、{{ auth.user?.name }} さん</h2>
      <p class="text-muted">MIKANS ワークスペースへようこそ。本日の業務状況をご確認ください。</p>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon">📋</div>
        <div class="kpi-info">
          <div class="kpi-label">今月の見積件数</div>
          <div class="kpi-value">24<span class="text-sm font-normal text-muted ml-1">件</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-success-light text-success">¥</div>
        <div class="kpi-info">
          <div class="kpi-label">今月の見積総額</div>
          <div class="kpi-value">8,450,000<span class="text-sm font-normal text-muted ml-1">円</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon bg-info-light text-info">📥</div>
        <div class="kpi-info">
          <div class="kpi-label">インポート件数</div>
          <div class="kpi-value">12<span class="text-sm font-normal text-muted ml-1">件</span></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <!-- 最近の見積 -->
      <div class="card">
        <div class="card-header flex justify-between">
          <h3 class="font-semibold">最近作成した見積</h3>
          <router-link to="/tenant/quotations" class="text-sm text-primary">すべて見る</router-link>
        </div>
        <div class="card-body p-0">
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b last:border-none">
                <td class="p-3">A社 外構工事</td>
                <td class="p-3 text-right">¥550,000</td>
                <td class="p-3 text-right"><span class="badge bg-gray-100 text-gray-600">下書き</span></td>
              </tr>
              <tr class="border-b last:border-none">
                <td class="p-3">株式会社XYZ 本社建設</td>
                <td class="p-3 text-right">¥12,400,000</td>
                <td class="p-3 text-right"><span class="badge bg-success-light text-success">承認済</span></td>
              </tr>
              <tr class="border-b last:border-none">
                <td class="p-3">田中邸 リフォーム</td>
                <td class="p-3 text-right">¥850,000</td>
                <td class="p-3 text-right"><span class="badge bg-danger-light text-danger">キャンセル</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 最近のアクティビティ -->
      <div class="card">
        <div class="card-header">
          <h3 class="font-semibold">最新のアクティビティ</h3>
        </div>
        <div class="card-body">
          <ul class="activity-list">
            <li>
              <span class="time">10:30</span>
              <span class="desc">「A社 外構工事」の見積を作成しました。</span>
            </li>
            <li>
              <span class="time">昨日</span>
              <span class="desc">商品マスタ「建材データ.xlsx」をインポートしました。</span>
            </li>
            <li>
              <span class="time">昨日</span>
              <span class="desc">「株式会社XYZ 本社建設」が承認されました。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.kpi-card {
  background: white; border-radius: var(--card-radius); padding: var(--space-5);
  box-shadow: var(--card-shadow); display: flex; align-items: center; gap: var(--space-4);
}
.kpi-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--color-primary-light); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;
}
.kpi-label { font-size: var(--text-sm); color: var(--color-gray-500); font-weight: 500; margin-bottom: 4px; }
.kpi-value { font-size: 24px; font-weight: 700; color: var(--color-gray-800); }
.badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }

.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-list li { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--color-gray-100); }
.activity-list li:last-child { border: none; }
.time { font-size: 12px; color: var(--color-gray-400); width: 40px; flex-shrink: 0; }
.desc { font-size: 14px; color: var(--color-gray-700); }
</style>

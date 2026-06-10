<template>
  <div class="dashboard-view animate-fade-in">
    <!-- Stats row -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
        <div class="stat-body">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label text-muted text-sm">{{ stat.label }}</div>
        </div>
        <div class="stat-trend" :class="stat.trendUp ? 'up' : 'down'">
          {{ stat.trendUp ? '▲' : '▼' }} {{ stat.trend }}
        </div>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="dashboard-grid">
      <!-- Top 10 ranking -->
      <div class="card ranking-card">
        <div class="card-header">
          <h3 class="text-base font-semibold">🏆 見積登録数 ランキング TOP10</h3>
          <span class="text-xs text-muted">今月</span>
        </div>
        <div class="card-body">
          <div
            v-for="(item, idx) in dashboard.topCustomers"
            :key="item.name"
            class="rank-item"
          >
            <span class="rank-num" :class="`rank-${idx + 1}`">{{ idx + 1 }}</span>
            <span class="rank-name flex-1">{{ item.name }}</span>
            <div class="rank-bar-wrap">
              <div
                class="rank-bar"
                :style="{ width: `${(item.count / dashboard.topCustomers[0].count) * 100}%` }"
              ></div>
            </div>
            <span class="rank-count text-sm font-medium">{{ item.count.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Recent customers -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-base font-semibold">📋 最近登録した顧客</h3>
          <router-link to="/admin/customers" class="text-xs text-primary">すべて表示 →</router-link>
        </div>
        <div class="card-body p-0">
          <table class="mini-table">
            <thead>
              <tr>
                <th>顧客名</th>
                <th>プラン</th>
                <th>ステータス</th>
                <th>登録日</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in recentCustomers" :key="c.id">
                <td class="font-medium">{{ c.name }}</td>
                <td><span class="chip chip-blue">{{ getPlanName(c.planId) }}</span></td>
                <td>
                  <span class="chip" :class="c.active ? 'chip-green' : 'chip-gray'">
                    {{ c.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="text-muted">{{ c.createdAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const admin = useAdminStore()
const { dashboardStats: dashboard, customers, plans } = admin

const stats = computed(() => [
  { icon: '🏢', label: 'アクティブ顧客数', value: dashboard.totalActiveCustomers.toLocaleString(), bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', trend: '+12%', trendUp: true },
  { icon: '📋', label: '総見積登録数', value: dashboard.totalQuotations.toLocaleString(), bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', trend: '+8.3%', trendUp: true },
  { icon: '📦', label: 'プラン数', value: plans.length, bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', trend: '±0', trendUp: true },
  { icon: '📈', label: '今月の新規顧客', value: 24, bg: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)', trend: '+3', trendUp: true },
])

const recentCustomers = computed(() => [...customers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6))

function getPlanName(planId) {
  return plans.find(p => p.id === planId)?.name || '—'
}
</script>

<style scoped>
.dashboard-view { display: flex; flex-direction: column; gap: var(--space-6); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
@media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: var(--card-bg);
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: var(--transition-normal);
  animation: fadeIn 0.4s ease both;
}
.stat-card:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-2px); }
.stat-card:nth-child(2) { animation-delay: 0.08s; }
.stat-card:nth-child(3) { animation-delay: 0.16s; }
.stat-card:nth-child(4) { animation-delay: 0.24s; }

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.stat-body { flex: 1; }
.stat-value { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--color-gray-900); }
.stat-trend { font-size: var(--text-xs); font-weight: var(--font-medium); }
.stat-trend.up { color: var(--color-success); }
.stat-trend.down { color: var(--color-danger); }

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}
@media (max-width: 1100px) { .dashboard-grid { grid-template-columns: 1fr; } }

.ranking-card .card-body { padding: var(--space-2) var(--space-4); }
.rank-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 0;
  border-bottom: 1px solid var(--color-gray-50);
  animation: slideInLeft 0.3s ease both;
}
.rank-item:last-child { border-bottom: none; }

.rank-num {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  flex-shrink: 0;
}
.rank-1 { background: linear-gradient(135deg,#fbbf24,#f59e0b); color: white; }
.rank-2 { background: linear-gradient(135deg,#94a3b8,#64748b); color: white; }
.rank-3 { background: linear-gradient(135deg,#fb923c,#f97316); color: white; }

.rank-name { font-size: var(--text-sm); font-weight: var(--font-medium); }
.rank-bar-wrap {
  width: 100px;
  height: 6px;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.rank-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}
.rank-count { width: 40px; text-align: right; color: var(--color-gray-700); }

/* Table */
.mini-table { width: 100%; border-collapse: collapse; }
.mini-table th, .mini-table td {
  padding: 10px 16px;
  text-align: left;
  font-size: var(--text-xs);
}
.mini-table th {
  background: var(--color-gray-50);
  color: var(--color-gray-500);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.mini-table tbody tr:hover { background: var(--color-gray-50); }
.mini-table td { color: var(--color-gray-700); border-bottom: 1px solid var(--color-gray-50); }

/* Chips */
.chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-medium);
}
.chip-blue { background: var(--color-primary-light); color: var(--color-primary-dark); }
.chip-green { background: var(--color-success-light); color: var(--color-success); }
.chip-gray { background: var(--color-gray-100); color: var(--color-gray-500); }
</style>

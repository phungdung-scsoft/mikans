<template>
  <div class="customer-detail animate-fade-in">
    <div v-if="!customer" class="text-muted">顧客が見つかりません</div>
    <template v-else>
      <div class="detail-header">
        <router-link to="/admin/customers" class="back-link">← 顧客一覧</router-link>
        <div class="flex items-center gap-4 mt-4">
          <div class="customer-avatar">{{ customer.name[0] }}</div>
          <div>
            <h2 class="text-2xl font-bold">{{ customer.name }}</h2>
            <div class="flex items-center gap-3 mt-1">
              <span class="status-chip" :class="customer.active ? 'active' : 'inactive'">
                {{ customer.active ? 'Active' : 'Inactive' }}
              </span>
              <span class="text-sm text-muted">{{ getPlanName(customer.planId) }}</span>
            </div>
          </div>
          <div class="ml-auto flex gap-3">
            <router-link :to="`/admin/tenants/${customer.id}/setup`" class="btn btn-outline">⚙️ セットアップ</router-link>
            <router-link :to="`/admin/customers/${customer.id}/edit`" class="btn btn-outline">✏️ 編集</router-link>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">基本情報</h3></div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item"><span class="info-label">顧客コード</span><span class="code-chip">{{ customer.code }}</span></div>
              <div class="info-item"><span class="info-label">担当者名</span><span>{{ customer.contactName || '—' }}</span></div>
              <div class="info-item"><span class="info-label">電話番号</span><span>{{ customer.phone || '—' }}</span></div>
              <div class="info-item"><span class="info-label">メールアドレス</span><span>{{ customer.email || '—' }}</span></div>
              <div class="info-item"><span class="info-label">登録日</span><span>{{ customer.createdAt }}</span></div>
              <div class="info-item"><span class="info-label">メモ</span><span>{{ customer.note || '—' }}</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="font-semibold">利用状況</h3></div>
          <div class="card-body">
            <div class="usage-stats">
              <div class="usage-stat">
                <div class="usage-num">{{ customer.userCount }}</div>
                <div class="text-sm text-muted">ユーザー数</div>
              </div>
              <div class="usage-stat">
                <div class="usage-num">{{ customer.quotationCount.toLocaleString() }}</div>
                <div class="text-sm text-muted">見積登録数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const admin = useAdminStore()
const customer = computed(() => admin.getCustomer(route.params.id))
function getPlanName(planId) { return admin.plans.find(p => p.id === planId)?.name || '—' }
</script>

<style scoped>
.customer-detail { display: flex; flex-direction: column; gap: var(--space-6); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.customer-avatar {
  width: 56px; height: 56px; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white; font-size: var(--text-xl); font-weight: var(--font-bold);
  display: flex; align-items: center; justify-content: center;
}
.status-chip { display: inline-flex; padding: 3px 10px; border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: 600; }
.status-chip.active { background: var(--color-success-light); color: var(--color-success); }
.status-chip.inactive { background: var(--color-gray-100); color: var(--color-gray-500); }
.btn { padding: 8px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); }
.btn-outline { border: 1.5px solid var(--color-primary); color: var(--color-primary); background: white; }
.btn-outline:hover { background: var(--color-primary); color: white; }
.detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); }
.info-grid { display: flex; flex-direction: column; gap: var(--space-4); }
.info-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-gray-50); font-size: var(--text-sm); }
.info-label { color: var(--color-gray-500); font-weight: 500; }
.code-chip { font-family: var(--font-mono); font-size: var(--text-xs); background: var(--color-gray-100); padding: 2px 8px; border-radius: var(--radius-sm); }
.usage-stats { display: flex; gap: var(--space-6); }
.usage-stat { text-align: center; }
.usage-num { font-size: var(--text-3xl); font-weight: var(--font-bold); color: var(--color-primary); }
</style>

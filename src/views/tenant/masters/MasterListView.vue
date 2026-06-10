<template>
  <div class="masters-list animate-fade-in">
    <div class="page-toolbar">
      <h3 class="text-lg font-semibold">マスタ一覧</h3>
      <router-link to="/tenant/masters/create" class="btn btn-primary">＋ 新しいマスタを作成</router-link>
    </div>

    <div class="masters-grid">
      <div v-for="m in masters.masters" :key="m.id" class="master-card animate-fade-in">
        <div class="master-icon">🗂️</div>
        <div class="master-body">
          <div class="font-semibold">{{ m.name }}</div>
          <div class="text-xs text-muted mt-1">
            <span>{{ m.fields.length }} フィールド</span>
            &nbsp;·&nbsp;
            <span>{{ m.records.length }} レコード</span>
          </div>
          <div v-if="m.isFixed" class="fixed-badge">固定マスタ</div>
        </div>
        <div class="master-actions">
          <router-link :to="`/tenant/masters/${m.id}`" class="action-btn view">レコード</router-link>
          <router-link :to="`/tenant/masters/${m.id}/settings`" class="action-btn edit" :class="{ disabled: m.isFixed }">設定</router-link>
          <button class="action-btn delete" @click="confirmDelete(m)" :disabled="m.isFixed">削除</button>
        </div>
      </div>

      <div v-if="!masters.masters.length" class="empty-state">
        <div class="empty-icon">🗂️</div>
        <p class="font-medium mb-1">マスタがありません</p>
        <p class="text-sm text-muted mb-4">新しいマスタを作成してデータを管理しましょう</p>
        <router-link to="/tenant/masters/create" class="btn btn-primary">マスタを作成</router-link>
      </div>
    </div>

    <teleport to="body">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box animate-scale-in">
          <h3 class="font-semibold mb-2">マスタを削除しますか？</h3>
          <p class="text-sm text-muted mb-2">「{{ deleteTarget.name }}」とすべてのレコードを削除します。</p>
          <p class="text-xs text-danger mb-6">※ この操作は元に戻せません。</p>
          <div class="flex justify-end gap-3">
            <button class="btn btn-ghost" @click="deleteTarget = null">キャンセル</button>
            <button class="btn btn-danger" @click="doDelete">削除する</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMastersStore } from '@/stores/masters'

const masters = useMastersStore()
const deleteTarget = ref(null)

function confirmDelete(m) { if (!m.isFixed) deleteTarget.value = m }
function doDelete() { masters.deleteMaster(deleteTarget.value.id); deleteTarget.value = null }
</script>

<style scoped>
.masters-list { display: flex; flex-direction: column; gap: var(--space-5); }
.page-toolbar { display: flex; align-items: center; justify-content: space-between; }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-danger { background: var(--color-danger); color: white; }
.masters-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }
.master-card {
  background: white; border: 1px solid var(--color-gray-200); border-radius: var(--card-radius);
  padding: var(--space-5); display: flex; gap: var(--space-4); align-items: flex-start;
  transition: var(--transition-normal);
  box-shadow: var(--card-shadow);
}
.master-card:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-2px); }
.master-icon { font-size: 2rem; width: 48px; height: 48px; background: var(--color-primary-light); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.master-body { flex: 1; }
.fixed-badge { display: inline-flex; margin-top: 6px; padding: 2px 8px; background: var(--color-warning-light); color: var(--color-warning); border-radius: 9999px; font-size: 11px; font-weight: 600; }
.master-actions { display: flex; flex-direction: column; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; transition: var(--transition-fast); white-space: nowrap; }
.action-btn.view { background: var(--color-accent-light); color: var(--color-info); }
.action-btn.edit { background: var(--color-primary-light); color: var(--color-primary-dark); }
.action-btn.edit:hover { background: var(--color-primary); color: white; }
.action-btn.delete { background: var(--color-danger-light); color: var(--color-danger); }
.action-btn.delete:hover:not(:disabled) { background: var(--color-danger); color: white; }
.action-btn.disabled, .action-btn:disabled { opacity: 0.4; pointer-events: none; }
.empty-state { grid-column: 1 / -1; text-align: center; padding: 64px 24px; }
.empty-icon { font-size: 3rem; margin-bottom: var(--space-4); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-box { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
</style>

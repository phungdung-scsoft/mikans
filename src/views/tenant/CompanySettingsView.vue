<template>
  <div class="company-settings animate-fade-in">
    <div class="card" style="max-width: 720px">
      <div class="card-header">
        <h3 class="font-semibold">🏢 会社情報設定</h3>
        <button class="btn btn-primary" @click="save" :disabled="saved">
          {{ saved ? '✓ 保存済み' : '保存する' }}
        </button>
      </div>
      <div class="card-body">
        <form class="flex flex-col gap-5">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">会社名 *</label>
              <input v-model="form.name" class="form-input" placeholder="株式会社EXAMPLE" />
            </div>
            <div class="form-group">
              <label class="form-label">代表者名</label>
              <input v-model="form.representative" class="form-input" placeholder="代表取締役 氏名" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">郵便番号</label>
              <input v-model="form.postalCode" class="form-input" placeholder="100-0001" />
            </div>
            <div class="form-group">
              <label class="form-label">電話番号</label>
              <input v-model="form.phone" class="form-input" placeholder="03-1234-5678" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">住所1</label>
            <input v-model="form.address1" class="form-input" placeholder="東京都千代田区..." />
          </div>
          <div class="form-group">
            <label class="form-label">住所2</label>
            <input v-model="form.address2" class="form-input" placeholder="ビル名・フロア等" />
          </div>
          <div class="form-group">
            <label class="form-label">メールアドレス</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="info@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label">メモ</label>
            <textarea v-model="form.note" class="form-input" rows="3"></textarea>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useTenantStore } from '@/stores/tenant'

const tenant = useTenantStore()
const form = reactive({ ...tenant.company })
const saved = ref(false)

function save() {
  tenant.updateCompany(form)
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<style scoped>
.company-settings {}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn { padding: 8px 16px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primary:disabled { background: var(--color-success); }
</style>

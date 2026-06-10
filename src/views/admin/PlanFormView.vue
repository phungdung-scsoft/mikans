<template>
  <div class="plan-form animate-fade-in">
    <div class="form-header">
      <router-link to="/admin/plans" class="back-link">← プラン一覧</router-link>
      <h2 class="text-xl font-semibold mt-2">{{ isEdit ? 'プラン編集' : 'プラン登録' }}</h2>
    </div>

    <div class="card" style="max-width:640px">
      <div class="card-body">
        <form @submit.prevent="save" class="flex flex-col gap-5">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">プランコード <span class="req">※自動生成</span></label>
              <input :value="isEdit ? plan.code : '自動生成'" class="form-input" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">プラン名 <span class="req">*</span></label>
              <input v-model="form.name" class="form-input" placeholder="例: ビジネスプラン" />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">最大ユーザー数 <span class="req">*</span></label>
              <input v-model.number="form.maxUsers" type="number" min="1" class="form-input" placeholder="10" />
              <span v-if="errors.maxUsers" class="form-error">{{ errors.maxUsers }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">最大見積数 <span class="req">*</span></label>
              <input v-model.number="form.maxQuotations" type="number" min="1" class="form-input" placeholder="6000" />
              <span v-if="errors.maxQuotations" class="form-error">{{ errors.maxQuotations }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">利用可能サービス</label>
            <div class="services-grid">
              <label v-for="svc in admin.ALL_SERVICES" :key="svc.code" class="service-label">
                <input type="checkbox" :value="svc.code" v-model="form.services" class="mr-2" />
                <span class="text-sm">{{ svc.name }}</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">メモ</label>
            <textarea v-model="form.note" class="form-input" rows="3" placeholder="備考（任意）"></textarea>
          </div>

          <div class="form-footer">
            <router-link to="/admin/plans" class="btn btn-ghost">キャンセル</router-link>
            <button type="submit" class="btn btn-primary">{{ isEdit ? '更新する' : '登録する' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const isEdit = computed(() => !!route.params.id)
const plan = computed(() => isEdit.value ? admin.getPlan(route.params.id) : null)

const form = reactive({ name: '', maxUsers: 10, maxQuotations: 6000, note: '', services: [] })
const errors = reactive({ name: '', maxUsers: '', maxQuotations: '' })

onMounted(() => {
  if (plan.value) Object.assign(form, { 
    name: plan.value.name, 
    maxUsers: plan.value.maxUsers, 
    maxQuotations: plan.value.maxQuotations, 
    note: plan.value.note || '',
    services: plan.value.services ? [...plan.value.services] : []
  })
})

function validate() {
  let ok = true
  errors.name = form.name ? '' : 'プラン名を入力してください'
  errors.maxUsers = form.maxUsers > 0 ? '' : '1以上の値を入力してください'
  errors.maxQuotations = form.maxQuotations > 0 ? '' : '1以上の値を入力してください'
  if (errors.name || errors.maxUsers || errors.maxQuotations) ok = false
  return ok
}

function save() {
  if (!validate()) return
  if (isEdit.value) admin.updatePlan(route.params.id, form)
  else admin.createPlan(form)
  router.push('/admin/plans')
}
</script>

<style scoped>
.plan-form { display: flex; flex-direction: column; gap: var(--space-5); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-gray-700); }
.req { font-size: var(--text-xs); color: var(--color-gray-400); font-weight: normal; margin-left: 4px; }
.form-input {
  padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md);
  font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit;
}
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-input:disabled { background: var(--color-gray-50); color: var(--color-gray-400); cursor: not-allowed; }
.form-error { font-size: var(--text-xs); color: var(--color-danger); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-gray-100); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--font-medium); cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
.btn-ghost:hover { background: var(--color-gray-200); }
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; padding: 12px; border: 1px solid var(--color-gray-200); border-radius: 6px; }
.service-label { display: flex; align-items: center; cursor: pointer; }
.mr-2 { margin-right: 8px; }
</style>

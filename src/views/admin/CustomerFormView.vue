<template>
  <div class="customer-form animate-fade-in">
    <router-link to="/admin/customers" class="back-link">← 顧客一覧</router-link>
    <h2 class="text-xl font-semibold mt-2 mb-6">{{ isEdit ? '顧客編集' : '顧客登録' }}</h2>
    <div class="card" style="max-width:720px">
      <div class="card-body">
        <form @submit.prevent="save" class="flex flex-col gap-5">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">顧客コード <span class="req">※自動生成</span></label>
              <input :value="isEdit ? customer?.code : '自動生成'" class="form-input" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">プラン <span class="req">*</span></label>
              <select v-model="form.planId" class="form-input">
                <option value="">選択してください</option>
                <option v-for="p in admin.plans" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <span v-if="errors.planId" class="form-error">{{ errors.planId }}</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">顧客名 <span class="req">*</span></label>
              <input v-model="form.name" class="form-input" placeholder="株式会社○○" />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">顧客区分</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" v-model="form.type" value="corporate" /> 法人</label>
                <label class="radio-item"><input type="radio" v-model="form.type" value="individual" /> 個人</label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">担当者名</label>
              <input v-model="form.contactName" class="form-input" placeholder="田中 太郎" />
            </div>
            <div class="form-group">
              <label class="form-label">電話番号</label>
              <input v-model="form.phone" class="form-input" placeholder="03-1234-5678" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">メールアドレス</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="info@example.com" />
          </div>
          <div class="form-group">
            <label class="form-label">メモ</label>
            <textarea v-model="form.note" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-footer">
            <router-link to="/admin/customers" class="btn btn-ghost">キャンセル</router-link>
            <button type="submit" class="btn btn-primary">{{ isEdit ? '更新する' : '登録する' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const isEdit = computed(() => !!route.params.id)
const customer = computed(() => isEdit.value ? admin.getCustomer(route.params.id) : null)

const form = reactive({ name: '', planId: '', contactName: '', phone: '', email: '', note: '', type: 'corporate' })
const errors = reactive({ name: '', planId: '' })

onMounted(() => { if (customer.value) Object.assign(form, { name: customer.value.name, planId: customer.value.planId, contactName: customer.value.contactName || '', phone: customer.value.phone || '', email: customer.value.email || '', note: customer.value.note || '', type: customer.value.type || 'corporate' }) })

function save() {
  errors.name = form.name ? '' : '顧客名を入力してください'
  errors.planId = form.planId ? '' : 'プランを選択してください'
  if (errors.name || errors.planId) return
  if (isEdit.value) admin.updateCustomer(route.params.id, form)
  else admin.createCustomer(form)
  router.push('/admin/customers')
}
</script>

<style scoped>
.customer-form { display: flex; flex-direction: column; gap: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-gray-700); }
.req { font-size: var(--text-xs); color: var(--color-gray-400); font-weight: normal; margin-left: 4px; }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-input:disabled { background: var(--color-gray-50); color: var(--color-gray-400); }
.form-error { font-size: var(--text-xs); color: var(--color-danger); }
.radio-group { display: flex; gap: var(--space-4); padding: 9px 0; }
.radio-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); cursor: pointer; }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-gray-100); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--font-medium); cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
</style>

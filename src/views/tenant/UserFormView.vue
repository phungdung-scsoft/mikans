<template>
  <div class="user-form animate-fade-in">
    <router-link to="/tenant/users" class="back-link">← ユーザー一覧</router-link>
    <h2 class="text-xl font-semibold mt-2 mb-6">{{ isEdit ? 'ユーザー編集' : 'ユーザー登録' }}</h2>
    <div class="card" style="max-width:640px">
      <div class="card-body">
        <form @submit.prevent="save" class="flex flex-col gap-5">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">姓 *</label>
              <input v-model="form.firstName" class="form-input" placeholder="田中" />
            </div>
            <div class="form-group">
              <label class="form-label">名 *</label>
              <input v-model="form.lastName" class="form-input" placeholder="太郎" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">メールアドレス *</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="user@example.com" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">部門</label>
              <select v-model="form.departmentId" class="form-input">
                <option value="">選択なし</option>
                <option v-for="d in tenant.departments" :key="d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">権限</label>
              <div class="radio-group">
                <label class="radio-item"><input type="radio" v-model="form.role" value="admin" /> Admin</label>
                <label class="radio-item"><input type="radio" v-model="form.role" value="member" /> Member</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">電話番号</label>
            <input v-model="form.phone" class="form-input" placeholder="090-0000-0000" />
          </div>
          <div class="form-group">
            <label class="form-label">メモ</label>
            <textarea v-model="form.note" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-footer">
            <router-link to="/tenant/users" class="btn btn-ghost">キャンセル</router-link>
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
import { useTenantStore } from '@/stores/tenant'

const route = useRoute()
const router = useRouter()
const tenant = useTenantStore()
const isEdit = computed(() => !!route.params.id)
const user = computed(() => isEdit.value ? tenant.getUser(route.params.id) : null)

const form = reactive({ firstName: '', lastName: '', email: '', departmentId: '', role: 'member', phone: '', note: '' })

onMounted(() => { if (user.value) Object.assign(form, user.value) })

function save() {
  if (!form.firstName || !form.email) return
  if (isEdit.value) tenant.updateUser(route.params.id, form)
  else tenant.createUser(form)
  router.push('/tenant/users')
}
</script>

<style scoped>
.user-form { display: flex; flex-direction: column; gap: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.radio-group { display: flex; gap: var(--space-4); padding: 9px 0; }
.radio-item { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); cursor: pointer; }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-gray-100); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
</style>

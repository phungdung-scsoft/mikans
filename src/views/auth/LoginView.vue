<template>
  <div class="login-view">
    <div class="login-header">
      <h2>おかえりなさい</h2>
      <p class="text-muted text-sm">アカウントにログインしてください</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group" :class="{ error: errors.email }">
        <label class="form-label">メールアドレス</label>
        <input
          id="login-email"
          v-model="form.email"
          type="email"
          class="form-input"
          placeholder="admin@mikans.io"
          autocomplete="email"
        />
        <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
      </div>

      <div class="form-group" :class="{ error: errors.password }">
        <label class="form-label">パスワード</label>
        <div class="input-with-icon">
          <input
            id="login-password"
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            class="form-input"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <button type="button" class="eye-btn" @click="showPass = !showPass">
            {{ showPass ? '🙈' : '👁️' }}
          </button>
        </div>
        <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
      </div>

      <div class="form-row-between">
        <span></span>
        <router-link to="/forgot-password" class="forgot-link">パスワードをお忘れですか？</router-link>
      </div>

      <div v-if="globalError" class="alert-error animate-fade-in">
        <span>⚠️</span> {{ globalError }}
      </div>

      <button type="submit" class="btn-submit" :disabled="loading" id="login-submit">
        <span v-if="loading" class="animate-spin">⟳</span>
        <span v-else>ログイン</span>
      </button>
    </form>

    <div class="login-demo">
      <p class="text-xs text-muted">デモアカウント:</p>
      <div class="demo-accounts">
        <button class="demo-btn" @click="fillDemo('super_admin')">Super Admin</button>
        <button class="demo-btn" @click="fillDemo('tenant')">テナント管理者</button>
        <button class="demo-btn" @click="fillDemo('member')">メンバー</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const globalError = ref('')
const loading = ref(false)
const showPass = ref(false)

const DEMO = {
  super_admin: { email: 'admin@mikans.io', password: 'admin123' },
  tenant: { email: 'tenant@example.com', password: 'tenant123' },
  member: { email: 'member@example.com', password: 'member123' }
}

function fillDemo(type) {
  Object.assign(form, DEMO[type])
  globalError.value = ''
}

function validate() {
  let ok = true
  errors.email = ''
  errors.password = ''
  if (!form.email) { errors.email = 'メールアドレスを入力してください'; ok = false }
  if (!form.password) { errors.password = 'パスワードを入力してください'; ok = false }
  return ok
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  globalError.value = ''
  try {
    await new Promise(r => setTimeout(r, 600)) // Simulate API delay
    const user = auth.login(form.email, form.password)
    if (user.role === 'super_admin') router.push('/admin/dashboard')
    else router.push('/tenant/company')
  } catch (e) {
    globalError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view { }
.login-header { margin-bottom: var(--space-8); }
.login-header h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.login-form { display: flex; flex-direction: column; gap: var(--space-5); }

.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
}
.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-gray-800);
  transition: var(--transition-fast);
  background: var(--color-gray-50);
}
.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: #fff;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}
.form-group.error .form-input {
  border-color: var(--color-danger);
}
.form-group.error .form-input:focus {
  box-shadow: 0 0 0 3px var(--color-danger-light);
}
.form-error { font-size: var(--text-xs); color: var(--color-danger); }

.input-with-icon { position: relative; }
.input-with-icon .form-input { padding-right: 44px; }
.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
  transition: var(--transition-fast);
}
.eye-btn:hover { opacity: 1; }

.form-row-between { display: flex; justify-content: space-between; align-items: center; }
.forgot-link { font-size: var(--text-xs); color: var(--color-primary); }
.forgot-link:hover { text-decoration: underline; }

.alert-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: 0 2px 8px rgba(37,99,235,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(37,99,235,0.4);
}
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.login-demo {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-100);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.demo-accounts { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.demo-btn {
  padding: 4px 12px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  background: white;
  color: var(--color-gray-600);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: var(--transition-fast);
}
.demo-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>

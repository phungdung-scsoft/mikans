<template>
  <div class="forgot-view animate-fade-in">
    <div class="mb-6">
      <router-link to="/login" class="back-link">← ログインに戻る</router-link>
    </div>
    <h2 class="text-2xl font-bold mb-1">パスワードをリセット</h2>
    <p class="text-muted text-sm mb-8">登録メールアドレスを入力してください。リセット手順をお送りします。</p>

    <div v-if="step === 1">
      <form @submit.prevent="sendEmail" class="flex flex-col gap-5">
        <div class="form-group">
          <label class="form-label">メールアドレス</label>
          <input v-model="email" type="email" class="form-input" placeholder="your@email.com" />
          <span v-if="emailError" class="form-error">{{ emailError }}</span>
        </div>
        <div v-if="globalError" class="alert-error">⚠️ {{ globalError }}</div>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '送信中...' : '送信' }}
        </button>
      </form>
    </div>

    <div v-else-if="step === 2" class="animate-fade-in">
      <div class="success-box">
        <div class="success-icon">✅</div>
        <h3 class="font-semibold mb-1">メールを送信しました</h3>
        <p class="text-sm text-muted">{{ email }} にリセット手順を送信しました。</p>
      </div>
      <form @submit.prevent="resetPass" class="flex flex-col gap-5 mt-6">
        <div class="form-group">
          <label class="form-label">確認コード (デモ: 123456)</label>
          <input v-model="code" type="text" class="form-input" placeholder="123456" />
        </div>
        <div class="form-group">
          <label class="form-label">新しいパスワード</label>
          <input v-model="newPass" type="password" class="form-input" placeholder="••••••••" />
        </div>
        <div class="form-group">
          <label class="form-label">新しいパスワード (確認)</label>
          <input v-model="confirmPass" type="password" class="form-input" placeholder="••••••••" />
          <span v-if="passError" class="form-error">{{ passError }}</span>
        </div>
        <button type="submit" class="btn-submit" :disabled="loading">変更する</button>
      </form>
    </div>

    <div v-else class="animate-fade-in text-center">
      <div class="success-box">
        <div class="success-icon">🎉</div>
        <h3 class="font-semibold mb-2">パスワードを変更しました</h3>
        <router-link to="/login" class="btn-submit" style="text-decoration:none;display:block;text-align:center">
          ログインへ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const step = ref(1)
const email = ref('')
const code = ref('')
const newPass = ref('')
const confirmPass = ref('')
const emailError = ref('')
const passError = ref('')
const globalError = ref('')
const loading = ref(false)

async function sendEmail() {
  emailError.value = ''
  globalError.value = ''
  if (!email.value) { emailError.value = 'メールアドレスを入力してください'; return }
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 600))
    auth.sendResetEmail(email.value)
    step.value = 2
  } catch (e) { globalError.value = e.message }
  finally { loading.value = false }
}

async function resetPass() {
  passError.value = ''
  if (newPass.value !== confirmPass.value) { passError.value = 'パスワードが一致しません'; return }
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  auth.resetPassword(code.value, newPass.value)
  loading.value = false
  step.value = 3
}
</script>

<style scoped>
.forgot-view {}
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-gray-700); }
.form-input {
  width: 100%; padding: 10px 14px; border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast);
}
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-error { font-size: var(--text-xs); color: var(--color-danger); }
.alert-error {
  display: flex; gap: var(--space-2); background: var(--color-danger-light); color: var(--color-danger);
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--text-sm);
}
.btn-submit {
  width: 100%; padding: 12px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-sm);
  font-weight: var(--font-semibold); cursor: pointer; transition: var(--transition-fast);
}
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }
.success-box {
  background: var(--color-gray-50); border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg); padding: var(--space-6); text-align: center;
}
.success-icon { font-size: 2.5rem; margin-bottom: var(--space-3); }
</style>

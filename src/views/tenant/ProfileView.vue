<template>
  <div class="tenant-profile animate-fade-in max-w-2xl mx-auto mt-8">
    <div class="card">
      <div class="card-header">
        <h2 class="font-bold text-lg">プロフィール設定</h2>
      </div>
      <div class="card-body">
        <div class="flex items-center gap-6 mb-8">
          <div class="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {{ auth.user?.name ? auth.user.name[0] : 'U' }}
          </div>
          <div>
            <h3 class="text-xl font-bold">{{ auth.user?.name }}</h3>
            <p class="text-gray-500">{{ auth.user?.email }}</p>
            <span class="inline-block mt-2 px-2 py-1 bg-primary-light text-primary text-xs rounded-full font-medium">
              {{ auth.user?.role === 'tenant_admin' ? '管理者' : 'メンバー' }}
            </span>
          </div>
        </div>

        <hr class="border-gray-100 mb-6" />

        <div class="space-y-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">氏名</label>
            <input type="text" class="w-full p-2 border border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" :value="auth.user?.name" />
          </div>
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input type="email" class="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 outline-none" disabled :value="auth.user?.email" />
            <p class="text-xs text-gray-400 mt-1">メールアドレスの変更は管理者にお問い合わせください。</p>
          </div>
          <div class="form-group pt-4">
            <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors font-medium text-sm">
              更新する
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-6">
      <div class="card-header">
        <h3 class="font-bold">パスワード変更</h3>
      </div>
      <div class="card-body space-y-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
          <input type="password" class="w-full p-2 border border-gray-200 rounded-md focus:border-primary outline-none" />
        </div>
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
          <input type="password" class="w-full p-2 border border-gray-200 rounded-md focus:border-primary outline-none" />
        </div>
        <div class="form-group pt-2">
          <button class="px-4 py-2 border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm">
            パスワードを変更
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

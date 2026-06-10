<template>
  <div class="auth-layout">
    <div class="auth-side">
      <div class="auth-brand">
        <div class="brand-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#2563eb"/>
            <path d="M10 28V12l10 8 10-8v16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="brand-name">MIKANS</h1>
        <p class="brand-sub">見積管理システム</p>
      </div>

      <div class="auth-features">
        <div class="feature-item" v-for="f in features" :key="f.icon">
          <div class="feature-icon">{{ f.icon }}</div>
          <div>
            <div class="feature-title">{{ f.title }}</div>
            <div class="feature-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>

      <div class="auth-footer">
        &copy; 2024 MIKANS. All rights reserved.
      </div>
    </div>

    <div class="auth-main">
      <div class="auth-card animate-fade-in">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: '📋', title: 'スマートな見積作成', desc: 'テンプレートとAIで素早く見積を作成' },
  { icon: '🔧', title: '動的マスタ管理', desc: 'Kintone風の柔軟なデータ管理基盤' },
  { icon: '📊', title: 'リアルタイム計算', desc: '売上・原価・粗利率を自動計算' },
  { icon: '📄', title: 'PDF出力', desc: 'プロ品質の見積書をワンクリック出力' },
]
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

/* ── Left side panel ── */
.auth-side {
  width: 440px;
  flex-shrink: 0;
  background: linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%);
  display: flex;
  flex-direction: column;
  padding: var(--space-12) var(--space-10);
  position: relative;
  overflow: hidden;
}
.auth-side::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(37,99,235,0.15);
  pointer-events: none;
}
.auth-side::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(99,102,241,0.12);
  pointer-events: none;
}

.auth-brand { margin-bottom: var(--space-12); }
.brand-logo { margin-bottom: var(--space-4); }
.brand-name {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: #fff;
  letter-spacing: 1px;
  margin-bottom: var(--space-1);
}
.brand-sub {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.5px;
}

.auth-features { flex: 1; display: flex; flex-direction: column; gap: var(--space-6); }
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  animation: fadeIn 0.5s ease both;
}
.feature-item:nth-child(2) { animation-delay: 0.1s; }
.feature-item:nth-child(3) { animation-delay: 0.2s; }
.feature-item:nth-child(4) { animation-delay: 0.3s; }

.feature-icon {
  font-size: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.feature-title {
  font-weight: var(--font-semibold);
  color: #fff;
  font-size: var(--text-sm);
  margin-bottom: 2px;
}
.feature-desc {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
}

.auth-footer {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.3);
  margin-top: var(--space-8);
}

/* ── Right main area ── */
.auth-main {
  flex: 1;
  background: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
  padding: var(--space-10);
}

@media (max-width: 768px) {
  .auth-side { display: none; }
  .auth-main { padding: var(--space-4); }
}
</style>

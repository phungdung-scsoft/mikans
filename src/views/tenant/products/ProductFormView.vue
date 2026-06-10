<template>
  <div class="product-form animate-fade-in">
    <router-link to="/tenant/products" class="back-link">← 商品一覧</router-link>
    <h2 class="text-xl font-semibold mt-2 mb-6">{{ isEdit ? '商品編集' : '商品登録' }}</h2>
    <div class="card" style="max-width:720px">
      <div class="card-body">
        <form @submit.prevent="save" class="flex flex-col gap-5">
          <h4 class="section-title">基本項目</h4>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">商品コード ※自動生成</label>
              <input :value="product?.code || '自動生成'" class="form-input" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">商品名 *</label>
              <input v-model="form.name" class="form-input" placeholder="例: 地渡り足場" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">概要</label>
            <textarea v-model="form.summary" class="form-input" rows="2" placeholder="商品の概要説明"></textarea>
          </div>
          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">大分類</label>
              <input v-model="form.categoryLarge" class="form-input" placeholder="例: C001" />
            </div>
            <div class="form-group">
              <label class="form-label">中分類</label>
              <input v-model="form.categoryMid" class="form-input" placeholder="例: M001" />
            </div>
            <div class="form-group">
              <label class="form-label">単位 *</label>
              <select v-model="form.unit" class="form-input">
                <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>
          </div>

          <h4 class="section-title">価格</h4>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">売単価 (税抜) *</label>
              <div class="price-input">
                <span>¥</span>
                <input v-model.number="form.sellingPrice" type="number" min="0" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">仕入単価 (税抜) *</label>
              <div class="price-input">
                <span>¥</span>
                <input v-model.number="form.costPrice" type="number" min="0" class="form-input" />
              </div>
            </div>
          </div>
          <div v-if="form.sellingPrice > 0" class="margin-info">
            <span>粗利率:</span>
            <span class="font-semibold" :class="margin > 30 ? 'text-success' : margin > 10 ? 'text-warning' : 'text-danger'">
              {{ margin.toFixed(1) }}%
            </span>
            <span class="text-muted ml-4">粗利益: ¥{{ (form.sellingPrice - form.costPrice).toLocaleString() }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">メモ</label>
            <textarea v-model="form.note" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-footer">
            <router-link to="/tenant/products" class="btn btn-ghost">キャンセル</router-link>
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
import { useProductsStore } from '@/stores/products'

const route = useRoute()
const router = useRouter()
const prods = useProductsStore()
const isEdit = computed(() => !!route.params.id)
const product = computed(() => isEdit.value ? prods.getProduct(route.params.id) : null)

const units = ['式', 'm', 'm2', 'm3', '本', '個', '台', '枚', '冊', '人工', '日']
const form = reactive({ name: '', summary: '', categoryLarge: '', categoryMid: '', unit: '式', sellingPrice: 0, costPrice: 0, note: '' })

const margin = computed(() => {
  if (!form.sellingPrice) return 0
  return ((form.sellingPrice - form.costPrice) / form.sellingPrice) * 100
})

onMounted(() => { if (product.value) Object.assign(form, product.value) })

function save() {
  if (!form.name) return
  if (isEdit.value) prods.updateProduct(route.params.id, form)
  else prods.createProduct(form)
  router.push('/tenant/products')
}
</script>

<style scoped>
.product-form { display: flex; flex-direction: column; gap: var(--space-2); }
.back-link { font-size: var(--text-sm); color: var(--color-primary); }
.section-title { font-size: var(--text-sm); font-weight: 600; color: var(--color-gray-500); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-gray-100); padding-bottom: var(--space-2); margin-top: var(--space-2); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-1); }
.form-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-gray-700); }
.form-input { padding: 9px 12px; border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--text-sm); transition: var(--transition-fast); font-family: inherit; }
.form-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.form-input:disabled { background: var(--color-gray-50); color: var(--color-gray-400); }
.price-input { position: relative; display: flex; align-items: center; }
.price-input > span { position: absolute; left: 12px; color: var(--color-gray-400); font-weight: 500; z-index: 1; }
.price-input > .form-input { padding-left: 26px; }
.margin-info { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-md); font-size: var(--text-sm); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--color-gray-100); }
.btn { padding: 9px 18px; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 500; cursor: pointer; border: none; transition: var(--transition-fast); text-decoration: none; }
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-ghost { background: var(--color-gray-100); color: var(--color-gray-700); }
</style>

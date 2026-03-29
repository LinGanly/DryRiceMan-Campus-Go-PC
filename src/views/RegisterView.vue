<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Phone, User } from '@element-plus/icons-vue'
import { checkMerchantNameAvailable, registerMerchant } from '@/api/auth'

interface RegisterForm {
  merchant_name: string
  username: string
  phone: string
  password: string
  confirmPassword: string
}

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const checkingName = ref(false)
const merchantNameAvailable = ref<boolean | null>(null)
const merchantNameTip = ref('')

const registerForm = reactive<RegisterForm>({
  merchant_name: '',
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const usernamePattern = /^[A-Za-z0-9_]+$/
const phonePattern = /^1\d{10}$/

const resetMerchantNameCheck = () => {
  merchantNameAvailable.value = null
  merchantNameTip.value = ''
}

const checkMerchantName = async () => {
  const name = registerForm.merchant_name.trim()

  if (!name) {
    resetMerchantNameCheck()
    return
  }

  checkingName.value = true

  try {
    const available = await checkMerchantNameAvailable(name)
    merchantNameAvailable.value = available
    merchantNameTip.value = available ? '该商家名称可创建' : '商家名称已存在，请更换'
  } catch {
    merchantNameAvailable.value = null
    merchantNameTip.value = '商家名称校验失败，请稍后重试'
  } finally {
    checkingName.value = false
  }
}

const validateMerchantName = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value?.trim()) {
    callback(new Error('请输入商家名称'))
    return
  }

  if (merchantNameAvailable.value === false) {
    callback(new Error('商家名称已存在'))
    return
  }

  callback()
}

const validateUsername = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入登录账号'))
    return
  }

  if (!usernamePattern.test(value)) {
    callback(new Error('登录账号仅支持字母、数字、下划线'))
    return
  }

  callback()
}

const validatePhone = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value?.trim()) {
    callback(new Error('请输入联系电话'))
    return
  }

  if (!phonePattern.test(value)) {
    callback(new Error('请输入正确的 11 位手机号'))
    return
  }

  callback()
}

const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
    return
  }

  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }

  callback()
}

const rules = reactive<FormRules<RegisterForm>>({
  merchant_name: [
    { required: true, message: '请输入商家名称', trigger: 'blur' },
    { validator: validateMerchantName, trigger: 'blur' },
  ],
  username: [{ validator: validateUsername, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

const handleRegister = async () => {
  if (!registerFormRef.value) {
    return
  }

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true

    try {
      const available = await checkMerchantNameAvailable(registerForm.merchant_name.trim())

      if (!available) {
        merchantNameAvailable.value = false
        merchantNameTip.value = '商家名称已存在，请更换'
        await registerFormRef.value?.validateField('merchant_name')
        loading.value = false
        return
      }

      await registerMerchant({
        merchant_name: registerForm.merchant_name.trim(),
        username: registerForm.username.trim(),
        password: registerForm.password,
        phone: registerForm.phone.trim(),
      })

      ElMessage.success('注册成功，请登录商家后台')
      await router.push('/login')
    } catch {
      ElMessage.error('注册失败，请检查信息后重试')
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <div class="brand">
        <div class="brand-icon" />
        <span class="brand-text">干饭人校园 Go・商家管理后台</span>
      </div>
    </header>

    <main class="auth-main">
      <el-card class="auth-card">
        <template #header>
          <h1 class="auth-title">商家注册</h1>
          <p class="auth-subtitle">提交店铺信息，审核通过后即可登录管理后台</p>
        </template>

        <el-form ref="registerFormRef" :model="registerForm" :rules="rules" label-position="top">
          <el-form-item label="商家名称" prop="merchant_name">
            <el-input
              v-model="registerForm.merchant_name"
              placeholder="请输入商家名称"
              clearable
              @input="resetMerchantNameCheck"
              @blur="checkMerchantName"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
            <div
              v-if="merchantNameTip"
              class="merchant-name-tip"
              :class="merchantNameAvailable === true ? 'success' : 'error'"
            >
              {{ checkingName ? '正在校验商家名称...' : merchantNameTip }}
            </div>
          </el-form-item>

          <el-form-item label="登录账号" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入登录账号（字母/数字/下划线）" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入联系电话" clearable>
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              show-password
              placeholder="请设置登录密码"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入密码"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="primary-btn" type="primary" :loading="loading" @click="handleRegister">
              提交注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-links">
          <router-link to="/login">返回登录</router-link>
          <router-link to="/recover">找回账号</router-link>
        </div>
      </el-card>
    </main>

    <footer class="auth-footer">
      <div>干饭人校园 Go © 2026 校园外卖平台</div>
      <div>技术支持：SpringBoot + Vue3</div>
    </footer>
  </div>
</template>

<style scoped>
.merchant-name-tip {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.2;
}

.merchant-name-tip.success {
  color: #2d9d4d;
}

.merchant-name-tip.error {
  color: #f56c6c;
}
</style>

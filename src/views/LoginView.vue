<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { login } from '@/api/auth'
import {
  getRememberedUsername,
  removeRememberedUsername,
  setRememberedUsername,
} from '@/utils/auth'

interface LoginForm {
  username: string
  password: string
  captcha: string
  rememberMe: boolean
}

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaCode = ref('')
const rememberedUsername = getRememberedUsername() ?? ''

const loginForm = reactive<LoginForm>({
  username: rememberedUsername,
  password: '',
  captcha: '',
  rememberMe: Boolean(rememberedUsername),
})

const generateCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  captchaCode.value = Array.from({ length: 4 }, () => {
    const index = Math.floor(Math.random() * chars.length)
    return chars[index]
  }).join('')
}

const validateCaptcha = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value?.trim()) {
    callback(new Error('请输入验证码'))
    return
  }

  if (value.trim().toUpperCase() !== captchaCode.value) {
    callback(new Error('验证码不正确'))
    return
  }

  callback()
}

const rules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, message: '请输入商家账号或手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { validator: validateCaptcha, trigger: 'blur' },
  ],
})

generateCaptcha()

const handleLogin = async () => {
  if (!loginFormRef.value) {
    return
  }

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true

    try {
      await login({
        username: loginForm.username,
        password: loginForm.password,
      })

      if (loginForm.rememberMe) {
        setRememberedUsername(loginForm.username)
      } else {
        removeRememberedUsername()
      }

      ElMessage.success('登录成功，欢迎回来')
      await router.push('/dashboard')
    } catch {
      ElMessage.error('账号或密码错误，请重试')
      loginForm.captcha = ''
      generateCaptcha()
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
          <h1 class="auth-title">商家登录</h1>
          <p class="auth-subtitle">商家账号登录后可进行店铺管理与订单处理</p>
        </template>

        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入商家账号 / 手机号"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入右侧验证码"
              clearable
              @keyup.enter="handleLogin"
            >
              <template #append>
                <button type="button" class="captcha-box" @click="generateCaptcha">
                  {{ captchaCode }}
                </button>
              </template>
            </el-input>
          </el-form-item>

          <div class="auth-actions">
            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
            <router-link to="/recover">忘记密码？</router-link>
          </div>

          <el-form-item style="margin-top: 16px">
            <el-button class="primary-btn" type="primary" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-links">
          <span>没有商家账号？</span>
          <router-link to="/register">注册商家账号</router-link>
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
.captcha-box {
  border: 0;
  background: transparent;
  color: #ff7a00;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  padding: 0 2px;
}
</style>

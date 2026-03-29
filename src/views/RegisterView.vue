<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Phone, User } from '@element-plus/icons-vue'

interface RegisterForm {
  shopName: string
  username: string
  phone: string
  password: string
  confirmPassword: string
}

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive<RegisterForm>({
  shopName: '',
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const rules = reactive<FormRules<RegisterForm>>({
  shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
          return
        }

        callback()
      },
      trigger: 'blur',
    },
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
      await new Promise((resolve) => setTimeout(resolve, 700))
      ElMessage.success('注册申请已提交，待平台审核')
      await router.push('/login')
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
          <el-form-item label="店铺名称" prop="shopName">
            <el-input v-model="registerForm.shopName" placeholder="请输入店铺名称" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="登录账号" prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入商家账号" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入手机号" clearable>
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

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Phone, User } from '@element-plus/icons-vue'

interface RecoverForm {
  username: string
  phone: string
}

const recoverFormRef = ref<FormInstance>()
const loading = ref(false)

const recoverForm = reactive<RecoverForm>({
  username: '',
  phone: '',
})

const rules = reactive<FormRules<RecoverForm>>({
  username: [{ required: true, message: '请输入商家账号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入绑定手机号', trigger: 'blur' }],
})

const handleRecover = async () => {
  if (!recoverFormRef.value) {
    return
  }

  await recoverFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }

    loading.value = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      ElMessage.success('找回申请已提交，请等待平台联系处理')
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
          <h1 class="auth-title">找回账号</h1>
          <p class="auth-subtitle">通过商家账号与手机号核验，提交人工找回申请</p>
        </template>

        <el-form ref="recoverFormRef" :model="recoverForm" :rules="rules" label-position="top">
          <el-form-item label="商家账号" prop="username">
            <el-input v-model="recoverForm.username" placeholder="请输入商家账号" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="绑定手机号" prop="phone">
            <el-input v-model="recoverForm.phone" placeholder="请输入绑定手机号" clearable>
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="primary-btn" type="primary" :loading="loading" @click="handleRecover">
              提交找回申请
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-links">
          <router-link to="/login">返回登录</router-link>
          <router-link to="/register">注册商家</router-link>
        </div>
      </el-card>
    </main>

    <footer class="auth-footer">
      <div>干饭人校园 Go © 2026 校园外卖平台</div>
      <div>技术支持：SpringBoot + Vue3</div>
    </footer>
  </div>
</template>

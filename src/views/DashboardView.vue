<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { removeToken } from '@/utils/auth'

const router = useRouter()

const handleLogout = async () => {
  removeToken()
  ElMessage.success('已退出登录')
  await router.push('/login')
}
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <div class="brand">
        <div class="brand-icon" />
        <span class="brand-text">干饭人校园 Go・商家管理后台</span>
      </div>
      <el-button plain @click="handleLogout">退出登录</el-button>
    </header>

    <main class="dashboard-main">
      <el-card>
        <h2>后台概览</h2>
        <p>欢迎进入商家管理后台。后续可以在此扩展订单、商品、门店、营销等模块。</p>
        <el-row :gutter="16" style="margin-top: 16px">
          <el-col :xs="24" :sm="8">
            <el-card shadow="never">
              <div class="stat-title">今日订单</div>
              <div class="stat-value">128</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-card shadow="never">
              <div class="stat-title">待处理退款</div>
              <div class="stat-value">3</div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-card shadow="never">
              <div class="stat-title">营业中门店</div>
              <div class="stat-value">1</div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-header {
  height: 68px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #ececec;
}

.dashboard-main {
  max-width: 1100px;
  margin: 22px auto;
  padding: 0 16px;
}

.stat-title {
  color: #999;
  font-size: 13px;
}

.stat-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 700;
  color: #ff7a00;
}
</style>

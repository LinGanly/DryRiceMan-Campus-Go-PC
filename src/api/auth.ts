import http from '@/api/http'
import { setToken } from '@/utils/auth'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponseShape {
  token?: string
  data?: {
    token?: string
  }
}

export const login = async (payload: LoginPayload) => {
  const response = await http.post<LoginResponseShape>('/admin/employee/login', payload)
  const token = response.data.token ?? response.data.data?.token

  if (!token) {
    throw new Error('登录响应中未返回 token')
  }

  setToken(token)
  return token
}

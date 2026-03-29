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

interface ApiResponse<T = unknown> {
  code?: number
  msg?: string
  message?: string
  data?: T
}

interface MerchantNameCheckResult {
  exists?: boolean
  available?: boolean
}

interface MerchantRegisterPayload {
  merchant_name: string
  username: string
  password: string
  phone: string
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

export const checkMerchantNameAvailable = async (merchantName: string) => {
  const response = await http.get<ApiResponse<MerchantNameCheckResult> | MerchantNameCheckResult>(
    '/admin/merchant/check-name',
    {
      params: {
        merchant_name: merchantName,
      },
    },
  )

  const body = response.data
  const result = 'data' in (body as object) ? (body as ApiResponse<MerchantNameCheckResult>).data : body

  if (!result) {
    return true
  }

  if (typeof result.available === 'boolean') {
    return result.available
  }

  if (typeof result.exists === 'boolean') {
    return !result.exists
  }

  return true
}

export const registerMerchant = async (payload: MerchantRegisterPayload) => {
  await http.post<ApiResponse>('/admin/merchant/register', payload)
}

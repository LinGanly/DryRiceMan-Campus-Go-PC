export const AUTH_TOKEN_KEY = 'merchant_admin_token'
export const REMEMBERED_USER_KEY = 'merchant_admin_username'

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY)

export const setToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const getRememberedUsername = () => localStorage.getItem(REMEMBERED_USER_KEY)

export const setRememberedUsername = (username: string) => {
  localStorage.setItem(REMEMBERED_USER_KEY, username)
}

export const removeRememberedUsername = () => {
  localStorage.removeItem(REMEMBERED_USER_KEY)
}

export type CurrentUser = {
  id: string | number
  username?: string
  email?: string
  fullName?: string
  displayName?: string
  avatar?: string
  role?: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  fullName: string
  email: string
  password: string
}

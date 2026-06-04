export type CurrentUser = {
  id: string | number
  username?: string
  email?: string
  fullName?: string
  avatar?: string
  role?: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken?: string
}

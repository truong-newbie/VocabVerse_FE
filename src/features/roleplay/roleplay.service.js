import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const ROLEPLAY_BASE = '/roleplay/sessions'

/**
 * @typedef {import('@/types/roleplay').CreateRoleplaySessionRequest} CreateRoleplaySessionRequest
 * @typedef {import('@/types/roleplay').RoleplaySession} RoleplaySession
 * @typedef {import('@/types/roleplay').RoleplaySessionListResponse} RoleplaySessionListResponse
 * @typedef {import('@/types/roleplay').SendRoleplayMessageRequest} SendRoleplayMessageRequest
 * @typedef {import('@/types/roleplay').SendRoleplayMessageResponse} SendRoleplayMessageResponse
 * @typedef {import('@/types/roleplay').EndRoleplaySessionResponse} EndRoleplaySessionResponse
 * @typedef {import('@/types/roleplay').RoleplaySessionQueryParams} RoleplaySessionQueryParams
 */

export const roleplayService = {
  /** @param {CreateRoleplaySessionRequest} payload @returns {Promise<RoleplaySession>} */
  async createRoleplaySession(payload) {
    const response = await apiClient.post(ROLEPLAY_BASE, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<RoleplaySession>} */
  async getRoleplaySession(sessionId) {
    const response = await apiClient.get(`${ROLEPLAY_BASE}/${sessionId}`)
    return unwrapApiResponse(response)
  },

  /** @param {RoleplaySessionQueryParams} params @returns {Promise<RoleplaySessionListResponse>} */
  async getRoleplaySessions(params = {}) {
    const response = await apiClient.get(ROLEPLAY_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    })
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @param {SendRoleplayMessageRequest} payload @returns {Promise<SendRoleplayMessageResponse>} */
  async sendRoleplayMessage(sessionId, payload) {
    const response = await apiClient.post(`${ROLEPLAY_BASE}/${sessionId}/messages`, payload)
    return unwrapApiResponse(response)
  },

  /** @param {string | number} sessionId @returns {Promise<EndRoleplaySessionResponse>} */
  async endRoleplaySession(sessionId) {
    const response = await apiClient.post(`${ROLEPLAY_BASE}/${sessionId}/end`)
    return unwrapApiResponse(response)
  },
}

import { apiClient } from '@/services/apiClient'
import { unwrapApiResponse } from '@/services/apiError'

const DASHBOARD_BASE = '/dashboard'

/**
 * @typedef {import('@/types/dashboard').DashboardSummary} DashboardSummary
 * @typedef {import('@/types/dashboard').LearningStatusStats} LearningStatusStats
 * @typedef {import('@/types/dashboard').DashboardReviewDueResponse} DashboardReviewDueResponse
 * @typedef {import('@/types/dashboard').DashboardRecentActivityResponse} DashboardRecentActivityResponse
 */

export const dashboardService = {
  /** @returns {Promise<DashboardSummary>} */
  async getDashboardSummary() {
    const response = await apiClient.get(`${DASHBOARD_BASE}/summary`)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<LearningStatusStats>} */
  async getLearningStatusStats() {
    const response = await apiClient.get(`${DASHBOARD_BASE}/learning-status`)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<DashboardReviewDueResponse>} */
  async getReviewDue() {
    const response = await apiClient.get(`${DASHBOARD_BASE}/review-due`)
    return unwrapApiResponse(response)
  },

  /** @returns {Promise<DashboardRecentActivityResponse>} */
  async getRecentActivity() {
    const response = await apiClient.get(`${DASHBOARD_BASE}/recent-activity`)
    return unwrapApiResponse(response)
  },
}

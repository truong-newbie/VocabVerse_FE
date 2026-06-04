import { useQuery } from '@tanstack/react-query'
import { dashboardService } from './dashboard.service'

const dashboardStaleTime = 60 * 1000

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getDashboardSummary,
    staleTime: dashboardStaleTime,
  })
}

export function useLearningStatusStats() {
  return useQuery({
    queryKey: ['dashboard', 'learning-status'],
    queryFn: dashboardService.getLearningStatusStats,
    staleTime: dashboardStaleTime,
  })
}

export function useReviewDue() {
  return useQuery({
    queryKey: ['dashboard', 'review-due'],
    queryFn: dashboardService.getReviewDue,
    staleTime: dashboardStaleTime,
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: dashboardService.getRecentActivity,
    staleTime: dashboardStaleTime,
  })
}

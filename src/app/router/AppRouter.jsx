import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import AppLayout from '@/components/layout/AppLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import AdminRoute from '@/components/routes/AdminRoute'
import PublicRoute from '@/components/routes/PublicRoute'
import LoadingScreen from '@/components/common/LoadingScreen'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const CollectionsPage = lazy(() => import('@/pages/collections/CollectionsPage'))
const CollectionDetailPage = lazy(() => import('@/pages/collections/CollectionDetailPage'))
const VocabulariesPage = lazy(() => import('@/pages/vocabularies/VocabulariesPage'))
const DictionaryPage = lazy(() => import('@/pages/dictionary/DictionaryPage'))
const ReviewPage = lazy(() => import('@/pages/review/ReviewPage'))
const FlashcardsPage = lazy(() => import('@/pages/flashcards/FlashcardsPage'))
const QuizPage = lazy(() => import('@/pages/quiz/QuizPage'))
const TypingPage = lazy(() => import('@/pages/typing/TypingPage'))
const PublicCollectionsPage = lazy(() => import('@/pages/publicCollections/PublicCollectionsPage'))
const AiPage = lazy(() => import('@/pages/ai/AiPage'))
const ShadowingPage = lazy(() => import('@/pages/shadowing/ShadowingPage'))
const RoleplayPage = lazy(() => import('@/pages/roleplay/RoleplayPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminCollectionsPage = lazy(() => import('@/pages/admin/AdminCollectionsPage'))
const AdminPublicCollectionsPage = lazy(() => import('@/pages/admin/AdminPublicCollectionsPage'))
const AdminShadowingPage = lazy(() => import('@/pages/admin/AdminShadowingPage'))
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage'))
const AdminSystemPage = lazy(() => import('@/pages/admin/AdminSystemPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function withPageSuspense(element) {
  return (
    <Suspense fallback={<LoadingScreen title="Loading page..." description="Preparing this VocabVerse workspace." />}>
      {element}
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        element: <PublicRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: 'login', element: withPageSuspense(<LoginPage />) },
              { path: 'register', element: withPageSuspense(<RegisterPage />) },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: 'dashboard', element: withPageSuspense(<DashboardPage />) },
              { path: 'collections', element: withPageSuspense(<CollectionsPage />) },
              { path: 'collections/:collectionId', element: withPageSuspense(<CollectionDetailPage />) },
              { path: 'vocabularies', element: withPageSuspense(<VocabulariesPage />) },
              { path: 'dictionary', element: withPageSuspense(<DictionaryPage />) },
              { path: 'review', element: withPageSuspense(<ReviewPage />) },
              { path: 'flashcards', element: withPageSuspense(<FlashcardsPage />) },
              { path: 'quiz', element: withPageSuspense(<QuizPage />) },
              { path: 'typing', element: withPageSuspense(<TypingPage />) },
              { path: 'public/collections', element: withPageSuspense(<PublicCollectionsPage />) },
              { path: 'public/collections/:collectionId', element: withPageSuspense(<PublicCollectionsPage />) },
              { path: 'ai', element: withPageSuspense(<AiPage />) },
              { path: 'shadowing', element: withPageSuspense(<ShadowingPage />) },
              { path: 'shadowing/:lessonId', element: withPageSuspense(<ShadowingPage />) },
              { path: 'roleplay', element: withPageSuspense(<RoleplayPage />) },
              { path: 'roleplay/:sessionId', element: withPageSuspense(<RoleplayPage />) },
            ],
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: withPageSuspense(<AdminDashboardPage />) },
              { path: 'dashboard', element: withPageSuspense(<AdminDashboardPage />) },
              { path: 'users', element: withPageSuspense(<AdminUsersPage />) },
              { path: 'collections', element: withPageSuspense(<AdminCollectionsPage />) },
              { path: 'public-collections', element: withPageSuspense(<AdminPublicCollectionsPage />) },
              { path: 'shadowing', element: withPageSuspense(<AdminShadowingPage />) },
              { path: 'notifications', element: withPageSuspense(<AdminNotificationsPage />) },
              { path: 'system', element: withPageSuspense(<AdminSystemPage />) },
            ],
          },
        ],
      },
      { path: '*', element: withPageSuspense(<NotFoundPage />) },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}

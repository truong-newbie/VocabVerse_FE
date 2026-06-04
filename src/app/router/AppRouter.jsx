import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import PublicRoute from '@/components/routes/PublicRoute'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import CollectionsPage from '@/pages/collections/CollectionsPage'
import VocabulariesPage from '@/pages/vocabularies/VocabulariesPage'
import ReviewPage from '@/pages/review/ReviewPage'
import FlashcardsPage from '@/pages/flashcards/FlashcardsPage'
import QuizPage from '@/pages/quiz/QuizPage'
import TypingPage from '@/pages/typing/TypingPage'
import AiPage from '@/pages/ai/AiPage'
import ShadowingPage from '@/pages/shadowing/ShadowingPage'
import RoleplayPage from '@/pages/roleplay/RoleplayPage'

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
              { path: 'login', element: <LoginPage /> },
              { path: 'register', element: <RegisterPage /> },
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
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'collections', element: <CollectionsPage /> },
              { path: 'vocabularies', element: <VocabulariesPage /> },
              { path: 'review', element: <ReviewPage /> },
              { path: 'flashcards', element: <FlashcardsPage /> },
              { path: 'quiz', element: <QuizPage /> },
              { path: 'typing', element: <TypingPage /> },
              { path: 'ai', element: <AiPage /> },
              { path: 'shadowing', element: <ShadowingPage /> },
              { path: 'roleplay', element: <RoleplayPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from '../../components/layout/RootLayout'
import AuthLayout from '../../components/layout/AuthLayout'
import AppLayout from '../../components/layout/AppLayout'
import ProtectedRoute from '../../components/routes/ProtectedRoute'
import PublicRoute from '../../components/routes/PublicRoute'
import LoginPage from '../../pages/auth/LoginPage'
import RegisterPage from '../../pages/auth/RegisterPage'
import DashboardPage from '../../pages/dashboard/DashboardPage'
import CollectionsPage from '../../pages/collections/CollectionsPage'
import VocabulariesPage from '../../pages/vocabularies/VocabulariesPage'
import ReviewPage from '../../pages/review/ReviewPage'
import FlashcardsPage from '../../pages/flashcards/FlashcardsPage'
import QuizPage from '../../pages/quiz/QuizPage'
import TypingPage from '../../pages/typing/TypingPage'
import AiPage from '../../pages/ai/AiPage'
import ShadowingPage from '../../pages/shadowing/ShadowingPage'
import RoleplayPage from '../../pages/roleplay/RoleplayPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="vocabularies" element={<VocabulariesPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="typing" element={<TypingPage />} />
              <Route path="ai" element={<AiPage />} />
              <Route path="shadowing" element={<ShadowingPage />} />
              <Route path="roleplay" element={<RoleplayPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

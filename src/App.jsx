import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import OfflineIndicator from './components/layout/OfflineIndicator';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/Toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { seedDemoData } from './utils/demoLoader';
import { syncOfflineQueue } from './services/firestoreService';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RoleSelect from './pages/RoleSelect';
import Register from './pages/Register';
import RecordAssessment from './pages/RecordAssessment';
import AthleteProfile from './pages/AthleteProfile';
import ScoutView from './pages/ScoutView';
import Challenges from './pages/Challenges';
import DemoMode from './pages/DemoMode';
import Settings from './pages/Settings';
import VerifySenPass from './pages/VerifySenPass';
import SenBot from './components/chatbot/SenBot';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  // Seed demo data on first load
  useEffect(() => {
    const result = seedDemoData();
    if (result) {
      console.log(`[SENTRAK] Seeded ${result.athletes} athletes, ${result.assessments} assessments`);
    }
  }, []);

  // Sync offline queue when online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('[SENTRAK] Online — syncing offline queue...');
      const result = await syncOfflineQueue();
      if (result.synced > 0) console.log(`[SENTRAK] Synced ${result.synced} items`);
    };

    window.addEventListener('online', handleOnline);
    if (navigator.onLine) handleOnline();
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <div className="app">
      <OfflineIndicator />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={
            <ErrorBoundary fallbackMessage="Could not load the landing page.">
              <Landing />
            </ErrorBoundary>
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/select-role" element={
            <ProtectedRoute><RoleSelect /></ProtectedRoute>
          } />

          {/* Coach routes */}
          <Route path="/register" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Registration form encountered an error.">
                <Register />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/assess" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/assess/:athleteId" element={
            <ProtectedRoute allowedRoles={['coach', 'admin']}>
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Shared — Profile viewable by all authenticated users */}
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <ErrorBoundary fallbackMessage="Could not load athlete profile.">
                <AthleteProfile />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Scout routes */}
          <Route path="/scout" element={
            <ProtectedRoute allowedRoles={['scout', 'admin']}>
              <ErrorBoundary fallbackMessage="Scout dashboard encountered an error.">
                <ScoutView />
              </ErrorBoundary>
            </ProtectedRoute>
          } />

          {/* Open to all authenticated */}
          <Route path="/challenges" element={
            <ProtectedRoute>
              <ErrorBoundary fallbackMessage="Challenges page encountered an error.">
                <Challenges />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/demo" element={
            <ErrorBoundary fallbackMessage="Demo mode encountered an error.">
              <DemoMode />
            </ErrorBoundary>
          } />
          <Route path="/verify/:certId" element={
            <VerifySenPass />
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SenBot />
      <BottomNav />
      <SpeedInsights />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

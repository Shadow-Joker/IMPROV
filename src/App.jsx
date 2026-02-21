import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import OfflineIndicator from './components/layout/OfflineIndicator';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { ToastProvider } from './components/shared/Toast';
import { seedDemoData } from './utils/demoLoader';
import Landing from './pages/Landing';
import Register from './pages/Register';
import RecordAssessment from './pages/RecordAssessment';
import AthleteProfile from './pages/AthleteProfile';
import ScoutView from './pages/ScoutView';
import Challenges from './pages/Challenges';
import DemoMode from './pages/DemoMode';

export default function App() {
  // Seed demo data on first load
  useEffect(() => {
    const result = seedDemoData();
    if (result) {
      console.log(`[SENTRAK] Seeded ${result.athletes} athletes, ${result.assessments} assessments`);
    }
  }, []);

  return (
    <ToastProvider>
      <div className="app">
        <OfflineIndicator />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <ErrorBoundary fallbackMessage="Could not load the landing page.">
                <Landing />
              </ErrorBoundary>
            } />
            <Route path="/register" element={
              <ErrorBoundary fallbackMessage="Registration form encountered an error.">
                <Register />
              </ErrorBoundary>
            } />
            <Route path="/assess" element={
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            } />
            <Route path="/assess/:athleteId" element={
              <ErrorBoundary fallbackMessage="Assessment module encountered an error.">
                <RecordAssessment />
              </ErrorBoundary>
            } />
            <Route path="/profile/:id" element={
              <ErrorBoundary fallbackMessage="Could not load athlete profile.">
                <AthleteProfile />
              </ErrorBoundary>
            } />
            <Route path="/scout" element={
              <ErrorBoundary fallbackMessage="Scout dashboard encountered an error.">
                <ScoutView />
              </ErrorBoundary>
            } />
            <Route path="/challenges" element={
              <ErrorBoundary fallbackMessage="Challenges page encountered an error.">
                <Challenges />
              </ErrorBoundary>
            } />
            <Route path="/demo" element={
              <ErrorBoundary fallbackMessage="Demo mode encountered an error.">
                <DemoMode />
              </ErrorBoundary>
            } />
          </Routes>
        </main>
        <BottomNav />
        <SpeedInsights />
      </div>
    </ToastProvider>
  );
}

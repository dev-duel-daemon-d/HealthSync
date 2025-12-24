import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Wellness from './pages/Wellness';
import Education from './pages/Education';
import Profile from './pages/Profile';
import { MedicationList } from './components/MedicationList';
import { AppointmentList } from './components/AppointmentList';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Landing Page - redirects to dashboard if logged in */}
        <Route path="/" element={<LandingPageRoute />} />

        {/* Auth Routes - redirect to dashboard if already logged in */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />
        <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Feature Specific Routes - Wrapped in Layout for consistency */}
        <Route path="/medications" element={
          <ProtectedRoute>
            <Layout>
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Medication Management</h1>
                <MedicationList />
              </div>
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/appointments" element={
          <ProtectedRoute>
            <Layout>
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Appointment Schedule</h1>
                <AppointmentList />
              </div>
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// Helper component to show landing page to non-authenticated users
function LandingPageRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

// Helper component to redirect authenticated users away from login/register
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Helper to route based on user role
function RoleBasedDashboard() {
  const { user } = useAuth();
  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }
  return <Dashboard />;
}

export default App;

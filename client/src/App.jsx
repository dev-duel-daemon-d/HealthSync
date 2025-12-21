import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wellness from './pages/Wellness';
import Education from './pages/Education';
import { MedicationList } from './components/MedicationList';
import { AppointmentList } from './components/AppointmentList';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />

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

// Helper component to redirect authenticated users away from login/register
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default App;

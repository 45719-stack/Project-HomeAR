import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import RoomDesign from './pages/RoomDesign';
import CostEstimator from './pages/CostEstimator';
import Vendors from './pages/Vendors';
import RedesignPage from './pages/RedesignPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UpgradePage from './pages/UpgradePage';



import { API_BASE_URL } from './config/api';
import ApiConfigError from './components/ApiConfigError';
import { AuthProvider } from './context/AuthContext';

function App() {
  // Strict Production Guard
  if (import.meta.env.PROD && !API_BASE_URL) {
    return <ApiConfigError />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="design" element={<RoomDesign />} />
            <Route path="redesign" element={<RedesignPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="estimator" element={
              <ProtectedRoute featureName="Cost Estimator">
                <CostEstimator />
              </ProtectedRoute>
            } />
            <Route path="vendors" element={
              <ProtectedRoute featureName="Vendor Search">
                <Vendors />
              </ProtectedRoute>
            } />
            <Route path="upgrade" element={<UpgradePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

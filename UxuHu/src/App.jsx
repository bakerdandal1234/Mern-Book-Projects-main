
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/WelCome';
import AuthSuccess from './pages/auth/AuthSuccess';
import EmailVerificationResult from './pages/EmailVerificationResult';  
function App() {


  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          {/* <Route path="/" element={<Welcome />} /> */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/verify-email/:token" element={<EmailVerificationResult />} />
          {/* <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} /> */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
          path="/"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

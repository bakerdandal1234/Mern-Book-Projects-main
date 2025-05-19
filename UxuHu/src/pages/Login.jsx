import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../components/ForgetPasswordModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address ui' }),
  password: z.string()
    .min(1, { message: 'Password is required' }),
  remember: z.boolean().optional()
});

function Login() {
  const { theme } = useContext(ThemeContext);
  const { login, isLoading, errorsLogin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  // Handle form submission
  const onSubmit = async (data) => {
    await login(data, navigate);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }}>Login</h1>
        <p style={{ color: theme === 'light' ? '#000000' : '#ffffff', textAlign: 'center', marginBottom: '20px' }}>
          Enter your information to login
        </p>

        {errorsLogin && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
            {errorsLogin}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="text"
              placeholder="Email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '8px',
                border: errors.email || errorsLogin ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: theme === 'light' ? '#f5f9ff' : '#1f2937',
              }}
            />
            {errors.email && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              style={{
                width: '100%',
                padding: '8px',
                border: errors.password || errorsLogin ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: theme === 'light' ? '#f5f9ff' : '#1f2937',
              }}
            />
            {errors.password && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="remember"
              {...register('remember')}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="remember">Remember me</label>
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: theme === 'light' ? '#2E5984' : '#BCD2E8',
                cursor: 'pointer'
              }}
            >
              Forgot password
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isLoading ? '#cccccc' : '#e3165b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'LOGIN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', position: 'relative', marginBottom: '20px' }}>
          <div
            style={{
              borderBottom: '1px solid #ddd',
              position: 'absolute',
              width: '100%',
              top: '50%'
            }}
          ></div>
          <span
            style={{
              backgroundColor: theme === 'light' ? 'white' : '#121212',
              padding: '0 10px',
              position: 'relative',
              color: '#666',
              fontSize: '14px'
            }}
          >
            Or login with
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center px-4 py-2 border-2 border-solid border-[#2E5984] rounded-md" 
            type="button"
          >
            <FaGoogle size={16} />
            <span style={{ paddingLeft: '10px', color: theme === 'light' ? '#000000' : '#ffffff' }}>Sign in with Google</span>
          </button>

          <button 
            onClick={handleGithubLogin} 
            className="w-full flex items-center justify-center px-4 py-2 border-2 border-solid border-[#2E5984] rounded-md" 
            type="button"
          >
            <FaGithub size={16} />
            <span style={{ paddingLeft: '10px', color: theme === 'light' ? '#000000' : '#ffffff' }}>Sign in with Github</span>
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p>
            Don't have an account?&nbsp;
            <Link to="/signup" style={{ color: theme === 'light' ? '#2E5984' : '#BCD2E8', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Login;
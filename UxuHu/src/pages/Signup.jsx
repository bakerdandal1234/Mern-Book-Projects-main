import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Define the validation schema with Zod
const signupSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters ui' }),
  email: z.string().email({ message: 'Please enter a valid email address ui' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  password_confirmation: z.string(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and privacy policy' }),
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});


function Signup() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { register: authRegister, errors: authErrors, isLoading } = useAuth();

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      agreeToTerms: false,
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    authRegister(data, navigate);
  };

  // Combine authentication errors with form validation errors
  const displayErrors = { ...errors, ...authErrors };

  return (
    <>
      <Header />
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }}>Sign up</h1>
        <p style={{ color: theme === 'light' ? '#000000' : '#ffffff', textAlign: 'center', marginBottom: '20px' }}>
          Enter your information to sign up
        </p>

        {displayErrors.general && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
            {displayErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
            <input
              type="text"
              placeholder="Name"
              {...register('username')}
              style={{
                width: '100%',
                color: theme === 'light' ? '#000000' : '#1f2937',
                padding: '8px',
                backgroundColor: '#f5f9ff',
                border: displayErrors.username ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {displayErrors.username && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {displayErrors.username.message || displayErrors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="text"
              placeholder="Email"
              {...register('email')}
              style={{
                width: '100%',
                color: theme === 'light' ? '#000000' : '#1f2937',
                padding: '8px',
                backgroundColor: '#f5f9ff',
                border: displayErrors.email ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {displayErrors.email && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {displayErrors.email.message || displayErrors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              style={{
                width: '100%',
                color: theme === 'light' ? '#000000' : '#1f2937',
                padding: '8px',
                backgroundColor: '#f5f9ff',
                border: displayErrors.password ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {displayErrors.password && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {displayErrors.password.message || displayErrors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('password_confirmation')}
              style={{
                width: '100%',
                color: theme === 'light' ? '#000000' : '#1f2937',
                padding: '8px',
                backgroundColor: '#f5f9ff',
                border: displayErrors.password_confirmation ? '1px solid #c62828' : '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {displayErrors.password_confirmation && (
              <p style={{ color: '#c62828', fontSize: '12px', marginTop: '5px' }}>
                {displayErrors.password_confirmation.message || displayErrors.password_confirmation}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="terms"
              {...register('agreeToTerms')}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="terms">
              I agree with <a href="#" style={{ color: theme === 'light' ? '#2E5984' : '#BCD2E8', textDecoration: 'none' }}>terms</a> and <a href="#" style={{ color: theme === 'light' ? '#2E5984' : '#BCD2E8', textDecoration: 'none' }}>privacy policy</a>
            </label>
          </div>
          {displayErrors.agreeToTerms && (
            <p style={{ color: '#c62828', fontSize: '12px', marginTop: '-15px', marginBottom: '15px' }}>
              {displayErrors.agreeToTerms.message || displayErrors.agreeToTerms}
            </p>
          )}

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
              marginBottom: '10px'
            }}
          >
            {isLoading ? 'جاري التسجيل...' : 'SIGN UP'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login" style={{ color: theme === 'light' ? '#2E5984' : '#BCD2E8', textDecoration: 'none' }}>Sign in</Link></p>
        </div>
      </div>
    </>
  );
}

export default Signup;
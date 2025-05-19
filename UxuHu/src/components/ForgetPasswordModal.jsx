// src/components/ForgotPasswordModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';

// Zod schema for email validation
const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .nonempty('email is required')
      .email('Please enter a valid email address'),
  });

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { forgetPassword, forgotPasswordErrors } = useAuth();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    await forgetPassword(data.email);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#2E5984' }}>Reset Password</h2>
        <p style={{ marginBottom: '10px', color: '#2E5984' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {forgotPasswordErrors && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
            }}
          >
            {forgotPasswordErrors}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Email"
            {...register('email')}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          {errors.email && (
            <p style={{ color: '#c62828', marginBottom: '10px', fontSize: '0.875rem' }}>
              {errors.email.message}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2E5984',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Send Reset Link
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

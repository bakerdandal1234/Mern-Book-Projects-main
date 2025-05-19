import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for password reset
const resetSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const { theme } = useContext(ThemeContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyResetToken, resetPassword, errors: authErrors } = useAuth();

  const [tokenValid, setTokenValid] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    (async () => {
      const isValid = await verifyResetToken(token);
      setTokenValid(isValid);
    })();
  }, [token, verifyResetToken]);

  const onSubmit = async (data) => {
    await resetPassword(data.newPassword, data.confirmPassword, token, navigate);
  };

  return (
    <>
      <Header />

      {tokenValid === null && <p>Loading...</p>}

      {tokenValid === false && (
        <div className="max-w-md mx-auto mt-20 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Token غير صالح</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-6">{authErrors}</p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 bg-blue-700 text-white rounded-md font-semibold"
          >
            Login
          </Link>
        </div>
      )}

      {tokenValid === true && (
        <div className="max-w-md mx-auto mt-12 p-6 space-y-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reset Password
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Please enter your new password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                New Password
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
              />
              {errors.newPassword && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 font-bold rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Reset Password
            </button>

            {authErrors && (
              <p className="text-center text-red-600 mt-2">{authErrors}</p>
            )}
          </form>
        </div>
      )}
    </>
  );
}

// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsLogin, setErrorsLogin] = useState('');
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState('');
  
  const init = async () => {
    try {
      const response = await axiosInstance.get('/me');
      setUser(response.data.user); // لاحظ .user حسب السيرفر
      console.log("تم تحميل المستخدم بنجاح:", response.data.user);
    } catch (error) {
      console.log("فشل تحميل المستخدم:", error?.response?.data?.message || error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    init();
  }, []);
  
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const response = await axiosInstance.get('/me');
  //       setUser(response.data);
  //       console.log("تم تحميل المستخدم بنجاح:", response.data);
  //     } catch (error) {
  //       console.log("فشل تحميل المستخدم:", error?.response?.data?.message || error.message);
  //       setUser(null);
  //     }
  //   };

  //   init();
  // }, []);

  const login = async (formData, navigate) => {
    setIsLoading(true);
    setErrorsLogin('');
    try {
      const response = await axiosInstance.post('/login', formData);
      setUser(response.data.user);
      setErrorsLogin('');
      navigate('/');
    } catch (error) {
      setErrorsLogin(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData, navigate) => {
    setIsLoading(true);
    setErrors({});

    if (formData.agreeToTerms === false) {
      setErrors({ agreeToTerms: 'يجب أن توافق على الشروط والأحكام' });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'تأكيد كلمة المرور غير متطابق' });
      setIsLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/signup', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      const validationErrors = error.response?.data?.errors;
      const translatedErrors = {};

      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((item) => {
          switch (item.path) {
            case 'username':
              translatedErrors.username = item.msg;
              break;
            case 'email':
              translatedErrors.email = item.msg;
              break;
            case 'password':
              translatedErrors.password = item.msg;
              break;
            default:
              translatedErrors[item.path] = item.msg;
          }
        });
      } else if (error.response?.data?.message) {
        translatedErrors.email = error.response?.data?.message;
      } else {
        translatedErrors.general = error.response?.data?.error || 'حدث خطأ أثناء التسجيل';
      }

      setErrors(translatedErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (navigate) => {
    setIsLoading(true);
    setErrors({});
    try {
      await axiosInstance.post('/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setErrors({ general: 'حدث خطأ أثناء تسجيل الخروج' });
    } finally {
      setIsLoading(false);
    }
  };

  const forgetPassword = async (email) => {
    setIsLoading(true);
    setForgotPasswordErrors('');
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      console.log('Forget password response:', response);
      setForgotPasswordErrors(response.data.message);
    } catch (error) {
      setForgotPasswordErrors(error.response?.data?.message || error.message);
      console.error('Forget password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (newPassword, confirmPassword, token, navigate) => {
    console.log("resetPassword called");
    setIsLoading(true);
    setErrors('');

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      setErrors('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(`/reset-password/${token}`, {
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      console.log("Password reset successful", res.data);
      navigate('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const res = await axiosInstance.get(`/verify-reset-token/${token}`);
      console.log("Token verification successful", res.data);
      return res.data.success;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      setErrors(error.response?.data?.message);
      return false;
    }
  };

  const verifyEmail = async (token) => {
    try {
      const res = await axiosInstance.get(`/verify-email/${token}`);
      console.log("Email verification successful", res.data);
      return res.data.success;
    } catch (error) {
      console.error('Error verifying email:', error);
      setErrors(error.response?.data?.message || "Failed to verify email");
      return false;
    }
  };

  const resendVerificationEmail = async (email, navigate) => {
    setIsLoading(true);
    setErrors('');
    try {
      const res = await axiosInstance.post('/resend-verification-email', { email });
      console.log("Verification email resent successfully", res.data);
      navigate('/login');
    } catch (error) {
      console.error('Error resending verification email:', error);
      setErrors(error.response?.data?.message || "Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgetPassword,
        isLoading,
        errors,
        errorsLogin,
        forgotPasswordErrors,
        resetPassword,
        verifyResetToken,
        verifyEmail,
        resendVerificationEmail,
        init,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for resend email
const resendSchema = z.object({
  email: z.string().nonempty('يرجى إدخال بريد إلكتروني.').email('بريد إلكتروني غير صالح'),
});

export default function EmailVerificationResult() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail, errors: authErrors, resendVerificationEmail } = useAuth();
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(false);

  // React Hook Form for resend
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resendSchema) });

  useEffect(() => {
    (async () => {
      const isValid = await verifyEmail(token);
      setTokenValid(isValid);
    })();
  }, [token, verifyEmail]);

  const onResend = async (data) => {
    setLoading(true);
    await resendVerificationEmail(data.email, navigate);
    setLoading(false);
  };

  const renderContent = () => {
    if (tokenValid === null) return <p>🔄 جارٍ التحقق...</p>;
    if (tokenValid) {
      return (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-2">✅ تم التحقق بنجاح</h2>
          <p className="mb-4">تم تفعيل بريدك الإلكتروني. يمكنك الآن تسجيل الدخول.</p>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-green-700 text-white rounded">
            تسجيل الدخول
          </button>
        </>
      );
    }
    return (
      <>
        <h2 className="text-2xl font-bold text-red-600 mb-2">❌ فشل التحقق</h2>
        <p className="mb-4">رابط التحقق غير صالح أو منتهي. يمكنك إعادة إرسال الرابط.</p>
        <form onSubmit={handleSubmit(onResend)} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            {...register('email')}
            disabled={loading}
            className="p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-4 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {loading ? 'جارٍ الإرسال...' : 'إعادة إرسال رابط التحقق'}
          </button>
          {authErrors && <p className="text-red-600 text-sm">{authErrors}</p>}
        </form>
      </>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border-2 rounded bg-gray-50">
      {renderContent()}
    </div>
  );
}

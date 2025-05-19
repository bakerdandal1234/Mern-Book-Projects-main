import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Box,
  CircularProgress
} from '@mui/material';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeConext.jsx';
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

  // React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resendSchema)
  });

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

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
          <Stack spacing={3}>
            {tokenValid === null && (
              <Box textAlign="center">
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>🔄 جارٍ التحقق...</Typography>
              </Box>
            )}

            {tokenValid === true && (
              <Stack spacing={2} alignItems="center">
                <Typography variant="h5" color="success.main">✅ تم التحقق بنجاح</Typography>
                <Typography>تم تفعيل بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.</Typography>
                <Button variant="contained" onClick={() => navigate('/login')} fullWidth>
                  تسجيل الدخول
                </Button>
              </Stack>
            )}

            {tokenValid === false && (
              <Stack spacing={2}>
                <Alert severity="error">{authErrors || 'رابط التحقق غير صالح أو منتهي.'}</Alert>
                <Typography>يمكنك إعادة إرسال رابط التحقق إلى بريدك الإلكتروني:</Typography>
                <TextField
                  label="البريد الإلكتروني"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleSubmit(onResend)}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'جارٍ الإرسال...' : 'إعادة إرسال رابط التحقق'}
                </Button>
                {authErrors && <Alert severity="error">{authErrors}</Alert>}
                <Button component={RouterLink} to="/login" fullWidth>
                  الرجوع لتسجيل الدخول
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

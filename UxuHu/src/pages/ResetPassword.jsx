import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Link
} from '@mui/material';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for password reset
const resetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
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
    formState: { errors }
  } = useForm({ resolver: zodResolver(resetSchema) });

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
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            {tokenValid === null && (
              <Typography align="center">Loading...</Typography>
            )}

            {tokenValid === false && (
              <>
                <Alert severity="error">{typeof authErrors === 'string' ? authErrors : authErrors?.message || 'Invalid or expired token.'}</Alert>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  fullWidth
                >
                  Go to Login
                </Button>
              </>
            )}

            {tokenValid === true && (
              <>
                <Typography variant="h5" align="center" fontWeight="bold">
                  Reset Password
                </Typography>
                <Typography variant="body2" align="center">
                  Enter your new password below
                </Typography>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  {...register('newPassword')}
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword?.message}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  {...register('confirmPassword')}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                />
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleSubmit(onSubmit)}
                >
                  Reset Password
                </Button>
                {typeof authErrors === 'string' && (
                  <Alert severity="error">{authErrors}</Alert>
                )}
                <Typography variant="body2" align="center">
                  Back to{' '}
                  <Link component={RouterLink} to="/login">
                    Login
                  </Link>
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

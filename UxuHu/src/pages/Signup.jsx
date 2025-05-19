import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Stack
} from '@mui/material';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for validation
const signupSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters uu' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  password_confirmation: z.string(),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: 'You must agree to the terms and privacy policy' }) }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});

export default function Signup() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { register: authRegister, errors: authErrors, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      agreeToTerms: false
    }
  });

  const onSubmit = (data) => authRegister(data, navigate);
  const displayErrors = { ...errors, ...authErrors };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ mt: 2, p: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" fontWeight="bold">
              Sign Up
            </Typography>

            {displayErrors.general && (
              <Alert severity="error">{displayErrors.general}</Alert>
            )}

            <TextField
              label="Username"
              fullWidth
              {...register('username')}
              error={Boolean(displayErrors.username)}
              helperText={displayErrors.username?.message}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email')}
              error={Boolean(displayErrors.email)}
              helperText={displayErrors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register('password')}
              error={Boolean(displayErrors.password)}
              helperText={displayErrors.password?.message}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register('password_confirmation')}
              error={Boolean(displayErrors.password_confirmation)}
              helperText={displayErrors.password_confirmation?.message}
            />

            <FormControlLabel
              control={<Checkbox {...register('agreeToTerms')} />}
              label={
                <Typography variant="body2">
                  I agree to the <RouterLink to="/terms">Terms</RouterLink> and <RouterLink to="/privacy">Privacy Policy</RouterLink>
                </Typography>
              }
            />
            {displayErrors.agreeToTerms && (
              <Typography variant="caption" color="error">
                {displayErrors.agreeToTerms.message}
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <RouterLink to="/login">Sign in</RouterLink>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Stack,
  Alert,
  Box
} from '@mui/material';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Header from '../components/Header';
import ForgotPasswordModal from '../components/ForgetPasswordModal.jsx';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  remember: z.boolean().optional()
});

export default function Login() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { login, isLoading, errorsLogin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false }
  });

  const onSubmit = async (data) => {
    await login(data, navigate);
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ mt: 3, p: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" fontWeight="bold">
              Login
            </Typography>
            {errorsLogin && <Alert severity="error">{errorsLogin}</Alert>}
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                control={<Checkbox {...register('remember')} />}
                label="Remember me"
              />
              <Button
                sx={{ textTransform: 'none' }}
                size="small"
                onClick={() => setIsModalOpen(true)}
              >
                Forgot password?
              </Button>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ position: 'relative', textAlign: 'center', my: 2 }}>
              <Divider />
              <Typography
                component="span"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  px: 1,
                  color: 'text.secondary'
                }}
              >
                Or login with
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaGoogle />}
                onClick={() => (window.location.href = '/auth/google')}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FaGithub />}
                onClick={() => (window.location.href = '/auth/github')}
              >
                Sign in with Github
              </Button>
            </Stack>
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <RouterLink to="/signup">Sign up</RouterLink>
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

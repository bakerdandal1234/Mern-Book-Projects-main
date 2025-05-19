
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Alert,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext.jsx';

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().nonempty('Email is required').email('Please enter a valid email address ')
});

export default function ForgotPasswordModal({ open, onClose }) {
  const { forgetPassword, forgotPasswordErrors } = useAuth();
  console.log('Modal open state:', open);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async ({ email }) => {
    await forgetPassword(email);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">Reset Password</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        {forgotPasswordErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {forgotPasswordErrors}
          </Alert>
        )}
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            type="text"
            fullWidth
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            disabled={isSubmitting}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="forgot-password-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

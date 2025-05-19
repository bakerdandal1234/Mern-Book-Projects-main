import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const isLight = theme === 'light';

  return (
    <AppBar position="static" color={isLight ? 'primary' : 'default'}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* عنوان أو شعار الموقع */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          baker dandal
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* زر تبديل الثيم */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleTheme}
            sx={{
              bgcolor: isLight ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: isLight ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
              }
            }}
          >
            {isLight ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* روابط أو أزرار الدخول/التسجيل أو لوحة التحكم وتسجيل الخروج */}
          {user ? (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 2, px: 2 }}
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="error"
                sx={{ borderRadius: 2, px: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 2, px: 2 }}
              >
                Signup
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="secondary"
                sx={{ borderRadius: 2, px: 2 }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import { loginUser, registerUser, clearError } from '../../store/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(0);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [tab, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(loginForm));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const { confirmPassword, ...registerData } = registerForm;
    await dispatch(registerUser(registerData));
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome
          </Typography>

          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {tab === 0 && (
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
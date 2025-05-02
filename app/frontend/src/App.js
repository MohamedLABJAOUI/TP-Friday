import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
import LoadingState from './components/LoadingState';
import theme from './theme';
import './App.css';

// Material UI imports
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  CssBaseline,
  ThemeProvider,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

function NavButtons({ handleLogout }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    {
      text: 'Products',
      icon: <ShoppingBagIcon />,
      path: '/products',
    },
    {
      text: 'Orders',
      icon: <ShoppingCartIcon />,
      path: '/orders',
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        pt: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.12)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            mt: 1,
          }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          onClick={toggleDrawer(true)}
          sx={{ ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {navItems.map((item) => (
        <Button
          key={item.text}
          component={Link}
          to={item.path}
          color="inherit"
          startIcon={item.icon}
          sx={{
            mx: 1,
            borderRadius: 2,
            backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            },
          }}
        >
          {item.text}
        </Button>
      ))}
      <Button
        color="inherit"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          ml: 1,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          await axios.get('/api/auth/status', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setToken(storedToken);
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingState message="Loading application..." />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="App" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar 
            position="static"
            sx={{
              background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Toolbar>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <HomeIcon />
                E-Commerce Store
              </Typography>
              {token && <NavButtons handleLogout={handleLogout} />}
            </Toolbar>
          </AppBar>
          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: 4, 
              mb: 4,
              minHeight: 'calc(100vh - 128px)',
            }}
          >
            <Routes>
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/products" />} />
              <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/products" />} />
              <Route path="/products" element={token ? <ProductList /> : <Navigate to="/login" />} />
              <Route path="/orders" element={token ? <OrderList /> : <Navigate to="/login" />} />
              <Route path="/" element={<Navigate to={token ? "/products" : "/login"} />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
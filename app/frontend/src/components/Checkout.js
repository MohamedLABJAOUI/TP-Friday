import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Divider,
  CircularProgress,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import PublicIcon from '@mui/icons-material/Public';

function Checkout({ product, onCancel, onSuccess }) {
  const theme = useTheme();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () => {
    return address.street && address.city && address.zipCode && address.country;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/orders', {
        products: [{
          productId: product._id,
          quantity: 1,
          price: product.price
        }],
        totalAmount: product.price,
        shippingAddress: address
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setOrderId(response.data._id || response.data.id);
        setOrderCompleted(true);
        setLoading(false);
        if (onSuccess) {
          setTimeout(() => onSuccess(response.data), 2000);
        }
      }
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      {orderCompleted ? (
        <Fade in={true} timeout={800}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 4,
              background: 'linear-gradient(135deg, #f6fff9 0%, #e6f4ff 100%)',
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Zoom in={true} timeout={1000}>
              <CheckCircleOutlineIcon 
                sx={{ 
                  fontSize: 80, 
                  mb: 3,
                  color: theme.palette.success.main,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  animation: 'pulse 2s infinite'
                }} 
              />
            </Zoom>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'fadeIn 1s ease-in'
              }}
            >
              Thank you!
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                fontWeight: 500,
                animation: 'fadeIn 1s ease-in 0.2s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              Your order was placed successfully.
            </Typography>
            <Box 
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                p: 3,
                borderRadius: 3,
                mb: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                animation: 'slideUp 0.5s ease-out 0.3s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Order number:
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  letterSpacing: 1
                }}
              >
                {orderId || 'Generated'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={onCancel}
              sx={{ 
                px: 6,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #96c93d 0%, #00b09b 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                },
                animation: 'fadeIn 1s ease-in 0.5s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Fade>
      ) : (
        <Box sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ShoppingCartIcon />
            Complete Your Order
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Please provide your shipping details below
          </Typography>
          
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              mb: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                mb: 1
              }}
            >
              {product.name || 'Product Name'}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2
              }}
            >
              €{product.price ? parseFloat(product.price).toLocaleString() : '0'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {product.description || 'Product description'}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                animation: 'shake 0.5s ease-in-out'
              }}
            >
              {error}
            </Alert>
          )}

          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3,
              fontWeight: 600
            }}
          >
            <LocalShippingIcon color="primary" />
            Delivery Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.95)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.95)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Zip Code"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <LocalPostOfficeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.95)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PublicIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.95)'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box 
              sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'space-between',
                gap: 2
              }}
            >
              <Button 
                variant="outlined"
                onClick={onCancel}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  borderWidth: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                disabled={!isAddressValid() || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Paper>
  );
}

export default Checkout; 
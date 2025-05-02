import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderList.css';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Button,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';

function OrderList() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main' }} />;
      case 'cancelled':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <PendingIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3].map((index) => (
        <Grid item xs={12} key={index}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardHeader
              avatar={<Skeleton variant="circular" width={40} height={40} />}
              title={<Skeleton width="40%" />}
              subheader={<Skeleton width="30%" />}
            />
            <CardContent>
              <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingBagIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Orders
        </Typography>
      </Box>
      <LoadingSkeleton />
    </Box>
  );

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBagIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            My Orders
          </Typography>
        </Box>
        <Tooltip title="Refresh orders">
          <IconButton onClick={fetchOrders} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchOrders}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 2
          }}
        >
          <InfoIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 3 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No Orders Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to see your orders here
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ShoppingBagIcon />}
            href="/products"
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map(order => (
            <Grid item xs={12} key={order._id}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': { 
                    boxShadow: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">
                        Order #{order._id.slice(-8)}
                      </Typography>
                      {getStatusIcon(order.status)}
                    </Box>
                  }
                  subheader={formatDate(order.createdAt)}
                  action={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={order.status || 'Pending'} 
                        color={
                          order.status?.toLowerCase() === 'completed' ? 'success' :
                          order.status?.toLowerCase() === 'cancelled' ? 'error' :
                          'warning'
                        }
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`€${order.totalAmount.toFixed(2)}`} 
                        color="primary" 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  }
                  sx={{ 
                    bgcolor: 'background.paper',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalShippingIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Shipping Address:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {order.shippingAddress || "No address provided"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                    Order Items
                  </Typography>

                  <TableContainer 
                    component={Paper} 
                    elevation={0} 
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'background.paper' }}>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.products.map((item, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {item.productId}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">€{item.price.toFixed(2)}</TableCell>
                            <TableCell align="right">€{(item.quantity * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'background.paper' }}>
                          <TableCell colSpan={2} />
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            €{order.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default OrderList; 
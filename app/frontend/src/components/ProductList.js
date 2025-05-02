import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';
import Checkout from './Checkout';

// Material UI imports
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
  Dialog,
  DialogContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';

function ProductList() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setOpenSnackbar(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProduct({ name: '', price: '', description: '' });
      setShowAddForm(false);
      fetchProducts();
      showSuccessMessage('Product added successfully!');
    } catch (err) {
      setError('Failed to add product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      showSuccessMessage('Product deleted successfully!');
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowOrderForm(true);
    setError(null);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        return;
      }

      const response = await axios.post('/api/orders', {
        products: [{
          productId: selectedProduct._id,
          quantity: 1,
          price: selectedProduct.price
        }],
        totalAmount: selectedProduct.price,
        shippingAddress: address
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        showSuccessMessage('Order placed successfully!');
        setShowOrderForm(false);
        setAddress('');
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box className="product-list" sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 6,
          background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
          p: 4,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            background: theme.palette.primary.main,
            width: 56,
            height: 56
          }}>
            <StorefrontIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Products
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={showAddForm ? <CloseIcon /> : <AddIcon />}
          onClick={() => setShowAddForm(!showAddForm)}
          sx={{ 
            minWidth: 160, 
            height: 48, 
            fontWeight: 600,
            borderRadius: 3,
            background: showAddForm 
              ? 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'
              : 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            '&:hover': {
              background: showAddForm
                ? 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)'
                : 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Alert>
      )}

      {showAddForm && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 6, 
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 3
            }}
          >
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price (€)"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  sx={{ 
                    mt: 2,
                    height: 48,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      <Grid container spacing={4}>
        {products.length === 0 ? (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              <Typography 
                variant="h6" 
                color="textSecondary"
                sx={{ fontWeight: 500 }}
              >
                No products available. Add your first product!
              </Typography>
            </Paper>
          </Grid>
        ) : (
          products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative',
                    pt: '60%',
                    background: 'linear-gradient(135deg, #e0e5ec 0%, #f5f7fa 100%)',
                    borderRadius: '16px 16px 0 0'
                  }}
                >
                  <Avatar
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 64,
                      height: 64,
                      background: theme.palette.primary.main
                    }}
                  >
                    <StorefrontIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.text.primary
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Chip 
                    label={`€${parseFloat(product.price).toLocaleString()}`}
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      mb: 2,
                      background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.6,
                      mb: 2
                    }}
                  >
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions 
                  sx={{ 
                    justifyContent: 'space-between',
                    p: 3,
                    pt: 0
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleOrderClick(product)}
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Order
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product._id)}
                    sx={{
                      '&:hover': {
                        background: 'rgba(211, 47, 47, 0.04)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedProduct ? (
            <Checkout 
              product={selectedProduct}
              onCancel={() => {
                setShowOrderForm(false);
                setSelectedProduct(null);
                setError(null);
              }}
              onSuccess={(data) => {
                showSuccessMessage('Order placed successfully!');
                setShowOrderForm(false);
                setSelectedProduct(null);
              }}
            />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2
                }}
              >
                Product not found. The selected product is not available.
              </Alert>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setShowOrderForm(false)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                Return to Products
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductList; 
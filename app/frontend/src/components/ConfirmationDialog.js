import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return '#ff5e62';
      case 'warning':
        return '#ff9966';
      case 'info':
        return '#2193b0';
      default:
        return '#ff9966';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: getSeverityColor() }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderWidth: 2,
            fontWeight: 600,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={severity === 'error' ? 'error' : 'primary'}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            background: severity === 'error'
              ? 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)'
              : 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            '&:hover': {
              background: severity === 'error'
                ? 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'
                : 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 
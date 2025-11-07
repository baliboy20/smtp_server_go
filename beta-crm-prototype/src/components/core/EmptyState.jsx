import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox, Search, AlertCircle } from 'lucide-react';

/**
 * Empty State component for no data scenarios
 * Based on component_specs.md Empty State specification
 */
const EmptyState = ({
  type = 'standard',
  title,
  description,
  actionLabel,
  onAction,
  icon: CustomIcon,
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'search':
        return Search;
      case 'error':
        return AlertCircle;
      default:
        return Inbox;
    }
  };

  const Icon = CustomIcon || getDefaultIcon();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
        px: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon size={32} color="#9CA3AF" />
      </Box>

      <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
        {title || 'No data available'}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', maxWidth: 400 }}>
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

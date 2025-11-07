import React from 'react';
import { Chip } from '@mui/material';

/**
 * Badge component for status, roles, and tags
 * Based on component_specs.md Badge specification
 */
const Badge = ({
  label,
  variant = 'default',
  size = 'medium',
  icon,
  onDelete,
  sx = {},
  ...props
}) => {
  const getVariantStyles = () => {
    const variants = {
      // Status badges
      active: {
        backgroundColor: '#DCFCE7',
        color: '#166534',
        border: '1px solid #BBF7D0',
      },
      inactive: {
        backgroundColor: '#F3F4F6',
        color: '#4B5563',
        border: '1px solid #E5E7EB',
      },
      pending: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #FDE68A',
      },
      // Sentiment badges
      positive: {
        backgroundColor: '#DCFCE7',
        color: '#166534',
        border: '1px solid #BBF7D0',
      },
      neutral: {
        backgroundColor: '#F3F4F6',
        color: '#4B5563',
        border: '1px solid #E5E7EB',
      },
      negative: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #FECACA',
      },
      // Priority badges
      high: {
        backgroundColor: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #FECACA',
      },
      medium: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #FDE68A',
      },
      low: {
        backgroundColor: '#E0E7FF',
        color: '#3730A3',
        border: '1px solid #C7D2FE',
      },
      // Default
      default: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        border: '1px solid #E5E7EB',
      },
      primary: {
        backgroundColor: '#EEF2FF',
        color: '#4338CA',
        border: '1px solid #C7D2FE',
      },
    };
    return variants[variant] || variants.default;
  };

  return (
    <Chip
      label={label}
      icon={icon}
      onDelete={onDelete}
      size={size}
      sx={{
        ...getVariantStyles(),
        fontWeight: 500,
        fontSize: size === 'small' ? '0.6875rem' : '0.75rem',
        height: size === 'small' ? '20px' : '24px',
        ...sx,
      }}
      {...props}
    />
  );
};

export default Badge;

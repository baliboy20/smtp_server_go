import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

/**
 * Search Input component with debounce
 * Based on component_specs.md Search specification
 */
const SearchInput = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  fullWidth = false,
  size = 'medium',
  sx = {},
  ...props
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} color="#9CA3AF" />
          </InputAdornment>
        ),
      }}
      sx={{
        width: fullWidth ? '100%' : 320,
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default SearchInput;

import React from 'react';
import { Box, Typography, IconButton, Badge as MuiBadge } from '@mui/material';
import { Bell, Settings } from 'lucide-react';
import SearchInput from '../core/SearchInput';

/**
 * Top Bar Component
 * Based on wireframes from prototype_ui.md
 */
const TopBar = ({ title, showSearch = true }) => {
  const [hasNotifications] = React.useState(true);

  return (
    <Box
      sx={{
        height: 64,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        px: 4,
        gap: 3,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Page Title */}
      <Typography variant="h2" sx={{ flex: '0 0 auto' }}>
        {title}
      </Typography>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Global Search */}
      {showSearch && (
        <SearchInput
          placeholder="Search clients, contacts..."
          onSearch={(query) => console.log('Global search:', query)}
        />
      )}

      {/* Notifications */}
      <IconButton
        sx={{
          width: 40,
          height: 40,
          color: 'text.secondary',
        }}
      >
        <MuiBadge
          variant="dot"
          color="error"
          invisible={!hasNotifications}
          sx={{
            '& .MuiBadge-dot': {
              width: 8,
              height: 8,
              borderRadius: '50%',
            },
          }}
        >
          <Bell size={20} />
        </MuiBadge>
      </IconButton>

      {/* Settings */}
      <IconButton
        sx={{
          width: 40,
          height: 40,
          color: 'text.secondary',
        }}
      >
        <Settings size={20} />
      </IconButton>
    </Box>
  );
};

export default TopBar;

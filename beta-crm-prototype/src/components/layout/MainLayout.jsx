import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * Main Layout Component
 * Combines Sidebar + TopBar + Content area
 */
const MainLayout = ({ children, title, showSearch = true }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: sidebarCollapsed ? '64px' : '256px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9FAFB',
          transition: 'margin-left 0.2s ease',
        }}
      >
        {/* Top Bar */}
        <TopBar title={title} showSearch={showSearch} />

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;

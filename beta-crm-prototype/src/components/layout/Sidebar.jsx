import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Boxes,
  BarChart3,
  FileText,
  Folder,
  ChevronDown,
} from 'lucide-react';

/**
 * Sidebar Navigation Component
 * Based on wireframes and navigation structure from prototype_ui.md
 */
const Sidebar = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationSections = [
    {
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      ],
    },
    {
      header: 'CLIENT MANAGEMENT',
      items: [
        { label: 'All Clients', icon: Building2, path: '/clients' },
        { label: 'All Contacts', icon: Users, path: '/contacts' },
        { label: 'Departments', icon: Boxes, path: '/departments' },
      ],
    },
    {
      header: 'BUSINESS DEV',
      items: [
        { label: 'Opportunities', icon: BarChart3, path: '/opportunities' },
        { label: 'Proposals', icon: FileText, path: '/proposals' },
      ],
    },
    {
      header: 'CONTENT',
      items: [
        { label: 'Documents', icon: Folder, path: '/documents' },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: collapsed ? 64 : 256,
        height: '100vh',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: 'width 0.2s ease',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        {!collapsed && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4F46E5' }}>
              Beta CRM
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Consultancy Edition
            </Typography>
          </>
        )}
        {collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#4F46E5', textAlign: 'center' }}>
            BC
          </Typography>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
        {navigationSections.map((section, sectionIdx) => (
          <Box key={sectionIdx}>
            {section.header && !collapsed && (
              <Typography
                variant="overline"
                sx={{
                  px: 3,
                  py: 2,
                  display: 'block',
                  color: 'text.secondary',
                }}
              >
                {section.header}
              </Typography>
            )}
            <List sx={{ py: 0 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <ListItem key={item.path} disablePadding sx={{ px: 1.5 }}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        backgroundColor: active ? '#EEF2FF' : 'transparent',
                        color: active ? '#4F46E5' : '#374151',
                        '&:hover': {
                          backgroundColor: active ? '#EEF2FF' : '#F3F4F6',
                        },
                        minHeight: 44, // Touch target
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <Icon size={20} />
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: active ? 600 : 500,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* User Profile */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: '#4F46E5',
              fontSize: '0.875rem',
            }}
          >
            SC
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                Sarah Chen
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                Partner
              </Typography>
            </Box>
          )}
          {!collapsed && <ChevronDown size={16} color="#9CA3AF" />}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

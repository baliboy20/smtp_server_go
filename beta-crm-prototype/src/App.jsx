import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';

// Placeholder pages
const PlaceholderPage = ({ title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: '#4F46E5' }}>{title}</h1>
      <p style={{ color: '#6B7280' }}>This page is coming soon...</p>
    </div>
  </div>
);

/**
 * Main App Component
 * Sets up routing and theme
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Main Application */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Client Management */}
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/:id" element={<ClientDetail />} />

          {/* Placeholder Routes */}
          <Route path="/contacts" element={<PlaceholderPage title="All Contacts" />} />
          <Route path="/departments" element={<PlaceholderPage title="Departments" />} />
          <Route path="/opportunities" element={<PlaceholderPage title="Opportunities" />} />
          <Route path="/proposals" element={<PlaceholderPage title="Proposals" />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

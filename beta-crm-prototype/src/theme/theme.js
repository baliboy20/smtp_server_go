import { createTheme } from '@mui/material/styles';

// Design Tokens from design_system.md
const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',  // Primary brand color
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',  // Success color
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',  // Error color
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',  // Warning color
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  gray: {
    50: '#F9FAFB',   // Background
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',  // Text secondary
    700: '#374151',
    800: '#1F2937',
    900: '#111827',  // Text primary
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[500],
      dark: colors.primary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.gray[600],
      light: colors.gray[500],
      dark: colors.gray[700],
      contrastText: '#FFFFFF',
    },
    success: {
      main: colors.success[600],
      light: colors.success[500],
      dark: colors.success[700],
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error[600],
      light: colors.error[500],
      dark: colors.error[700],
      contrastText: '#FFFFFF',
    },
    warning: {
      main: colors.warning[600],
      light: colors.warning[500],
      dark: colors.warning[700],
      contrastText: '#FFFFFF',
    },
    info: {
      main: colors.primary[600],
      light: colors.primary[500],
      dark: colors.primary[700],
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.gray[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
    },
    divider: colors.gray[200],
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: 14,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2rem',      // 32px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.gray[900],
    },
    h2: {
      fontSize: '1.5rem',    // 24px
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: colors.gray[900],
    },
    h3: {
      fontSize: '1.25rem',   // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.gray[900],
    },
    h4: {
      fontSize: '1.125rem',  // 18px
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.gray[900],
    },
    h5: {
      fontSize: '1rem',      // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.gray[900],
    },
    h6: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.gray[900],
    },
    body1: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      color: colors.gray[900],
    },
    body2: {
      fontSize: '0.75rem',   // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      color: colors.gray[600],
    },
    button: {
      fontSize: '0.875rem',  // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',   // 12px
      fontWeight: 400,
      lineHeight: 1.4,
      color: colors.gray[500],
    },
    overline: {
      fontSize: '0.6875rem', // 11px
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: colors.gray[500],
    },
  },
  spacing: 4, // Base unit: 4px
  shape: {
    borderRadius: 8, // Default border radius: 8px
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        },
        containedPrimary: {
          backgroundColor: colors.primary[600],
          '&:hover': {
            backgroundColor: colors.primary[700],
          },
        },
        outlined: {
          borderColor: colors.gray[300],
          color: colors.gray[700],
          '&:hover': {
            backgroundColor: colors.gray[50],
            borderColor: colors.gray[400],
          },
        },
        text: {
          color: colors.gray[700],
          '&:hover': {
            backgroundColor: colors.gray[100],
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: colors.gray[300],
            },
            '&:hover fieldset': {
              borderColor: colors.gray[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[600],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.gray[200]}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.gray[200]}`,
          padding: '12px 16px',
        },
        head: {
          backgroundColor: colors.gray[50],
          fontWeight: 600,
          color: colors.gray[700],
          textTransform: 'uppercase',
          fontSize: '0.6875rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          color: colors.gray[600],
          '&.Mui-selected': {
            color: colors.primary[600],
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.primary[600],
          height: 3,
        },
      },
    },
  },
});

export default theme;

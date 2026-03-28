export const theme = {
  colors: {
    primary: '#E0E0E0', // Sleek Silver
    primaryDark: '#B0B0B0',
    accent: '#10B981', // Emerald for active states
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    
    background: '#0D0D0D', // Deep charcoal
    surface: '#161616',    // Darker surface
    surfaceLight: '#1E1E1E',
    
    text: '#F5F5F5',
    textSecondary: '#8E8E93',
    textMuted: '#48484A',
    
    border: '#1C1C1E',
    borderLight: '#2C2C2E',
    
    overlay: 'rgba(0, 0, 0, 0.8)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20, // More rounded for modern feel
    xl: 28,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};


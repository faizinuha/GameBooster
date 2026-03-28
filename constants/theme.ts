export const theme = {
  colors: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    
    background: '#0A0A0A',
    surface: '#151515',
    surfaceLight: '#1F1F1F',
    
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textMuted: '#666666',
    
    border: '#2A2A2A',
    borderLight: '#333333',
    
    overlay: 'rgba(0, 0, 0, 0.7)',
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
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

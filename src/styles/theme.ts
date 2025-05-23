export const theme = {
  colors: {
    background: '#0F172A', // Fundo principal do app
    cardBackground: '#1E293B', // Fundos de cards e containers,
    surface: '#1A1A1A',
    textPrimary: '#F8FAFC', // Texto principal, títulos, dados
    textSecondary: '#94A3B8', // Subtítulos, descrições, labels
    primary: '#3B82F6', // Cor de destaque principal (botões, links)
    border: '#334155', // Bordas, linhas divisórias
    error: '#EF4444', // Mensagens de erro, alertas
    error50: 'rgba(239, 68, 68, 0.5)',
    success: '#22C55E', // Status positivos, confirmações
    success50: 'rgba(34, 197, 94, 0.5)',

    // Extras opcionais
    primaryLight: 'rgba(59, 130, 246, 0.2)', // Versão translúcida do azul
    shadow: 'rgba(0, 0, 0, 0.3)', // Sombra padrão
    black50: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    family: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semi: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
      black: 'Inter_900Black',
    },
    sizes: {
      title: 32,
      subtitle: 24,
      section: 20,
      text: 16,
      textSmall: 14,
      label: 12,
      success: 14,
      error: 14,
    },
    lineHeights: {
      title: 44,
      subtitle: 34,
      section: 28,
      text: 24,
      textSmall: 20,
      label: 18,
      success: 20,
      error: 20,
    },
    weight: {
      title: '700',
      subtitle: '600',
      section: '500',
      text: '400',
      textSmall: '400',
      label: '500',
      success: '400',
      error: '400',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 28,
    full: 9999,
  },
  sizes: {
    card: 71,
    loading: {
      lg: {
        width: 200,
        height: 200,
      },
      md: {
        width: 100,
        height: 100,
      },
      sm: {
        width: 50,
        height: 50,
      },
    },
    emptyTransaction: {
      width: 300,
      height: 300,
    },
    errorTransation: {
      width: 250,
      height: 250,
    },
    button: {
      icon: {
        width: 56,
        height: 56,
        minWidth: 56,
      },
    },
  },
};

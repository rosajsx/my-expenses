export const theme = {
  colors: {
    background: '#0F172A', // Fundo principal do app
    cardBackground: '#1E293B', // Fundos de cards e containers
    textPrimary: '#F8FAFC', // Texto principal, títulos, dados
    textSecondary: '#94A3B8', // Subtítulos, descrições, labels
    primary: '#3B82F6', // Cor de destaque principal (botões, links)
    border: '#334155', // Bordas, linhas divisórias
    error: '#EF4444', // Mensagens de erro, alertas
    success: '#22C55E', // Status positivos, confirmações

    // Extras opcionais
    primaryLight: 'rgba(59, 130, 246, 0.2)', // Versão translúcida do azul
    shadow: 'rgba(0, 0, 0, 0.3)', // Sombra padrão
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
    full: 9999,
  },
  sizes: {
    card: 60,
  },
};

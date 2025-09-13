import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar media queries e breakpoints
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Definir o estado inicial
    setMatches(mediaQuery.matches);

    // Função para lidar com mudanças
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adicionar o listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook que fornece breakpoints pré-definidos comuns
 */
export function useMedia() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const isLargeMobile = useMediaQuery('(min-width: 481px) and (max-width: 768px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Breakpoints customizados para o projeto
  const isExtraSmall = useMediaQuery('(max-width: 374px)');
  const isSmall = useMediaQuery('(max-width: 639px)');
  const isMedium = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const isExtraLarge = useMediaQuery('(min-width: 1280px)');

  return {
    // Breakpoints principais
    isMobile,
    isTablet, 
    isDesktop,
    
    // Mobile específico
    isSmallMobile,
    isLargeMobile,
    
    // Orientação
    isLandscape,
    isPortrait,
    
    // Preferências do usuário
    prefersReducedMotion,
    isDarkMode,
    
    // Breakpoints customizados
    isExtraSmall,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    
    // Utility functions
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
    
    // Função para breakpoints customizados
    matches: (query: string) => useMediaQuery(query),
  };
}

/**
 * Hook para detectar largura da tela
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Definir tamanho inicial
    updateSize();

    // Adicionar listener para resize
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return screenSize;
}

/**
 * Breakpoints utilizados no projeto
 */
export const BREAKPOINTS = {
  xs: 374,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Media queries como constantes para reutilização
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.md}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md + 1}px) and (max-width: ${BREAKPOINTS.lg}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg + 1}px)`,
  smallMobile: `(max-width: ${BREAKPOINTS.sm}px)`,
  largeMobile: `(min-width: ${BREAKPOINTS.sm + 1}px) and (max-width: ${BREAKPOINTS.md}px)`,
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
} as const;

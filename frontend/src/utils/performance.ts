import React from 'react';

// Utilitaires de performance pour l'application

// Debounce pour limiter les appels fréquents
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle pour limiter la fréquence d'exécution
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache en mémoire simple avec TTL
class MemoryCache<T = any> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Nettoyer les entrées expirées avant de retourner la taille
    this.cleanup();
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Instance globale du cache
export const globalCache = new MemoryCache();

// Hook pour la mise en cache des données API
export const useCache = <T>(key: string, ttl?: number) => {
  const setCache = (data: T) => {
    globalCache.set(key, data, ttl);
  };

  const getCache = (): T | null => {
    return globalCache.get(key);
  };

  const hasCache = (): boolean => {
    return globalCache.has(key);
  };

  const clearCache = () => {
    globalCache.delete(key);
  };

  return {
    setCache,
    getCache,
    hasCache,
    clearCache
  };
};

// Intersection Observer pour lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, hasIntersected, options]);

  return { isIntersecting, hasIntersected };
};

// Hook pour précharger les images
export const useImagePreloader = (imageSources: string[]) => {
  const [loadedImages, setLoadedImages] = React.useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    imageSources.forEach(src => {
      if (loadedImages.has(src) || failedImages.has(src)) {
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
      };
      
      img.onerror = () => {
        setFailedImages(prev => new Set([...prev, src]));
      };
      
      img.src = src;
    });
  }, [imageSources, loadedImages, failedImages]);

  return {
    loadedImages,
    failedImages,
    isLoaded: (src: string) => loadedImages.has(src),
    hasFailed: (src: string) => failedImages.has(src),
    allLoaded: imageSources.every(src => loadedImages.has(src) || failedImages.has(src))
  };
};

// Virtual scrolling pour grandes listes
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItems = React.useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    ...visibleItems,
    handleScroll
  };
};

// Optimisation des re-renders avec memo profond
export const deepMemo = <T extends Record<string, any>>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => {
  return React.memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
};

// Hook pour detecter si l'utilisateur préfère les animations réduites
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Hook pour mesurer les performances de rendu
export const useRenderTime = (componentName?: string) => {
  const renderStartTime = React.useRef<number>();
  const [renderTime, setRenderTime] = React.useState<number>();

  React.useEffect(() => {
    renderStartTime.current = performance.now();
  });

  React.useEffect(() => {
    if (renderStartTime.current) {
      const time = performance.now() - renderStartTime.current;
      setRenderTime(time);
      
      if (componentName && time > 16) { // > 16ms = problème de performance
        console.warn(`⚠️ Slow render detected in ${componentName}: ${time.toFixed(2)}ms`);
      }
    }
  });

  return renderTime;
};

// Gestionnaire de requêtes avec retry automatique
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Backoff exponentiel
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Batch des opérations pour réduire les re-renders
export const useBatchedUpdates = () => {
  const pendingUpdates = React.useRef<(() => void)[]>([]);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const batchUpdate = React.useCallback((updateFn: () => void) => {
    pendingUpdates.current.push(updateFn);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      React.unstable_batchedUpdates(() => {
        pendingUpdates.current.forEach(fn => fn());
        pendingUpdates.current = [];
      });
    }, 0);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return batchUpdate;
};

// Utilitaire pour mesurer la taille des bundles en développement
export const measureBundleSize = () => {
  if (!import.meta.env.DEV) return;

  try {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;

    Promise.all(
      scripts.map(async (script) => {
        const src = (script as HTMLScriptElement).src;
        if (src.includes('localhost') || src.includes('127.0.0.1')) {
          try {
            const response = await fetch(src, { method: 'HEAD' });
            const size = parseInt(response.headers.get('content-length') || '0');
            totalSize += size;
            return { src, size };
          } catch (error) {
            return { src, size: 0 };
          }
        }
        return { src, size: 0 };
      })
    ).then((results) => {
      console.group('📦 Bundle Size Analysis');
      results.forEach(({ src, size }) => {
        if (size > 0) {
          console.log(`${src.split('/').pop()}: ${(size / 1024).toFixed(2)}KB`);
        }
      });
      console.log(`📊 Total: ${(totalSize / 1024).toFixed(2)}KB`);
      console.groupEnd();
    }).catch(() => {
      console.log('📦 Bundle analysis not available');
    });
  } catch (error) {
    console.log('📦 Bundle analysis disabled');
  }
};

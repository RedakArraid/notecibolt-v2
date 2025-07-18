// Cache global simple pour optimiser les performances des API calls
class Cache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut

  // Obtenir une valeur du cache
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Vérifier si l'item a expiré
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Définir une valeur dans le cache
  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  // Supprimer une valeur du cache
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Vider tout le cache
  clear(): void {
    this.cache.clear();
  }

  // Invalider les clés correspondant à un pattern
  invalidateByPattern(patterns: string[]): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      for (const pattern of patterns) {
        if (key.includes(pattern)) {
          keysToDelete.push(key);
          break;
        }
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Obtenir la taille du cache
  size(): number {
    return this.cache.size;
  }

  // Obtenir les statistiques du cache
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Nettoyer les entrées expirées
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Instance globale du cache
export const globalCache = new Cache();

// Nettoyer automatiquement le cache toutes les 10 minutes
setInterval(() => {
  globalCache.cleanup();
}, 10 * 60 * 1000);

// Utilitaires de cache pour les hooks
export const useCacheKey = (prefix: string, params: Record<string, any> = {}): string => {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return paramString ? `${prefix}_${paramString}` : prefix;
};

// Hook pour déboucer les requêtes
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Hook pour limiter la fréquence des appels
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

export default globalCache;

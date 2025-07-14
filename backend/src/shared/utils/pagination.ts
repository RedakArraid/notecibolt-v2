import { PaginationParams, PaginationInfo } from '../types';

/**
 * Calculer les informations de pagination
 */
export const calculatePagination = (
  total: number,
  page: number = 1,
  limit: number = 10
): PaginationInfo => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev
  };
};

/**
 * Calculer le offset pour Prisma
 */
export const calculateOffset = (page: number = 1, limit: number = 10): number => {
  return (page - 1) * limit;
};

/**
 * Valider les paramètres de pagination
 */
export const validatePaginationParams = (params: PaginationParams): PaginationParams => {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const sortOrder = ['asc', 'desc'].includes(params.sortOrder || '') ? params.sortOrder : 'asc';

  return {
    page,
    limit,
    sortBy: params.sortBy,
    sortOrder: sortOrder as 'asc' | 'desc'
  };
};

/**
 * Formater une réponse avec pagination
 */
export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  params: PaginationParams,
  message?: string
) => {
  const validatedParams = validatePaginationParams(params);
  const pagination = calculatePagination(total, validatedParams.page, validatedParams.limit);

  return {
    success: true,
    message: message || 'Données récupérées avec succès',
    data,
    pagination
  };
};

/**
 * Construire les options de tri pour Prisma
 */
export const buildSortOptions = (sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') => {
  if (!sortBy) return undefined;

  return {
    [sortBy]: sortOrder
  };
};

/**
 * Construire les options de recherche pour Prisma
 */
export const buildSearchOptions = (searchTerm?: string, searchFields: string[] = []) => {
  if (!searchTerm || searchFields.length === 0) return undefined;

  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const
      }
    }))
  };
};

/**
 * Construire les filtres pour Prisma
 */
export const buildFilters = (filters: Record<string, any> = {}) => {
  const prismaFilters: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Gestion des différents types de filtres
      if (Array.isArray(value)) {
        prismaFilters[key] = { in: value };
      } else if (typeof value === 'object' && value.from && value.to) {
        // Filtre de plage de dates
        prismaFilters[key] = {
          gte: new Date(value.from),
          lte: new Date(value.to)
        };
      } else if (typeof value === 'string' && value.includes(',')) {
        // Valeurs multiples séparées par des virgules
        prismaFilters[key] = { in: value.split(',') };
      } else {
        prismaFilters[key] = value;
      }
    }
  });

  return Object.keys(prismaFilters).length > 0 ? prismaFilters : undefined;
};

/**
 * Construire une requête Prisma complète avec pagination, tri et filtres
 */
export const buildPrismaQuery = (
  params: PaginationParams & { searchTerm?: string; filters?: Record<string, any> },
  searchFields: string[] = []
) => {
  const validatedParams = validatePaginationParams(params);
  const { page, limit, sortBy, sortOrder } = validatedParams;

  const query: any = {
    skip: calculateOffset(page, limit),
    take: limit
  };

  // Ajouter le tri
  const sortOptions = buildSortOptions(sortBy, sortOrder);
  if (sortOptions) {
    query.orderBy = sortOptions;
  }

  // Construire les conditions WHERE
  const whereConditions: any[] = [];

  // Ajouter la recherche
  const searchOptions = buildSearchOptions(params.searchTerm, searchFields);
  if (searchOptions) {
    whereConditions.push(searchOptions);
  }

  // Ajouter les filtres
  const filterOptions = buildFilters(params.filters);
  if (filterOptions) {
    whereConditions.push(filterOptions);
  }

  // Combiner les conditions WHERE
  if (whereConditions.length > 0) {
    query.where = whereConditions.length === 1 ? whereConditions[0] : { AND: whereConditions };
  }

  return query;
};

/**
 * Extraire les paramètres de pagination depuis les query parameters
 */
export const extractPaginationFromQuery = (query: any): PaginationParams => {
  return {
    page: query.page ? parseInt(query.page, 10) : 1,
    limit: query.limit ? parseInt(query.limit, 10) : 10,
    sortBy: query.sortBy || undefined,
    sortOrder: query.sortOrder === 'desc' ? 'desc' : 'asc'
  };
};

/**
 * Extraire les paramètres de recherche depuis les query parameters
 */
export const extractSearchFromQuery = (query: any) => {
  return {
    searchTerm: query.q || query.search || undefined,
    filters: query.filters ? (typeof query.filters === 'string' ? JSON.parse(query.filters) : query.filters) : {}
  };
};

import { format, parseISO, isValid, startOfDay, endOfDay, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date en français
 */
export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr, { locale: fr });
};

/**
 * Formater une date avec l'heure
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy à HH:mm');
};

/**
 * Formater une heure
 */
export const formatTime = (date: Date | string): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Formater une date relative (il y a X jours)
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  
  return formatDate(dateObj);
};

/**
 * Obtenir le début et la fin d'une journée
 */
export const getDayRange = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfDay(dateObj),
    end: endOfDay(dateObj)
  };
};

/**
 * Obtenir le début et la fin d'une semaine
 */
export const getWeekRange = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfWeek(dateObj, { weekStartsOn: 1 }), // Lundi
    end: endOfWeek(dateObj, { weekStartsOn: 1 })
  };
};

/**
 * Obtenir le début et la fin d'un mois
 */
export const getMonthRange = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj)
  };
};

/**
 * Obtenir une plage de dates prédéfinie
 */
export const getDateRange = (period: 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'last_7_days' | 'last_30_days') => {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return getDayRange(now);
    
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return getDayRange(yesterday);
    
    case 'this_week':
      return getWeekRange(now);
    
    case 'last_week':
      const lastWeek = subDays(now, 7);
      return getWeekRange(lastWeek);
    
    case 'this_month':
      return getMonthRange(now);
    
    case 'last_month':
      const lastMonth = subDays(startOfMonth(now), 1);
      return getMonthRange(lastMonth);
    
    case 'last_7_days':
      return {
        start: startOfDay(subDays(now, 6)),
        end: endOfDay(now)
      };
    
    case 'last_30_days':
      return {
        start: startOfDay(subDays(now, 29)),
        end: endOfDay(now)
      };
    
    default:
      return getDayRange(now);
  }
};

/**
 * Valider si une chaîne est une date valide
 */
export const isValidDateString = (dateString: string): boolean => {
  return isValid(parseISO(dateString));
};

/**
 * Convertir une chaîne en Date
 */
export const parseDate = (dateString: string): Date | null => {
  const date = parseISO(dateString);
  return isValid(date) ? date : null;
};

/**
 * Calculer l'âge à partir d'une date de naissance
 */
export const calculateAge = (birthDate: Date | string): number => {
  const birthDateObj = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(birthDateObj)) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Obtenir le nom du jour de la semaine
 */
export const getDayName = (date: Date | string, short: boolean = false): string => {
  const formatStr = short ? 'EEEEEE' : 'EEEE';
  return formatDate(date, formatStr);
};

/**
 * Obtenir le nom du mois
 */
export const getMonthName = (date: Date | string, short: boolean = false): string => {
  const formatStr = short ? 'MMM' : 'MMMM';
  return formatDate(date, formatStr);
};

/**
 * Vérifier si une date est dans le futur
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj > new Date();
};

/**
 * Vérifier si une date est dans le passé
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) && dateObj < new Date();
};

/**
 * Vérifier si une date est aujourd'hui
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Obtenir le prochain jour ouvrable
 */
export const getNextWorkingDay = (date: Date | string): Date => {
  let nextDay = addDays(typeof date === 'string' ? parseISO(date) : date, 1);
  
  // Si c'est samedi (6) ou dimanche (0), aller au lundi suivant
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay = addDays(nextDay, 1);
  }
  
  return nextDay;
};

/**
 * Formater une durée en heures et minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${remainingMinutes}min`;
  }
};

/**
 * Convertir une heure au format HH:MM en minutes depuis minuit
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convertir des minutes depuis minuit en heure au format HH:MM
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Générer une liste de dates entre deux dates
 */
export const getDatesBetween = (startDate: Date | string, endDate: Date | string): Date[] => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  const dates: Date[] = [];
  let currentDate = start;
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

/**
 * Formater une date pour l'API (ISO string)
 */
export const formatForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
};

/**
 * Formater une date pour l'affichage selon le contexte
 */
export const formatForDisplay = (
  date: Date | string, 
  context: 'short' | 'long' | 'time' | 'datetime' | 'relative' = 'short'
): string => {
  switch (context) {
    case 'short':
      return formatDate(date, 'dd/MM/yyyy');
    case 'long':
      return formatDate(date, 'EEEE dd MMMM yyyy');
    case 'time':
      return formatTime(date);
    case 'datetime':
      return formatDateTime(date);
    case 'relative':
      return formatRelativeDate(date);
    default:
      return formatDate(date);
  }
};

import { ClassroomType, ClassroomInfo, ChildRecord } from '../types';

/**
 * Calculates the child's age on December 31st of the specified year (defaults to current year).
 * E.g., if born in 2020 and reference year is 2026, age on Dec 31 2026 is 2026 - 2020 = 6 years.
 */
export function calculateAgeAtDec31(birthDateStr: string, targetYear?: number): number {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return 0;
  
  const year = targetYear || new Date().getFullYear();
  const birthYear = birthDate.getFullYear();
  
  return Math.max(0, year - birthYear);
}

/**
 * Calculates current actual age in years
 */
export function calculateCurrentAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Assigns classroom based on official church age rules:
 * - Visionarios: 3, 4 o 5 años al 31 de diciembre
 * - Exploradores: 6, 7 u 8 años al 31 de diciembre
 * - Conquistadores: 9 a 13 años al 31 de diciembre
 * - Semillitas: Menores de 3 años
 * - Transición: Mayores de 13 años
 */
export function assignClassroom(ageAtDec31: number): ClassroomType {
  if (ageAtDec31 >= 3 && ageAtDec31 <= 5) {
    return 'Visionarios';
  } else if (ageAtDec31 >= 6 && ageAtDec31 <= 8) {
    return 'Exploradores';
  } else if (ageAtDec31 >= 9 && ageAtDec31 <= 13) {
    return 'Conquistadores';
  } else if (ageAtDec31 < 3) {
    return 'Semillitas';
  } else {
    return 'Transición';
  }
}

export const CLASSROOM_DETAILS: Record<ClassroomType, ClassroomInfo> = {
  Visionarios: {
    name: 'Visionarios',
    ageRange: '3 a 5 años',
    description: 'Niños que tienen o cumplen 3, 4 o 5 años al 31 de diciembre',
    minAge: 3,
    maxAge: 5,
    colorTheme: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-900',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      accent: '#0284c7', // Sky 600
      lightBg: '#f0f9ff'
    }
  },
  Exploradores: {
    name: 'Exploradores',
    ageRange: '6 a 8 años',
    description: 'Niños que tienen o cumplen 6, 7 u 8 años al 31 de diciembre',
    minAge: 6,
    maxAge: 8,
    colorTheme: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      accent: '#2563eb', // Blue 600
      lightBg: '#eff6ff'
    }
  },
  Conquistadores: {
    name: 'Conquistadores',
    ageRange: '9 a 13 años',
    description: 'Niños que tienen o cumplen de 9 a 13 años al 31 de diciembre',
    minAge: 9,
    maxAge: 13,
    colorTheme: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      text: 'text-indigo-900',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      accent: '#4f46e5', // Indigo 600
      lightBg: '#eef2ff'
    }
  },
  Semillitas: {
    name: 'Semillitas',
    ageRange: 'Menores de 3 años',
    description: 'Bebés y párvulos menores de 3 años al 31 de diciembre',
    minAge: 0,
    maxAge: 2,
    colorTheme: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      accent: '#d97706',
      lightBg: '#fffbeb'
    }
  },
  Transición: {
    name: 'Transición',
    ageRange: 'Mayores de 13 años',
    description: 'Adolescentes en etapa de transición a ministerio juvenil',
    minAge: 14,
    maxAge: 17,
    colorTheme: {
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      text: 'text-slate-900',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-800',
      accent: '#475569',
      lightBg: '#f8fafc'
    }
  }
};

export function formatDateTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

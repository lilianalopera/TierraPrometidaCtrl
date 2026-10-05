import { ChildRecord } from '../types';
import { INITIAL_CHILDREN } from '../data/initialData';

const STORAGE_KEY = 'tierra_prometida_children_v1';
const TEACHER_PASSWORD_KEY = 'tierra_prometida_teacher_pw';
const DEFAULT_PASSWORD = 'fe y fuego';

export const storageService = {
  getChildren(): ChildRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHILDREN));
        return INITIAL_CHILDREN;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading children from storage:', e);
      return INITIAL_CHILDREN;
    }
  },

  saveChildren(children: ChildRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
    } catch (e) {
      console.error('Error saving children to storage:', e);
    }
  },

  addChild(newChild: ChildRecord): ChildRecord[] {
    const list = this.getChildren();
    const updated = [newChild, ...list];
    this.saveChildren(updated);
    return updated;
  },

  updateChild(updatedChild: ChildRecord): ChildRecord[] {
    const list = this.getChildren();
    const updated = list.map((c) => (c.id === updatedChild.id ? updatedChild : c));
    this.saveChildren(updated);
    return updated;
  },

  deleteChild(id: string): ChildRecord[] {
    const list = this.getChildren();
    const updated = list.filter((c) => c.id !== id);
    this.saveChildren(updated);
    return updated;
  },

  toggleAttendance(id: string): ChildRecord[] {
    const list = this.getChildren();
    const updated = list.map((c) => {
      if (c.id === id) {
        const nextState = !c.checkedInToday;
        return {
          ...c,
          checkedInToday: nextState,
          checkedInAt: nextState ? new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      }
      return c;
    });
    this.saveChildren(updated);
    return updated;
  },

  resetToDefault(): ChildRecord[] {
    this.saveChildren(INITIAL_CHILDREN);
    return INITIAL_CHILDREN;
  },

  getTeacherPassword(): string {
    return localStorage.getItem(TEACHER_PASSWORD_KEY) || DEFAULT_PASSWORD;
  },

  setTeacherPassword(pw: string): void {
    localStorage.setItem(TEACHER_PASSWORD_KEY, pw);
  },

  generateNextRegistrationNumber(): string {
    const list = this.getChildren();
    const year = new Date().getFullYear();
    const maxNum = list.reduce((acc, c) => {
      const match = c.registrationNumber?.match(/TP-\d{4}-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const next = (maxNum + 1).toString().padStart(3, '0');
    return `TP-${year}-${next}`;
  },

  exportToCSV(children: ChildRecord[]): void {
    const headers = [
      'N° Registro',
      'Nombre Completo',
      'Fecha Nacimiento',
      'Edad Dic 31',
      'Salón',
      'Madre',
      'Teléfono Madre',
      'Padre',
      'Teléfono Padre',
      'Adulto Responsable en Iglesia',
      'Quien Autoriza',
      'Documento Acudiente',
      'Teléfono Acudiente',
      'Fecha Consentimiento',
      'Asistencia Hoy',
      'Alergias/Condiciones',
      'EPS'
    ];

    const rows = children.map((c) => [
      `"${c.registrationNumber || ''}"`,
      `"${c.fullName || ''}"`,
      `"${c.birthDate || ''}"`,
      `"${c.ageAtDec31 || 0}"`,
      `"${c.classroom || ''}"`,
      `"${c.motherName || ''}"`,
      `"${c.motherPhone || ''}"`,
      `"${c.fatherName || ''}"`,
      `"${c.fatherPhone || ''}"`,
      `"${c.churchResponsibleAdult || ''}"`,
      `"${c.authorizerName || ''} (${c.authorizerRelationship || ''})"`,
      `"${c.authorizerIdNumber || ''}"`,
      `"${c.authorizerPhone || ''}"`,
      `"${c.consentTimestamp || ''}"`,
      `"${c.checkedInToday ? 'PRESENTE' : 'AUSENTE'}"`,
      `"${c.allergiesOrMedicalConditions || 'Ninguna'}"`,
      `"${c.eps || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Listado_Ninos_Tierra_Prometida_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

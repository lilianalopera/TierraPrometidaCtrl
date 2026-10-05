export type ClassroomType = 'Visionarios' | 'Exploradores' | 'Conquistadores' | 'Semillitas' | 'Transición';

export interface ChildRecord {
  id: string;
  registrationNumber: string; // e.g. TP-2026-001
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  ageAtDec31: number;
  currentAge: number;
  classroom: ClassroomType;
  
  // Parents info
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  churchResponsibleAdult: string; // Adulto responsable en la iglesia
  
  // Consent & Authorization
  authorizerName: string;
  authorizerRelationship: 'Madre' | 'Padre' | 'Tutor legal' | 'Acudiente';
  authorizerIdNumber: string; // Documento de Id
  authorizerPhone: string;
  consentAccepted: boolean;
  consentTimestamp: string; // DD/MM/YYYY HH:mm:ss
  
  // Additional practical church details
  allergiesOrMedicalConditions?: string;
  eps?: string;
  notes?: string;
  
  // Sunday Attendance tracking
  checkedInToday?: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface AttendanceLogRecord {
  id: string;
  childId: string;
  childName: string;
  classroom: ClassroomType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  serviceName: string;
  pickupPerson: string;
  notes?: string;
}

export interface ClassroomInfo {
  name: ClassroomType;
  ageRange: string;
  description: string;
  minAge: number;
  maxAge: number;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    lightBg: string;
  };
}

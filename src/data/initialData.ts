import { ChildRecord } from '../types';
import { assignClassroom, calculateAgeAtDec31, calculateCurrentAge } from '../utils/classroom';

const createChild = (data: {
  id: string;
  registrationNumber: string;
  fullName: string;
  birthDate: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  churchResponsibleAdult: string;
  authorizerName: string;
  authorizerRelationship: 'Madre' | 'Padre' | 'Tutor legal' | 'Acudiente';
  authorizerIdNumber: string;
  authorizerPhone: string;
  consentTimestamp: string;
  allergiesOrMedicalConditions?: string;
  eps?: string;
  notes?: string;
  checkedInToday?: boolean;
}): ChildRecord => {
  const ageAtDec31 = calculateAgeAtDec31(data.birthDate);
  const currentAge = calculateCurrentAge(data.birthDate);
  const classroom = assignClassroom(ageAtDec31);

  return {
    ...data,
    ageAtDec31,
    currentAge,
    classroom,
    consentAccepted: true,
    createdAt: data.consentTimestamp,
  };
};

export const INITIAL_CHILDREN: ChildRecord[] = [
  // Child corresponding to the user's uploaded consent PDF
  createChild({
    id: 'tp-seed-1',
    registrationNumber: 'TP-2026-001',
    fullName: 'Mateo Alejandro Gómez Lopera',
    birthDate: '2021-04-15', // Age at Dec 31 2026: 5 (Visionarios)
    fatherName: 'Carlos Gómez Martínez',
    fatherPhone: '3012547890',
    motherName: 'Liliana Lopera',
    motherPhone: '3043636887',
    churchResponsibleAdult: 'Liliana Lopera (Madre)',
    authorizerName: 'Liliana Lopera',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '43870046',
    authorizerPhone: '3043636887',
    consentTimestamp: '12/06/2026 20:37:29',
    allergiesOrMedicalConditions: 'Ninguna conocida',
    eps: 'Sura',
    notes: 'Hermano mayor en Exploradores',
    checkedInToday: true,
  }),
  // Visionarios (3-5 years)
  createChild({
    id: 'tp-seed-2',
    registrationNumber: 'TP-2026-002',
    fullName: 'Sofía Victoria Morales Ramos',
    birthDate: '2022-08-20', // Age at Dec 31: 4 (Visionarios)
    fatherName: 'Andrés Morales',
    fatherPhone: '3104561234',
    motherName: 'Victoria Ramos de Morales',
    motherPhone: '3117894561',
    churchResponsibleAdult: 'Victoria Ramos de Morales',
    authorizerName: 'Victoria Ramos de Morales',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '32849102',
    authorizerPhone: '3117894561',
    consentTimestamp: '10/05/2026 09:14:02',
    allergiesOrMedicalConditions: 'Intolerancia leve a la lactosa',
    eps: 'Sanitas',
    checkedInToday: true,
  }),
  createChild({
    id: 'tp-seed-3',
    registrationNumber: 'TP-2026-003',
    fullName: 'David Emmanuel Castillo Torres',
    birthDate: '2023-01-10', // Age at Dec 31: 3 (Visionarios)
    fatherName: 'Julián Castillo',
    fatherPhone: '3159873210',
    motherName: 'Andrea Torres',
    motherPhone: '3206549870',
    churchResponsibleAdult: 'Julián Castillo (Padre)',
    authorizerName: 'Julián Castillo',
    authorizerRelationship: 'Padre',
    authorizerIdNumber: '72194850',
    authorizerPhone: '3159873210',
    consentTimestamp: '14/05/2026 18:22:45',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Nueva EPS',
    checkedInToday: false,
  }),
  createChild({
    id: 'tp-seed-4',
    registrationNumber: 'TP-2026-004',
    fullName: 'Sara Isabella Mendoza Polo',
    birthDate: '2021-11-03', // Age at Dec 31: 5 (Visionarios)
    fatherName: 'Ricardo Mendoza',
    fatherPhone: '3001239874',
    motherName: 'Paola Polo',
    motherPhone: '3023456789',
    churchResponsibleAdult: 'Paola Polo',
    authorizerName: 'Paola Polo',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '55403928',
    authorizerPhone: '3023456789',
    consentTimestamp: '18/05/2026 11:05:10',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Coosalud',
    checkedInToday: true,
  }),

  // Exploradores (6-8 years)
  createChild({
    id: 'tp-seed-5',
    registrationNumber: 'TP-2026-005',
    fullName: 'Lucas Gabriel Gómez Lopera',
    birthDate: '2019-03-24', // Age at Dec 31: 7 (Exploradores)
    fatherName: 'Carlos Gómez Martínez',
    fatherPhone: '3012547890',
    motherName: 'Liliana Lopera',
    motherPhone: '3043636887',
    churchResponsibleAdult: 'Liliana Lopera',
    authorizerName: 'Liliana Lopera',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '43870046',
    authorizerPhone: '3043636887',
    consentTimestamp: '12/06/2026 20:30:11',
    allergiesOrMedicalConditions: 'Alergia a mariscos y frutos secos',
    eps: 'Sura',
    checkedInToday: true,
  }),
  createChild({
    id: 'tp-seed-6',
    registrationNumber: 'TP-2026-006',
    fullName: 'Valeria Esther Narváez Cruz',
    birthDate: '2020-07-18', // Age at Dec 31: 6 (Exploradores)
    fatherName: 'Héctor Narváez',
    fatherPhone: '3048901234',
    motherName: 'Claudia Cruz',
    motherPhone: '3187654321',
    churchResponsibleAdult: 'Abuela María Mercedes Cruz',
    authorizerName: 'Claudia Cruz',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '45892103',
    authorizerPhone: '3187654321',
    consentTimestamp: '20/05/2026 16:40:00',
    allergiesOrMedicalConditions: 'Usa inhalador para asma leve',
    eps: 'Compensar / Sura',
    checkedInToday: false,
  }),
  createChild({
    id: 'tp-seed-7',
    registrationNumber: 'TP-2026-007',
    fullName: 'Samuel Esteban Ruiz Quintero',
    birthDate: '2018-09-30', // Age at Dec 31: 8 (Exploradores)
    fatherName: 'Fernando Ruiz',
    fatherPhone: '3015551212',
    motherName: 'Gloria Quintero',
    motherPhone: '3015551313',
    churchResponsibleAdult: 'Fernando Ruiz',
    authorizerName: 'Fernando Ruiz',
    authorizerRelationship: 'Padre',
    authorizerIdNumber: '85203941',
    authorizerPhone: '3015551212',
    consentTimestamp: '22/05/2026 10:15:30',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Famisanar',
    checkedInToday: true,
  }),
  createChild({
    id: 'tp-seed-8',
    registrationNumber: 'TP-2026-008',
    fullName: 'Hannah Camila Berrio Solano',
    birthDate: '2019-12-14', // Age at Dec 31: 7 (Exploradores)
    fatherName: 'Marcos Berrio',
    fatherPhone: '3142223344',
    motherName: 'Diana Solano',
    motherPhone: '3145556677',
    churchResponsibleAdult: 'Diana Solano (Madre)',
    authorizerName: 'Diana Solano',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '39485721',
    authorizerPhone: '3145556677',
    consentTimestamp: '25/05/2026 14:08:19',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Salud Total',
    checkedInToday: true,
  }),

  // Conquistadores (9-13 years)
  createChild({
    id: 'tp-seed-9',
    registrationNumber: 'TP-2026-009',
    fullName: 'Daniel Josué Paternina Gil',
    birthDate: '2015-05-12', // Age at Dec 31: 11 (Conquistadores)
    fatherName: 'Josué Paternina',
    fatherPhone: '3007654321',
    motherName: 'Luz Karime Gil',
    motherPhone: '3019876543',
    churchResponsibleAdult: 'Josué Paternina',
    authorizerName: 'Josué Paternina',
    authorizerRelationship: 'Padre',
    authorizerIdNumber: '73592810',
    authorizerPhone: '3007654321',
    consentTimestamp: '01/06/2026 08:30:00',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Sura',
    notes: 'Toca la guitarra en el grupo infantil de alabanza',
    checkedInToday: true,
  }),
  createChild({
    id: 'tp-seed-10',
    registrationNumber: 'TP-2026-010',
    fullName: 'María José Flórez Vergara',
    birthDate: '2016-11-28', // Age at Dec 31: 10 (Conquistadores)
    fatherName: 'Mauricio Flórez',
    fatherPhone: '3167778899',
    motherName: 'Yolanda Vergara',
    motherPhone: '3161112233',
    churchResponsibleAdult: 'Yolanda Vergara',
    authorizerName: 'Yolanda Vergara',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '50982341',
    authorizerPhone: '3161112233',
    consentTimestamp: '03/06/2026 15:45:10',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Sanitas',
    checkedInToday: true,
  }),
  createChild({
    id: 'tp-seed-11',
    registrationNumber: 'TP-2026-011',
    fullName: 'Jerónimo Benítez Arrieta',
    birthDate: '2014-02-17', // Age at Dec 31: 12 (Conquistadores)
    fatherName: 'Raúl Benítez',
    fatherPhone: '3052345678',
    motherName: 'Patricia Arrieta',
    motherPhone: '3058765432',
    churchResponsibleAdult: 'Patricia Arrieta',
    authorizerName: 'Patricia Arrieta',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '41920384',
    authorizerPhone: '3058765432',
    consentTimestamp: '05/06/2026 19:12:44',
    allergiesOrMedicalConditions: 'Ninguna',
    eps: 'Nueva EPS',
    checkedInToday: false,
  }),
  createChild({
    id: 'tp-seed-12',
    registrationNumber: 'TP-2026-012',
    fullName: 'Gabriela Paz Silva',
    birthDate: '2013-09-08', // Age at Dec 31: 13 (Conquistadores)
    fatherName: 'Edgar Silva',
    fatherPhone: '3134567890',
    motherName: 'Marcela Paz',
    motherPhone: '3139876543',
    churchResponsibleAdult: 'Tía Carolina Paz',
    authorizerName: 'Marcela Paz',
    authorizerRelationship: 'Madre',
    authorizerIdNumber: '37894561',
    authorizerPhone: '3139876543',
    consentTimestamp: '08/06/2026 12:20:15',
    allergiesOrMedicalConditions: 'Alergia al polen',
    eps: 'Sura',
    notes: 'Próxima a graduarse hacia jóvenes a fin de año',
    checkedInToday: true,
  }),
];

import React, { useState, useId } from 'react';
import { ChildRecord, ClassroomType } from '../types';
import {
  assignClassroom,
  calculateAgeAtDec31,
  calculateCurrentAge,
  CLASSROOM_DETAILS,
  formatDateTime,
} from '../utils/classroom';
import { generateConsentPDF } from '../utils/pdfGenerator';
import { Logo } from './Logo';
import {
  FileText,
  Download,
  CheckCircle,
  Eye,
  AlertCircle,
  Info,
  Calendar,
  Phone,
  Shield,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';

interface RegistrationFormProps {
  onRegisterChild: (child: ChildRecord) => void;
  onOpenConsentModal: (childData: Partial<ChildRecord>) => void;
  nextRegNumber: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onRegisterChild,
  onOpenConsentModal,
  nextRegNumber,
}) => {
  const currentYear = new Date().getFullYear();

  // Child data state
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [churchResponsibleAdult, setChurchResponsibleAdult] = useState('');

  // Authorizer data state
  const [authorizerRole, setAuthorizerRole] = useState<'Madre' | 'Padre' | 'Tutor legal' | 'Acudiente'>('Madre');
  const [customAuthorizerName, setCustomAuthorizerName] = useState('');
  const [customAuthorizerPhone, setCustomAuthorizerPhone] = useState('');
  const [authorizerIdNumber, setAuthorizerIdNumber] = useState('');

  // Health and medical (bonus practical field)
  const [allergies, setAllergies] = useState('');
  const [eps, setEps] = useState('');

  // Consent checkbox
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success state
  const [registeredChild, setRegisteredChild] = useState<ChildRecord | null>(null);

  // Derived calculations
  const ageAtDec31 = birthDate ? calculateAgeAtDec31(birthDate, currentYear) : 0;
  const currentAge = birthDate ? calculateCurrentAge(birthDate) : 0;
  const assignedClassroom: ClassroomType = birthDate ? assignClassroom(ageAtDec31) : 'Visionarios';
  const classroomInfo = CLASSROOM_DETAILS[assignedClassroom];

  // Resolve authorizer name & phone based on role selector
  const resolvedAuthorizerName =
    authorizerRole === 'Madre'
      ? motherName
      : authorizerRole === 'Padre'
      ? fatherName
      : customAuthorizerName;

  const resolvedAuthorizerPhone =
    authorizerRole === 'Madre'
      ? motherPhone
      : authorizerRole === 'Padre'
      ? fatherPhone
      : customAuthorizerPhone;

  // Build current draft object for preview and PDF export
  const getDraftChild = (): Partial<ChildRecord> => {
    return {
      registrationNumber: nextRegNumber,
      fullName: fullName || 'Nombre del Menor',
      birthDate: birthDate || '2021-01-01',
      ageAtDec31,
      currentAge,
      classroom: assignedClassroom,
      fatherName,
      fatherPhone,
      motherName,
      motherPhone,
      churchResponsibleAdult: churchResponsibleAdult || resolvedAuthorizerName || 'Responsable de entrega',
      authorizerName: resolvedAuthorizerName || 'Nombre del acudiente',
      authorizerRelationship: authorizerRole,
      authorizerIdNumber: authorizerIdNumber || '00000000',
      authorizerPhone: resolvedAuthorizerPhone || '0000000000',
      consentTimestamp: formatDateTime(),
      allergiesOrMedicalConditions: allergies,
      eps,
    };
  };

  const handleDownloadDraftPDF = () => {
    if (!fullName.trim()) {
      setFormError('Por favor ingrese al menos el nombre del niño para generar el documento de consentimiento.');
      return;
    }
    setFormError(null);
    const draft = getDraftChild() as ChildRecord;
    generateConsentPDF(draft, true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setFormError('Por favor complete el nombre completo del niño.');
      return;
    }

    if (!birthDate) {
      setFormError('Por favor seleccione la fecha de nacimiento del niño.');
      return;
    }

    if (!fatherName.trim() && !motherName.trim()) {
      setFormError('Por favor ingrese el nombre de al menos uno de los padres (Madre o Padre).');
      return;
    }

    if (!resolvedAuthorizerName.trim()) {
      setFormError('Por favor ingrese el nombre de la persona que autoriza.');
      return;
    }

    if (!authorizerIdNumber.trim()) {
      setFormError('Por favor ingrese el documento de identidad de quien autoriza para la validez legal del consentimiento.');
      return;
    }

    if (!churchResponsibleAdult.trim()) {
      setFormError('Por favor indique el nombre del adulto responsable en la iglesia (quien entrega o recoge al niño).');
      return;
    }

    if (!consentAccepted) {
      setFormError('Debe marcar la casilla de aceptación obligatoria de los términos de consentimiento informado.');
      return;
    }

    setFormError(null);

    const newRecord: ChildRecord = {
      id: `child-${Date.now()}`,
      registrationNumber: nextRegNumber,
      fullName: fullName.trim(),
      birthDate,
      ageAtDec31,
      currentAge,
      classroom: assignedClassroom,
      fatherName: fatherName.trim(),
      fatherPhone: fatherPhone.trim(),
      motherName: motherName.trim(),
      motherPhone: motherPhone.trim(),
      churchResponsibleAdult: churchResponsibleAdult.trim(),
      authorizerName: resolvedAuthorizerName.trim(),
      authorizerRelationship: authorizerRole,
      authorizerIdNumber: authorizerIdNumber.trim(),
      authorizerPhone: (resolvedAuthorizerPhone || motherPhone || fatherPhone).trim(),
      consentAccepted: true,
      consentTimestamp: formatDateTime(),
      allergiesOrMedicalConditions: allergies.trim() || 'Ninguna reportada',
      eps: eps.trim() || 'No especificada',
      createdAt: formatDateTime(),
      checkedInToday: true,
      checkedInAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    onRegisterChild(newRecord);
    setRegisteredChild(newRecord);
  };

  const handleResetForm = () => {
    setFullName('');
    setBirthDate('');
    setFatherName('');
    setFatherPhone('');
    setMotherName('');
    setMotherPhone('');
    setChurchResponsibleAdult('');
    setCustomAuthorizerName('');
    setCustomAuthorizerPhone('');
    setAuthorizerIdNumber('');
    setAllergies('');
    setEps('');
    setConsentAccepted(false);
    setFormError(null);
    setRegisteredChild(null);
  };

  // If successfully registered, show friendly confirmation screen
  if (registeredChild) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 sm:p-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            ¡Registro Exitoso en Tierra Prometida!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-2">
            Bienvenido, {registeredChild.fullName}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Los datos han sido guardados y el consentimiento informado ha quedado registrado legalmente conforme a la Ley 527 de 1999.
          </p>

          {/* Child Assignment Summary Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left max-w-lg mx-auto mb-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-blue-200/60 pb-3 mb-3">
              <div>
                <p className="text-[11px] font-semibold text-blue-600 uppercase">Número de Registro</p>
                <p className="text-base font-bold text-slate-900 font-mono">{registeredChild.registrationNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-blue-600 uppercase">Salón Asignado</p>
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-2xs">
                  {registeredChild.classroom}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Edad calculada al 31 Dic:</span>
                <p className="font-semibold text-slate-800">{registeredChild.ageAtDec31} años</p>
              </div>
              <div>
                <span className="text-slate-500">Acudiente que Autoriza:</span>
                <p className="font-semibold text-slate-800">{registeredChild.authorizerName} ({registeredChild.authorizerRelationship})</p>
              </div>
              <div>
                <span className="text-slate-500">Adulto en Iglesia:</span>
                <p className="font-semibold text-slate-800">{registeredChild.churchResponsibleAdult}</p>
              </div>
              <div>
                <span className="text-slate-500">Fecha y Hora de Firma:</span>
                <p className="font-semibold text-slate-800 font-mono text-[11px]">{registeredChild.consentTimestamp}</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => generateConsentPDF(registeredChild, true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Documento de Consentimiento (PDF)</span>
            </button>

            <button
              onClick={() => onOpenConsentModal(registeredChild)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Documento</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleResetForm}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-4"
            >
              Registrar a otro niño
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Ministry Welcome */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Ministerio Infantil Tierra Prometida</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Inscripción y Consentimiento de Niños
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Diligencie la información del menor para su participación en las actividades, clases bíblicas y talleres de la <strong>Iglesia Comunidad Cristiana de Fe y Fuego</strong> en Barranquilla.
          </p>
        </div>

        {/* Prominent Exact Logo */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-inner flex items-center justify-center shrink-0">
          <Logo size="lg" />
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Paso Único</span>
            <h2 className="text-xl font-bold text-slate-900">Formulario Oficial de Registro</h2>
            <p className="text-xs text-slate-500">
              Todos los campos marcados con asterisco (*) son obligatorios.
            </p>
          </div>

          {/* Quick PDF download button from prompt: 'botón visible para descargar un formato de archivo de consentimiento que te adjunto y debe tener los datos que ingresaron en el formulario' */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDraftPDF}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
              title="Descargar formato con los datos actuales"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Descargar Consentimiento con estos datos</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenConsentModal(getDraftChild())}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              title="Vista previa del documento"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {formError && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="font-medium">{formError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Datos del Niño */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Datos del Niño</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre Completo del Niño *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Mateo Alejandro Gómez Lopera"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fecha de Nacimiento *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={birthDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Usada para asignar automáticamente el salón según su edad al 31 de diciembre.
                </span>
              </div>

              {/* Dynamic Classroom Assignment Box */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">Salón Asignado Automáticamente:</span>
                  {birthDate && (
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {ageAtDec31} años al 31 Dic
                    </span>
                  )}
                </div>

                {birthDate ? (
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${classroomInfo.colorTheme.badgeBg} ${classroomInfo.colorTheme.badgeText} border ${classroomInfo.colorTheme.border}`}>
                      {assignedClassroom}
                    </span>
                    <span className="text-xs text-slate-600">
                      {classroomInfo.ageRange} ({classroomInfo.description})
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Seleccione la fecha de nacimiento para calcular el salón (Visionarios, Exploradores o Conquistadores).
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Datos de los Padres y Contacto */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Datos de los Padres y Contacto</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Madre */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                  Datos de la Madre
                </span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Nombre Completo de la Madre
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ej: Liliana Lopera"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Número de Contacto de la Madre
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      placeholder="Ej: 3043636887"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Padre */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                  Datos del Padre
                </span>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Nombre Completo del Padre
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Ej: Carlos Gómez Martínez"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Número de Contacto del Padre
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={fatherPhone}
                      onChange={(e) => setFatherPhone(e.target.value)}
                      placeholder="Ej: 3012547890"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Adulto responsable en la iglesia */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adulto Responsable en la Iglesia *
                </label>
                <input
                  type="text"
                  required
                  value={churchResponsibleAdult}
                  onChange={(e) => setChurchResponsibleAdult(e.target.value)}
                  placeholder="Persona autorizada que entrega y recoge al niño en los cultos/actividades"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <span>Atajos rápidos:</span>
                  {motherName && (
                    <button
                      type="button"
                      onClick={() => setChurchResponsibleAdult(motherName)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Usar Madre ({motherName})
                    </button>
                  )}
                  {fatherName && (
                    <button
                      type="button"
                      onClick={() => setChurchResponsibleAdult(fatherName)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Usar Padre ({fatherName})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Datos de Quien Autoriza (Consentimiento Legal) */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Datos de quien Autoriza el Consentimiento
              </h3>
            </div>

            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Calidad de Quien Firma / Autoriza *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Madre', 'Padre', 'Tutor legal', 'Acudiente'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setAuthorizerRole(role)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        authorizerRole === role
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Authorizer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo de Quien Autoriza *
                  </label>
                  {authorizerRole === 'Madre' || authorizerRole === 'Padre' ? (
                    <input
                      type="text"
                      readOnly
                      value={resolvedAuthorizerName}
                      placeholder={authorizerRole === 'Madre' ? 'Se llenará con la Madre' : 'Se llenará con el Padre'}
                      className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      value={customAuthorizerName}
                      onChange={(e) => setCustomAuthorizerName(e.target.value)}
                      placeholder="Nombre del tutor o acudiente"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Authorizer ID (Documento de Identidad) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Documento de Identidad (Cédula) *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorizerIdNumber}
                    onChange={(e) => setAuthorizerIdNumber(e.target.value)}
                    placeholder="Ej: 43870046"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* Authorizer Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono de Quien Autoriza *
                  </label>
                  {authorizerRole === 'Madre' || authorizerRole === 'Padre' ? (
                    <input
                      type="text"
                      readOnly
                      value={resolvedAuthorizerPhone}
                      placeholder="Teléfono del acudiente"
                      className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="tel"
                      required
                      value={customAuthorizerPhone}
                      onChange={(e) => setCustomAuthorizerPhone(e.target.value)}
                      placeholder="Ej: 3043636887"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Salud y Observaciones Médicas (Opcional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alergias o Condiciones Médicas Relevantes (Opcional)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ej: Intolerancia a la lactosa, asma, etc."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Entidad Promotora de Salud (EPS) (Opcional)
              </label>
              <input
                type="text"
                value={eps}
                onChange={(e) => setEps(e.target.value)}
                placeholder="Ej: Sura, Sanitas, Nueva EPS, etc."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 5: OBLIGATORY OBSERVATION & CONSENT CHECKBOX */}
          {/* Prompt requirement:
              'Debe incluir un texto de observación obligatorio que indique claramente:
              "Al ingresar los datos del niño y enviar este formulario, usted acepta automáticamente nuestros términos de consentimiento",
              junto con un checkbox de aceptación obligatoria.' */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
                  Términos y Consentimiento Informado Legal
                </h4>
                {/* EXACT MANDATORY OBSERVATION TEXT */}
                <p className="text-sm font-bold text-amber-950 leading-relaxed">
                  Al ingresar los datos del niño y enviar este formulario, usted acepta automáticamente nuestros términos de consentimiento.
                </p>
                <p className="text-xs text-amber-800/90 mt-1 leading-normal">
                  Autoriza expresamente la participación del menor en las actividades del ministerio infantil <strong>Tierra Prometida</strong> de la <strong>Iglesia Comunidad Cristiana de Fe y Fuego</strong> en Barranquilla, atención médica de emergencia, exoneración y uso institucional de imagen según las Leyes colombianas 527 de 1999 y 1581 de 2012.
                </p>
              </div>
            </div>

            {/* View Full Legal Clauses Accordion / Link */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200">
              <button
                type="button"
                onClick={() => onOpenConsentModal(getDraftChild())}
                className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-2 flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Leer documento completo de consentimiento con mis datos</span>
              </button>
            </div>

            {/* MANDATORY CHECKBOX */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded text-blue-600 border-amber-400 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 leading-snug">
                  He leído, comprendo y acepto los términos de autorización y consentimiento informado para el registro del menor en el ministerio infantil Tierra Prometida. *
                </span>
              </label>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDownloadDraftPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Formato en PDF</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Registrar Niño y Aceptar Consentimiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

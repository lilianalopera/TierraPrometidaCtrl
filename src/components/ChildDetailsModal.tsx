import React, { useState } from 'react';
import { ChildRecord, ClassroomType } from '../types';
import { CLASSROOM_DETAILS, formatDateSpanish, assignClassroom, calculateAgeAtDec31 } from '../utils/classroom';
import { generateConsentPDF } from '../utils/pdfGenerator';
import {
  X,
  Download,
  Calendar,
  Phone,
  User,
  Shield,
  Heart,
  CheckCircle,
  Clock,
  Edit2,
  Save,
} from 'lucide-react';

interface ChildDetailsModalProps {
  child: ChildRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateChild: (child: ChildRecord) => void;
}

export const ChildDetailsModal: React.FC<ChildDetailsModalProps> = ({
  child,
  isOpen,
  onClose,
  onUpdateChild,
}) => {
  if (!isOpen || !child) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ChildRecord>({ ...child });

  const classroom = CLASSROOM_DETAILS[child.classroom];

  const handleSave = () => {
    // Recalculate if birth date changed
    const newAgeAtDec31 = calculateAgeAtDec31(formData.birthDate);
    const newClassroom = assignClassroom(newAgeAtDec31);

    const updated: ChildRecord = {
      ...formData,
      ageAtDec31: newAgeAtDec31,
      classroom: newClassroom,
    };

    onUpdateChild(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-200 font-semibold">{child.registrationNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-100 font-bold">
                  {child.classroom}
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight">{child.fullName}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            )}
            <button
              onClick={() => generateConsentPDF(child, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-xs"
              title="Descargar documento de consentimiento legal firmado en PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick status bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Edad al 31 Dic</span>
              <span className="text-lg font-bold text-slate-900">{child.ageAtDec31} años</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Salón Oficial</span>
              <span className="text-sm font-black text-blue-700">{child.classroom}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Asistencia Hoy</span>
              <span className={`text-xs font-bold inline-flex items-center gap-1 ${child.checkedInToday ? 'text-emerald-700' : 'text-slate-500'}`}>
                {child.checkedInToday ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Presente ({child.checkedInAt || 'Hoy'})
                  </>
                ) : (
                  'No registrada'
                )}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Consentimiento</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Aceptado
              </span>
            </div>
          </div>

          {/* Form details or Edit Mode */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Ficha del Menor
            </h4>

            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Adulto Responsable en Iglesia</label>
                  <input
                    type="text"
                    value={formData.churchResponsibleAdult}
                    onChange={(e) => setFormData({ ...formData, churchResponsibleAdult: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nombre de la Madre</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Teléfono Madre</label>
                  <input
                    type="text"
                    value={formData.motherPhone}
                    onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nombre del Padre</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Teléfono Padre</label>
                  <input
                    type="text"
                    value={formData.fatherPhone}
                    onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Alergias / Condiciones Médicas</label>
                  <input
                    type="text"
                    value={formData.allergiesOrMedicalConditions || ''}
                    onChange={(e) => setFormData({ ...formData, allergiesOrMedicalConditions: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Fecha de Nacimiento:</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {formatDateSpanish(child.birthDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Adulto Responsable en Iglesia:</span>
                  <span className="font-bold text-blue-700 text-sm">
                    {child.churchResponsibleAdult}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Madre:</span>
                  <p className="font-semibold text-slate-800">{child.motherName || 'No registrada'}</p>
                  <p className="font-mono text-slate-600">{child.motherPhone || 'Sin teléfono'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Padre:</span>
                  <p className="font-semibold text-slate-800">{child.fatherName || 'No registrado'}</p>
                  <p className="font-mono text-slate-600">{child.fatherPhone || 'Sin teléfono'}</p>
                </div>
                <div className="sm:col-span-2 p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                  <span className="text-amber-800 font-semibold block mb-0.5">Alergias o Cuidados Especiales:</span>
                  <p className="text-slate-800 font-medium">
                    {child.allergiesOrMedicalConditions || 'Ninguna condición médica reportada.'}
                  </p>
                  {child.eps && <p className="text-slate-600 text-[11px] mt-1">EPS: {child.eps}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Legal consent info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              Datos del Consentimiento Legal Firmado
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-500">Firmado por:</span>{' '}
                <span className="font-semibold">{child.authorizerName}</span> ({child.authorizerRelationship})
              </div>
              <div>
                <span className="text-slate-500">Documento de Id.:</span>{' '}
                <span className="font-mono font-semibold">{child.authorizerIdNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Teléfono registrado:</span>{' '}
                <span className="font-mono font-semibold">{child.authorizerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500">Fecha y Hora de Registro:</span>{' '}
                <span className="font-mono">{child.consentTimestamp}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Consentimiento otorgado bajo Ley 527 de 1999 y Ley 1581 de 2012 de la República de Colombia.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => generateConsentPDF(child, true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Documento Legal PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

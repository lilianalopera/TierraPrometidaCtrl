import React from 'react';
import { ChildRecord } from '../types';
import { generateConsentPDF } from '../utils/pdfGenerator';
import { formatDateSpanish, formatDateTime } from '../utils/classroom';
import { Download, Printer, X, ShieldCheck } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  child?: Partial<ChildRecord> | null;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onClose,
  child,
}) => {
  if (!isOpen) return null;

  // Build a normalized child record for preview and download
  const currentYear = new Date().getFullYear();
  const birthYear = child?.birthDate ? new Date(child.birthDate).getFullYear() : currentYear - 5;
  const ageAtDec31 = child?.ageAtDec31 ?? (child?.birthDate ? Math.max(0, currentYear - birthYear) : 5);
  
  const displayChild: ChildRecord = {
    id: child?.id || 'preview-temp',
    registrationNumber: child?.registrationNumber || 'TP-2026-NUEVO',
    fullName: child?.fullName || 'NOMBRE DEL MENOR REGISTRADO',
    birthDate: child?.birthDate || '2021-04-15',
    ageAtDec31: ageAtDec31,
    currentAge: child?.currentAge || 5,
    classroom: child?.classroom || 'Visionarios',
    fatherName: child?.fatherName || '',
    fatherPhone: child?.fatherPhone || '',
    motherName: child?.motherName || '',
    motherPhone: child?.motherPhone || '',
    churchResponsibleAdult: child?.churchResponsibleAdult || child?.authorizerName || 'Padre o Madre',
    authorizerName: child?.authorizerName || child?.motherName || child?.fatherName || 'Liliana Lopera',
    authorizerRelationship: child?.authorizerRelationship || 'Madre',
    authorizerIdNumber: child?.authorizerIdNumber || '43870046',
    authorizerPhone: child?.authorizerPhone || child?.motherPhone || child?.fatherPhone || '3043636887',
    consentAccepted: true,
    consentTimestamp: child?.consentTimestamp || formatDateTime(),
    createdAt: child?.createdAt || formatDateTime(),
  };

  const handleDownloadPDF = () => {
    generateConsentPDF(displayChild, true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold tracking-wide">
              Documento Oficial: Autorización y Consentimiento Informado
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Imprimir documento"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-xs"
              title="Descargar archivo en PDF con los datos ingresados"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container resembling the official Letter / A4 sheet */}
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            id="consent-printable-document"
            className="w-full max-w-[210mm] bg-white shadow-md border border-slate-200 p-6 sm:p-10 font-sans text-slate-800 text-[13px] leading-relaxed relative"
          >
            {/* Church Top Navy Banner */}
            <div className="bg-[#0f2b48] text-white p-4 rounded-t-lg -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-xs font-bold text-blue-200 leading-tight text-center">
                    Fe y<br />Fuego
                  </span>
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-bold tracking-tight">
                    Iglesia Comunidad Cristiana de Fe y Fuego
                  </h1>
                  <p className="text-xs text-blue-200">Barranquilla - Colombia</p>
                  <p className="text-xs font-medium text-sky-300">
                    Autorización y Consentimiento Informado - Tierra Prometida
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-purple-900 rounded-lg border border-purple-700/60 shadow-xs">
                <span className="text-xs font-black text-amber-300 tracking-wider">TIERRA</span>{' '}
                <span className="text-xs font-bold text-white">PROMETIDA</span>
              </div>
            </div>

            {/* Ribbon "Datos del Menor" */}
            <div className="bg-[#c28f2c] text-white font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm mb-3">
              Datos del Menor
            </div>

            {/* Child Data Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-500">Nombre:</span>
                <span className="text-sm font-bold text-slate-900 uppercase">
                  {displayChild.fullName}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-sky-200/60">
                <div>
                  <span className="text-slate-500">Fecha de Nacimiento:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {formatDateSpanish(displayChild.birthDate) || 'No indicada'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Edad al 31 de Dic:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {displayChild.ageAtDec31} años
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Salón Asignado:</span>{' '}
                  <span className="font-bold text-blue-700">
                    {displayChild.classroom}
                  </span>
                </div>
              </div>
            </div>

            {/* Clauses Section */}
            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-[#0f2b48] mb-1">Declaración de Autorización</h4>
                <p className="text-justify leading-normal">
                  Yo, plenamente identificado con los datos registrados en este documento, en mi calidad de padre, madre, tutor legal o acudiente del menor inscrito, autorizo expresamente su participación en todas las actividades programadas, espacios pedagógicos, conferencias y dinámicas organizadas por la Iglesia Comunidad Cristiana de Fe y Fuego Barranquilla, en el desarrollo programado del ministerio infantil denominado Tierra Prometida.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f2b48] mb-1">Responsabilidad y Estado de Salud</h4>
                <p className="text-justify leading-normal">
                  Autorizo la participación del menor bajo mi absoluta responsabilidad y manifiesto voluntariamente que no presenta condiciones médicas o físicas que le impidan integrarse de forma segura a las dinámicas de los eventos y actividades y que bajo mi responsabilidad esta en ese lugar en buen estado de salud.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f2b48] mb-1">Atención Médica de Emergencia</h4>
                <p className="text-justify leading-normal">
                  En caso de presentarse una emergencia médica durante el tiempo de las actividades, autorizo expresamente al personal logístico y de primeros auxilios a brindar la atención básica necesaria y/o a trasladar al menor al centro asistencial más cercano para salvaguardar su integridad.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f2b48] mb-1">Exoneración de Responsabilidad</h4>
                <p className="text-justify leading-normal">
                  Exonero de toda responsabilidad civil, contractual o extracontractual a la Iglesia Comunidad Cristiana de Fe y Fuego en Barranquilla, sus pastores, líderes, directivas, colaboradores y personal de apoyo voluntario, ante cualquier incidente o accidente menor que pueda ocurrir durante el desarrollo de la jornada.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f2b48] mb-1">Derechos de Imagen y Uso de Redes Sociales</h4>
                <p className="text-justify leading-normal">
                  Autorizo de manera voluntaria, expresa e informada la toma de fotografías, registros en video o capturas de audio del menor durante el desarrollo de las actividades. Asimismo, faculto a la Iglesia Comunidad Cristiana de Fe y Fuego en Barranquilla para su posterior uso, publicación y difusión en sus redes sociales institucionales, páginas web y canales oficiales de comunicación, con fines exclusivamente ilustrativos, informativos o de memoria histórica de la comunidad, sin que esto genere derecho a compensación alguna.
                </p>
              </div>

              {/* Authorizer Details */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="font-bold text-[#0f2b48] mb-2">Datos de quien autoriza</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-500">Nombre completo:</span>{' '}
                    <span className="font-bold text-slate-800">{displayChild.authorizerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Calidad:</span>{' '}
                    <span className="font-bold text-slate-800">{displayChild.authorizerRelationship}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Documento de Id.:</span>{' '}
                    <span className="font-bold text-slate-800 font-mono">{displayChild.authorizerIdNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Teléfono:</span>{' '}
                    <span className="font-bold text-slate-800 font-mono">{displayChild.authorizerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Adulto responsable en iglesia:</span>{' '}
                    <span className="font-bold text-slate-800">{displayChild.churchResponsibleAdult}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Fecha y hora:</span>{' '}
                    <span className="font-bold text-slate-800 font-mono">{displayChild.consentTimestamp}</span>
                  </div>
                </div>
              </div>

              {/* Legal Notice Callout */}
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                <strong>Aviso Legal:</strong> Esta autorización fue otorgada de forma digital mediante aceptación electrónica con plena validez jurídica conforme a la Ley 527 de 1999 (Comercio Electrónico) y Ley 1581 de 2012 (Protección de Datos) de la República de Colombia. El registro de IP, fecha y hora constituyen evidencia de la manifestación de voluntad del firmante.
              </div>
            </div>

            {/* Document Footer */}
            <div className="mt-6 pt-3 border-t border-slate-200 text-center text-slate-400 text-[11px] italic">
              Página 1
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Documento de consentimiento legal para el ministerio infantil Tierra Prometida.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF con estos datos</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

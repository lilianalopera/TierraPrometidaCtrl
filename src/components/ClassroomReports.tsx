import React, { useState } from 'react';
import { ChildRecord, ClassroomType } from '../types';
import { CLASSROOM_DETAILS, formatDateSpanish } from '../utils/classroom';
import { generateConsentPDF } from '../utils/pdfGenerator';
import {
  Users,
  Printer,
  Download,
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  Sparkles,
  CalendarCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface ClassroomReportsProps {
  children: ChildRecord[];
  onOpenDetails: (child: ChildRecord) => void;
  onToggleAttendance: (id: string) => void;
}

export const ClassroomReports: React.FC<ClassroomReportsProps> = ({
  children,
  onOpenDetails,
  onToggleAttendance,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Primary 3 classrooms required by the prompt
  const targetClassrooms: ClassroomType[] = ['Visionarios', 'Exploradores', 'Conquistadores'];

  // Categorize children
  const groupedChildren: Record<ClassroomType, ChildRecord[]> = {
    Visionarios: children.filter((c) => c.classroom === 'Visionarios'),
    Exploradores: children.filter((c) => c.classroom === 'Exploradores'),
    Conquistadores: children.filter((c) => c.classroom === 'Conquistadores'),
    Semillitas: children.filter((c) => c.classroom === 'Semillitas'),
    Transición: children.filter((c) => c.classroom === 'Transición'),
  };

  const handlePrintRoomRoster = (roomName: ClassroomType) => {
    // Print window formatted for Sunday school roster
    const roomKids = groupedChildren[roomName];
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Planilla de Asistencia - Salón ${roomName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 25px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #0f2b48; padding-bottom: 12px; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 18px; color: #0f2b48; }
            h2 { margin: 4px 0; font-size: 14px; color: #2563eb; }
            p { margin: 2px 0; font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #0f2b48; }
            .check-col { width: 35px; text-align: center; }
            .notes-col { width: 140px; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }
            .sig-line { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 5px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Iglesia Comunidad Cristiana de Fe y Fuego - Barranquilla</h1>
            <h2>Planilla de Asistencia Dominical: Salón ${roomName.toUpperCase()}</h2>
            <p>Ministerio Infantil Tierra Prometida · Clasificación al 31 de Diciembre de ${currentYear}</p>
            <p><strong>Fecha del Culto:</strong> _______________ | <strong>Maestro(a) Responsable:</strong> ____________________________</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25px;">#</th>
                <th>Nombre del Niño</th>
                <th>Edad (31 Dic)</th>
                <th>Fecha Nac.</th>
                <th>Adulto en Iglesia</th>
                <th>Contacto Padres</th>
                <th>Alergias / Cuidados</th>
                <th class="check-col">Asistió</th>
                <th class="notes-col">Firma / Entrega</th>
              </tr>
            </thead>
            <tbody>
              ${roomKids
                .map(
                  (kid, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${kid.fullName}</strong></td>
                  <td>${kid.ageAtDec31} años</td>
                  <td>${formatDateSpanish(kid.birthDate)}</td>
                  <td>${kid.churchResponsibleAdult}</td>
                  <td>${kid.motherPhone || kid.fatherPhone || kid.authorizerPhone}</td>
                  <td>${kid.allergiesOrMedicalConditions || '-'}</td>
                  <td class="check-col">${kid.checkedInToday ? '✓' : ''}</td>
                  <td class="notes-col"></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
            <div>
              <p>Total Inscritos en el Salón: <strong>${roomKids.length}</strong></p>
              <p>Generado desde el Sistema de Control de Niños Tierra Prometida</p>
            </div>
            <div class="sig-line">
              Firma de Maestro(a) de Salón
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      {/* Intro & Rule Explanation */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Módulo Oficial de Clasificación por Salones</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Salones del Ministerio Infantil al 31 de Diciembre de {currentYear}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
            La iglesia clasifica automáticamente a los niños según la edad que cumplen o tienen al <strong>31 de diciembre del año en curso</strong> para asegurar una pedagogía bíblica adecuada a su desarrollo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/20 text-center">
            <span className="text-[11px] text-blue-200 block uppercase font-semibold">Total Inscritos</span>
            <span className="text-xl font-black text-white">{children.length}</span>
          </div>
        </div>
      </div>

      {/* Classroom Metric Cards (3 Core Classrooms) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {targetClassrooms.map((roomKey) => {
          const info = CLASSROOM_DETAILS[roomKey];
          const kids = groupedChildren[roomKey];
          const count = kids.length;
          const percentage = children.length > 0 ? Math.round((count / children.length) * 100) : 0;
          const presentCount = kids.filter((k) => k.checkedInToday).length;

          return (
            <div
              key={roomKey}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                selectedClassroom === roomKey
                  ? 'ring-2 ring-blue-600 border-blue-500 bg-white'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className={`p-5 border-b ${info.colorTheme.bg} ${info.colorTheme.border}`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${info.colorTheme.badgeBg} ${info.colorTheme.badgeText}`}>
                    {info.name}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {info.ageRange}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {info.name}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  {info.description}
                </p>
              </div>

              {/* Stats Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-slate-900">{count}</span>
                    <span className="text-xs text-slate-500 ml-1.5 font-medium">niños inscritos</span>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {percentage}% del total
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: info.colorTheme.accent,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Presentes hoy:</span>
                    <strong className="text-slate-900">{presentCount} / {count}</strong>
                  </span>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedClassroom(selectedClassroom === roomKey ? 'ALL' : roomKey)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      selectedClassroom === roomKey
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{selectedClassroom === roomKey ? 'Ver Todos' : 'Filtrar Este Salón'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handlePrintRoomRoster(roomKey)}
                    title="Imprimir planilla de asistencia para maestros de este salón"
                    className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Classroom Filter Segmented Selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">
            Filtrar:
          </span>
          <button
            onClick={() => setSelectedClassroom('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedClassroom === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Salones ({children.length})
          </button>
          {targetClassrooms.map((room) => (
            <button
              key={room}
              onClick={() => setSelectedClassroom(room)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                selectedClassroom === room
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {room} ({groupedChildren[room].length})
            </button>
          ))}
        </div>

        {/* Search inside report */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Detailed Grouped Lists */}
      <div className="space-y-6">
        {targetClassrooms
          .filter((room) => selectedClassroom === 'ALL' || selectedClassroom === room)
          .map((roomKey) => {
            const info = CLASSROOM_DETAILS[roomKey];
            const allKidsInRoom = groupedChildren[roomKey];
            const filteredKids = allKidsInRoom.filter(
              (c) =>
                c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.authorizerName.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
              <div
                key={roomKey}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Room Section Header */}
                <div className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${info.colorTheme.bg} ${info.colorTheme.border}`}>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg ${info.colorTheme.badgeBg} ${info.colorTheme.badgeText}`}>
                      {info.name}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {info.description}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {filteredKids.length} niños listados · Rango de edad: {info.ageRange}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePrintRoomRoster(roomKey)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs transition-colors self-start sm:self-center"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Planilla del Salón</span>
                  </button>
                </div>

                {/* Table of Children in this room */}
                {filteredKids.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No hay niños registrados en el salón {info.name} que coincidan con la búsqueda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-3">Nombre del Niño</th>
                          <th className="px-4 py-3">Fecha Nacimiento</th>
                          <th className="px-4 py-3">Edad al 31 Dic</th>
                          <th className="px-4 py-3">Adulto Responsable</th>
                          <th className="px-4 py-3">Contacto Padres</th>
                          <th className="px-4 py-3 text-center">Asistencia Hoy</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredKids.map((kid) => (
                          <tr key={kid.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-bold text-slate-900">{kid.fullName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Reg: {kid.registrationNumber}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {formatDateSpanish(kid.birthDate)}
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-900 text-sm">
                                {kid.ageAtDec31} años
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                (Actual: {kid.currentAge} a.)
                              </span>
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              <div className="font-medium text-slate-900">{kid.churchResponsibleAdult}</div>
                              <div className="text-[11px] text-slate-500">
                                Acudiente: {kid.authorizerName}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              <div className="font-mono text-slate-800">
                                {kid.motherPhone || kid.fatherPhone || kid.authorizerPhone}
                              </div>
                              {kid.allergiesOrMedicalConditions && kid.allergiesOrMedicalConditions !== 'Ninguna' && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  {kid.allergiesOrMedicalConditions}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => onToggleAttendance(kid.id)}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                                  kid.checkedInToday
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <CheckCircle className={`w-3 h-3 ${kid.checkedInToday ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <span>{kid.checkedInToday ? 'Presente' : 'Check-in'}</span>
                              </button>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => onOpenDetails(kid)}
                                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Ver ficha completa"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => generateConsentPDF(kid, true)}
                                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Descargar Consentimiento Informado en PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

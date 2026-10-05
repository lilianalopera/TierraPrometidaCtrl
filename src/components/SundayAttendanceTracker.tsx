import React, { useState, useEffect } from 'react';
import { ChildRecord, AttendanceLogRecord, ClassroomType } from '../types';
import { dbService } from '../services/dbService';
import { CLASSROOM_DETAILS, formatDateSpanish } from '../utils/classroom';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Users,
  Download,
  Printer,
  Sparkles,
  Phone,
  UserCheck,
  Calendar,
  History,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface SundayAttendanceTrackerProps {
  childrenList: ChildRecord[];
  onToggleAttendance: (child: ChildRecord, isPresent: boolean, serviceName: string, pickupAdult?: string) => Promise<void>;
}

export const SundayAttendanceTracker: React.FC<SundayAttendanceTrackerProps> = ({
  childrenList,
  onToggleAttendance,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedService, setSelectedService] = useState<string>('Culto Dominical Principal (10:00 AM)');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomType | 'ALL'>('ALL');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogRecord[]>([]);
  const [viewMode, setViewMode] = useState<'checkin' | 'history'>('checkin');
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  // Subscribe to attendance logs for selected date
  useEffect(() => {
    const unsubscribe = dbService.subscribeToAttendanceLogs(
      viewMode === 'checkin' ? selectedDate : null,
      (logs) => {
        setAttendanceLogs(logs);
      }
    );
    return () => unsubscribe();
  }, [selectedDate, viewMode]);

  // Children present today based on attendanceLogs or checkedInToday
  const presentChildIds = new Set(attendanceLogs.map((l) => l.childId));

  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.authorizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.churchResponsibleAdult.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClassroom =
      selectedClassroom === 'ALL' || child.classroom === selectedClassroom;

    return matchesSearch && matchesClassroom;
  });

  const handleCheckInToggle = async (child: ChildRecord) => {
    setIsProcessingId(child.id);
    const isCurrentlyPresent = presentChildIds.has(child.id) || !!child.checkedInToday;
    try {
      await onToggleAttendance(
        child,
        !isCurrentlyPresent,
        selectedService,
        child.churchResponsibleAdult
      );
    } catch (err) {
      console.error('Error toggling attendance:', err);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handlePrintAttendanceList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const presentChildren = childrenList.filter((c) => presentChildIds.has(c.id));

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asistencia Dominical - ${selectedDate}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 25px; color: #0f172a; }
            .header { text-align: center; border-bottom: 2px solid #0f2b48; padding-bottom: 12px; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 18px; color: #0f2b48; }
            h2 { margin: 4px 0; font-size: 14px; color: #2563eb; }
            p { margin: 2px 0; font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #0f2b48; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; background: #e0f2fe; color: #0369a1; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Iglesia Comunidad Cristiana de Fe y Fuego - Barranquilla</h1>
            <h2>Reporte de Asistencia Dominical: Ministerio Infantil Tierra Prometida</h2>
            <p><strong>Fecha:</strong> ${selectedDate} | <strong>Culto:</strong> ${selectedService}</p>
            <p><strong>Total Niños Presentes:</strong> ${presentChildren.length} de ${childrenList.length} inscritos</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25px;">#</th>
                <th>Nombre del Niño</th>
                <th>Salón</th>
                <th>Adulto Responsable</th>
                <th>Contacto</th>
                <th>Hora Registro</th>
                <th>Firma / Retiro</th>
              </tr>
            </thead>
            <tbody>
              ${presentChildren
                .map((kid, i) => {
                  const log = attendanceLogs.find((l) => l.childId === kid.id);
                  return `
                  <tr>
                    <td>${i + 1}</td>
                    <td><strong>${kid.fullName}</strong></td>
                    <td><span class="badge">${kid.classroom}</span></td>
                    <td>${kid.churchResponsibleAdult}</td>
                    <td>${kid.motherPhone || kid.fatherPhone || kid.authorizerPhone}</td>
                    <td>${log?.time || kid.checkedInAt || '10:00 AM'}</td>
                    <td style="width: 150px;"></td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Group stats
  const totalPresent = attendanceLogs.length;
  const visionariosPresent = attendanceLogs.filter((l) => l.classroom === 'Visionarios').length;
  const exploradoresPresent = attendanceLogs.filter((l) => l.classroom === 'Exploradores').length;
  const conquistadoresPresent = attendanceLogs.filter((l) => l.classroom === 'Conquistadores').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Sunday Controls */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Seguimiento Dominical en Base de Datos</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Control de Asistencia Dominical
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Cada registro de check-in queda guardado en la nube con fecha, hora, culto y adulto autorizado para el retiro seguro de cada menor.
          </p>
        </div>

        {/* Date & Service Selectors */}
        <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">
              Fecha del Domingo
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white text-slate-800 font-semibold rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-1">
              Culto / Horario
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white text-slate-800 font-semibold rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Culto Dominical Principal (10:00 AM)">Culto Principal (10:00 AM)</option>
              <option value="Culto Matutino (8:00 AM)">Culto Matutino (8:00 AM)</option>
              <option value="Culto Vespertino (5:00 PM)">Culto Vespertino (5:00 PM)</option>
              <option value="Taller Bíblico / Especial">Taller Bíblico / Especial</option>
            </select>
          </div>

          <button
            onClick={handlePrintAttendanceList}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-lg shadow-xs transition-colors self-end"
            title="Imprimir lista de asistencia de este culto"
          >
            <Printer className="w-3.5 h-3.5 text-blue-700" />
            <span>Imprimir Lista</span>
          </button>
        </div>
      </div>

      {/* Metric Cards for Today's Sunday */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Total Presentes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalPresent}</span>
            <span className="text-xs text-slate-500">de {childrenList.length} inscritos</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 bg-sky-50/30 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Visionarios (3-5 a.)</span>
          <span className="text-2xl font-black text-sky-900 mt-1 block">{visionariosPresent}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">Exploradores (6-8 a.)</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{exploradoresPresent}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">Conquistadores (9-13 a.)</span>
          <span className="text-2xl font-black text-indigo-900 mt-1 block">{conquistadoresPresent}</span>
        </div>
      </div>

      {/* Mode Switcher & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Sub-view switcher: Check-in list vs History */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setViewMode('checkin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              viewMode === 'checkin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Pase de Lista ({selectedDate})</span>
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              viewMode === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>Historial de Domingos</span>
          </button>
        </div>

        {/* Search & Classroom filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por niño o acudiente..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">Todos los Salones</option>
            <option value="Visionarios">Visionarios</option>
            <option value="Exploradores">Exploradores</option>
            <option value="Conquistadores">Conquistadores</option>
          </select>
        </div>
      </div>

      {/* CHECK-IN GRID VIEW */}
      {viewMode === 'checkin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChildren.map((kid) => {
            const isPresent = presentChildIds.has(kid.id) || !!kid.checkedInToday;
            const log = attendanceLogs.find((l) => l.childId === kid.id);
            const isProcessing = isProcessingId === kid.id;

            return (
              <div
                key={kid.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPresent
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {kid.classroom} · {kid.ageAtDec31} años
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {kid.fullName}
                    </h4>
                  </div>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleCheckInToggle(kid)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 ${
                      isPresent
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${isPresent ? 'text-white' : 'text-slate-400'}`} />
                    <span>{isPresent ? 'Presente' : 'Check-in'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Adulto Responsable:</span>
                    <span className="font-semibold text-slate-800">{kid.churchResponsibleAdult}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-mono text-slate-700">
                      {kid.motherPhone || kid.fatherPhone || kid.authorizerPhone}
                    </span>
                  </div>

                  {kid.allergiesOrMedicalConditions && kid.allergiesOrMedicalConditions !== 'Ninguna' && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        {kid.allergiesOrMedicalConditions}
                      </span>
                    </div>
                  )}

                  {isPresent && (
                    <div className="mt-2 pt-1.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        Ingreso: {log?.time || kid.checkedInAt || 'Registrado'}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        Sincronizado en la nube
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORY TABLE VIEW */}
      {viewMode === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Historial Completo de Asistencias Dominicales</span>
            </h4>
            <span className="text-xs text-slate-500">
              {attendanceLogs.length} registros guardados en Firestore
            </span>
          </div>

          {attendanceLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">
              No hay asistencias registradas aún en el historial.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Fecha del Culto</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-5 py-3">Nombre del Niño</th>
                    <th className="px-4 py-3">Salón</th>
                    <th className="px-4 py-3">Culto / Servicio</th>
                    <th className="px-4 py-3">Adulto Autorizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {log.date}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {log.time}
                      </td>
                      <td className="px-5 py-3 font-bold text-slate-900">
                        {log.childName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                          {log.classroom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {log.serviceName}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {log.pickupPerson}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

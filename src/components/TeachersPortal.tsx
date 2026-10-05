import React, { useState } from 'react';
import { ChildRecord, ClassroomType } from '../types';
import { ClassroomReports } from './ClassroomReports';
import { SundayAttendanceTracker } from './SundayAttendanceTracker';
import { formatDateSpanish, CLASSROOM_DETAILS } from '../utils/classroom';
import { generateConsentPDF } from '../utils/pdfGenerator';
import { storageService } from '../services/storage';
import {
  Search,
  Filter,
  Download,
  Plus,
  Lock,
  Unlock,
  CheckCircle,
  Eye,
  Trash2,
  FileSpreadsheet,
  CalendarCheck,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

interface TeachersPortalProps {
  childrenList: ChildRecord[];
  isAuthenticated: boolean;
  onAuthenticate: (password: string) => boolean;
  onLogout: () => void;
  onOpenDetails: (child: ChildRecord) => void;
  onOpenNewRegistration: () => void;
  onDeleteChild: (id: string) => void;
  onToggleAttendance: (id: string) => void;
  onRecordSundayAttendance: (child: ChildRecord, isPresent: boolean, serviceName: string, pickupAdult?: string) => Promise<void>;
  onResetData: () => void;
}

export const TeachersPortal: React.FC<TeachersPortalProps> = ({
  childrenList,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onOpenDetails,
  onOpenNewRegistration,
  onDeleteChild,
  onToggleAttendance,
  onRecordSundayAttendance,
  onResetData,
}) => {
  // Password screen state
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Sub-tabs in teachers portal
  const [subTab, setSubTab] = useState<'table' | 'reports' | 'attendance'>('reports');

  // Table filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [classroomFilter, setClassroomFilter] = useState<string>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(inputPassword);
    if (!success) {
      setAuthError('Contraseña incorrecta. (Clave predeterminada: "fe y fuego")');
    } else {
      setAuthError(null);
      setInputPassword('');
    }
  };

  const handleQuickDemoLogin = () => {
    onAuthenticate('fe y fuego');
    setAuthError(null);
  };

  // If not authenticated, show password gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Área Restringida
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">
            Portal de Maestros y Líderes
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            Ingrese la clave de seguridad para consultar la base de datos de niños, reportes de salones y planillas de consentimiento.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Ingrese su clave"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Clave predeterminada del ministerio: <code className="font-bold text-blue-600">fe y fuego</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              Ingresar al Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors border border-blue-200/60"
            >
              Acceso Rápido para Prueba (Un clic)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered children for Table
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.authorizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.churchResponsibleAdult.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.authorizerIdNumber.includes(searchTerm) ||
      child.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClassroom =
      classroomFilter === 'ALL' || child.classroom === classroomFilter;

    const matchesAttendance =
      attendanceFilter === 'ALL' ||
      (attendanceFilter === 'PRESENT' && child.checkedInToday) ||
      (attendanceFilter === 'ABSENT' && !child.checkedInToday);

    return matchesSearch && matchesClassroom && matchesAttendance;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header & Subnavigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Gestión Integral
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">
              Ministerio Infantil Tierra Prometida
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Portal de Maestros y Líderes
          </h1>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setSubTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              subTab === 'reports'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Clasificación por Salones</span>
          </button>

          <button
            onClick={() => setSubTab('table')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              subTab === 'table'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Listado General ({childrenList.length})</span>
          </button>

          <button
            onClick={() => setSubTab('attendance')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              subTab === 'attendance'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Check-in Dominical</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CLASSROOM REPORTS (Special module requested by prompt) */}
      {subTab === 'reports' && (
        <ClassroomReports
          children={childrenList}
          onOpenDetails={onOpenDetails}
          onToggleAttendance={onToggleAttendance}
        />
      )}

      {/* VIEW 2: FULL DATA TABLE */}
      {subTab === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por niño, acudiente, documento..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={classroomFilter}
                onChange={(e) => setClassroomFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos los Salones</option>
                <option value="Visionarios">Visionarios (3-5 a.)</option>
                <option value="Exploradores">Exploradores (6-8 a.)</option>
                <option value="Conquistadores">Conquistadores (9-13 a.)</option>
                <option value="Semillitas">Semillitas (&lt; 3 a.)</option>
                <option value="Transición">Transición (&gt; 13 a.)</option>
              </select>

              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Toda Asistencia</option>
                <option value="PRESENT">Presentes Hoy</option>
                <option value="ABSENT">Sin Check-in</option>
              </select>

              <button
                onClick={() => storageService.exportToCSV(filteredChildren)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                title="Descargar base de datos en formato Excel / CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={onOpenNewRegistration}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Registro</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredChildren.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No se encontraron niños registrados</p>
              <p className="text-xs text-slate-500 mt-1">Pruebe ajustando los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">N° Reg. / Niño</th>
                    <th className="px-4 py-3.5">Fecha Nac.</th>
                    <th className="px-4 py-3.5">Edad 31 Dic</th>
                    <th className="px-4 py-3.5">Salón Asignado</th>
                    <th className="px-4 py-3.5">Adulto en Iglesia</th>
                    <th className="px-4 py-3.5">Quien Autoriza</th>
                    <th className="px-4 py-3.5 text-center">Asistencia</th>
                    <th className="px-4 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChildren.map((kid) => {
                    const roomInfo = CLASSROOM_DETAILS[kid.classroom];
                    return (
                      <tr key={kid.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[11px] text-blue-700 font-bold block">
                            {kid.registrationNumber}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {kid.fullName}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-slate-700">
                          {formatDateSpanish(kid.birthDate)}
                        </td>

                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {kid.ageAtDec31} años
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${roomInfo.colorTheme.badgeBg} ${roomInfo.colorTheme.badgeText}`}
                          >
                            {kid.classroom}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-slate-700">
                          <div className="font-semibold text-slate-900">
                            {kid.churchResponsibleAdult}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">
                            {kid.motherPhone || kid.fatherPhone || kid.authorizerPhone}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-700">
                          <div className="font-medium text-slate-900">
                            {kid.authorizerName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {kid.authorizerRelationship} · CC {kid.authorizerIdNumber}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => onToggleAttendance(kid.id)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                              kid.checkedInToday
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle className={`w-3.5 h-3.5 ${kid.checkedInToday ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{kid.checkedInToday ? 'Presente' : 'Check-in'}</span>
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onOpenDetails(kid)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver ficha completa y editar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => generateConsentPDF(kid, true)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Descargar Consentimiento Informado en PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Desea eliminar el registro de ${kid.fullName}?`)) {
                                  onDeleteChild(kid.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer info */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Mostrando {filteredChildren.length} de {childrenList.length} niños registrados.
            </span>
            <button
              onClick={() => {
                if (window.confirm('¿Restablecer datos a los iniciales de prueba?')) {
                  onResetData();
                }
              }}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer datos de muestra</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: SUNDAY CHECK-IN & ATTENDANCE TRACKER IN DATABASE */}
      {subTab === 'attendance' && (
        <SundayAttendanceTracker
          childrenList={childrenList}
          onToggleAttendance={onRecordSundayAttendance}
        />
      )}

    </div>
  );
};

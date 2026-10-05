import React, { useRef } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, UserPlus, Users, FileText, Lock, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'register' | 'teachers';
  setActiveTab: (tab: 'register' | 'teachers') => void;
  isTeacherAuthenticated: boolean;
  onLogoutTeacher: () => void;
  onOpenBlankConsent: () => void;
  totalChildrenCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isTeacherAuthenticated,
  onLogoutTeacher,
  onOpenBlankConsent,
  totalChildrenCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        localStorage.setItem('tp_custom_logo_data', base64);
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('tp_custom_logo_data');
    window.location.reload();
  };

  const hasCustomLogo = typeof window !== 'undefined' && !!localStorage.getItem('tp_custom_logo_data');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar with church denomination notice */}
      <div className="bg-[#0f2b48] text-white px-4 py-1 text-center text-[11px] font-medium tracking-wide flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Iglesia Comunidad Cristiana de Fe y Fuego · Barranquilla - Colombia
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-blue-200">
              Ministerio Infantil Tierra Prometida
            </span>
            {hasCustomLogo && (
              <button
                onClick={handleResetLogo}
                className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 underline"
                title="Restablecer al logo vectorial predeterminado"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Restablecer logo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28 py-2">
          
          {/* Zone 1: Brand & Logo (Exact Tierra Prometida logo) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('register')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl p-1 transition-transform hover:scale-[1.02] flex items-center gap-2"
              title="Tierra Prometida - Iglesia Fe y Fuego"
            >
              <Logo size="lg" />
            </button>

            {/* Hidden file input to allow user to drop their exact logo TP.jpeg */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Zone 2: Navigation Switcher (Segmented Control) */}
          <nav className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200/70 shadow-xs">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Registro de Niños</span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 whitespace-nowrap ${
                activeTab === 'teachers'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Portal de Maestros</span>
              {isTeacherAuthenticated ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sesión activa" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </nav>

          {/* Zone 3: Quick Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenBlankConsent}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
              title="Descargar formato oficial de autorización y consentimiento informado"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Formato de Consentimiento</span>
            </button>

            {isTeacherAuthenticated && activeTab === 'teachers' && (
              <button
                onClick={onLogoutTeacher}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors whitespace-nowrap"
              >
                Cerrar Sesión
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Subir archivo propio del logo (logo TP.jpeg / PNG)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


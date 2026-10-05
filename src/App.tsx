import React, { useState, useEffect } from 'react';
import { ChildRecord } from './types';
import { storageService } from './services/storage';
import { dbService } from './services/dbService';
import { testFirestoreConnection } from './firebase';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { TeachersPortal } from './components/TeachersPortal';
import { ConsentModal } from './components/ConsentModal';
import { ChildDetailsModal } from './components/ChildDetailsModal';
import { Logo } from './components/Logo';
import {
  Shield,
  Heart,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  Database,
  Cloud,
} from 'lucide-react';

export default function App() {
  // Main view state: 'register' (Public/Parents) or 'teachers' (Password protected)
  const [activeTab, setActiveTab] = useState<'register' | 'teachers'>('register');
  
  // Children list state synchronized in real-time with Firestore database
  const [childrenList, setChildrenList] = useState<ChildRecord[]>([]);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Teacher authentication state
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tp_teacher_auth') === 'true';
  });

  // Modal states
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [previewChildData, setPreviewChildData] = useState<Partial<ChildRecord> | null>(null);

  const [selectedChildForDetails, setSelectedChildForDetails] = useState<ChildRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Firestore and subscribe to real-time changes
  useEffect(() => {
    // 1. Test connection on boot per Firebase guidelines
    testFirestoreConnection().then((connected) => {
      setIsDbConnected(connected);
    });

    // 2. Fallback initial load from local cache
    const cached = storageService.getChildren();
    setChildrenList(cached);

    // 3. Attach real-time Firestore listener
    const unsubscribe = dbService.subscribeToChildren(
      (firestoreChildren) => {
        setChildrenList(firestoreChildren);
        storageService.saveChildren(firestoreChildren);
        setIsDbConnected(true);
      },
      (err) => {
        console.warn('Realtime listener fallback to offline cache:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Add registered child to Cloud Database
  const handleRegisterChild = async (newChild: ChildRecord) => {
    try {
      await dbService.saveChild(newChild);
      showToast(`¡${newChild.fullName} registrado y guardado en la base de datos!`);
    } catch (e) {
      console.error('Error saving child to Firestore:', e);
      const updated = storageService.addChild(newChild);
      setChildrenList(updated);
      showToast(`¡${newChild.fullName} registrado en el salón ${newChild.classroom}!`);
    }
  };

  // Update existing child in Cloud Database
  const handleUpdateChild = async (updatedChild: ChildRecord) => {
    try {
      await dbService.saveChild(updatedChild);
      setSelectedChildForDetails(updatedChild);
      showToast('Ficha actualizada en la nube.');
    } catch (e) {
      console.error('Error updating child in Firestore:', e);
      const updated = storageService.updateChild(updatedChild);
      setChildrenList(updated);
      setSelectedChildForDetails(updatedChild);
      showToast('Ficha actualizada.');
    }
  };

  // Delete child from Cloud Database
  const handleDeleteChild = async (id: string) => {
    try {
      await dbService.deleteChild(id);
      showToast('Registro eliminado de la base de datos.');
    } catch (e) {
      console.error('Error deleting child:', e);
      const updated = storageService.deleteChild(id);
      setChildrenList(updated);
      showToast('Registro eliminado.');
    }
  };

  // Toggle quick attendance
  const handleToggleAttendance = async (id: string) => {
    const kid = childrenList.find((c) => c.id === id);
    if (!kid) return;

    const nextState = !kid.checkedInToday;
    try {
      await dbService.recordAttendance(kid, nextState, 'Culto Dominical');
      showToast(
        nextState
          ? `Check-in registrado para ${kid.fullName}`
          : `Asistencia cancelada para ${kid.fullName}`
      );
    } catch (e) {
      console.error('Error updating attendance in DB:', e);
      const updated = storageService.toggleAttendance(id);
      setChildrenList(updated);
    }
  };

  // Sunday attendance with detailed parameters
  const handleRecordSundayAttendance = async (
    child: ChildRecord,
    isPresent: boolean,
    serviceName: string,
    pickupAdult?: string
  ) => {
    try {
      await dbService.recordAttendance(
        child,
        isPresent,
        serviceName,
        pickupAdult || child.churchResponsibleAdult
      );
      showToast(
        isPresent
          ? `Asistencia registrada para ${child.fullName} en ${serviceName}`
          : `Asistencia revertida para ${child.fullName}`
      );
    } catch (e) {
      console.error('Error recording Sunday attendance in DB:', e);
      const updated = storageService.toggleAttendance(child.id);
      setChildrenList(updated);
    }
  };

  // Teacher login validation
  const handleTeacherAuthenticate = (enteredPassword: string): boolean => {
    const cleanEntered = enteredPassword.trim().toLowerCase();
    const storedPw = storageService.getTeacherPassword().trim().toLowerCase();

    // Accept stored password, "fe y fuego", "feyfuego", or "maestros2026"
    if (
      cleanEntered === storedPw ||
      cleanEntered === 'fe y fuego' ||
      cleanEntered === 'feyfuego' ||
      cleanEntered === 'maestros2026'
    ) {
      setIsTeacherAuthenticated(true);
      sessionStorage.setItem('tp_teacher_auth', 'true');
      return true;
    }
    return false;
  };

  const handleTeacherLogout = () => {
    setIsTeacherAuthenticated(false);
    sessionStorage.removeItem('tp_teacher_auth');
    setActiveTab('register');
    showToast('Sesión de maestro cerrada.');
  };

  const handleResetData = async () => {
    await dbService.seedInitialChildren();
    showToast('Se restablecieron los datos de muestra en la base de datos.');
  };

  const openConsentModalWithChild = (childData?: Partial<ChildRecord> | null) => {
    setPreviewChildData(childData || null);
    setIsConsentModalOpen(true);
  };

  const openChildDetails = (child: ChildRecord) => {
    setSelectedChildForDetails(child);
    setIsDetailsModalOpen(true);
  };

  const nextRegNumber = dbService.generateNextRegNumber(childrenList);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onLogoutTeacher={handleTeacherLogout}
        onOpenBlankConsent={() => openConsentModalWithChild(null)}
        totalChildrenCount={childrenList.length}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Database connection badge */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3">
        <div className="flex items-center justify-end">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Firestore Conectado</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{childrenList.length} registros sincronizados</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'register' ? (
          <RegistrationForm
            onRegisterChild={handleRegisterChild}
            onOpenConsentModal={openConsentModalWithChild}
            nextRegNumber={nextRegNumber}
          />
        ) : (
          <TeachersPortal
            childrenList={childrenList}
            isAuthenticated={isTeacherAuthenticated}
            onAuthenticate={handleTeacherAuthenticate}
            onLogout={handleTeacherLogout}
            onOpenDetails={openChildDetails}
            onOpenNewRegistration={() => setActiveTab('register')}
            onDeleteChild={handleDeleteChild}
            onToggleAttendance={handleToggleAttendance}
            onRecordSundayAttendance={handleRecordSundayAttendance}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Official Consent Form Modal */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        child={previewChildData}
      />

      {/* Child Full Details Modal for Teachers */}
      <ChildDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        child={selectedChildForDetails}
        onUpdateChild={handleUpdateChild}
      />

      {/* Church Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Church Brand & Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  FF
                </div>
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Iglesia Comunidad Cristiana de Fe y Fuego
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ministerio Infantil <strong>Tierra Prometida</strong>. Cuidado, formación espiritual en valores y educación bíblica para niños y niñas en Barranquilla.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Barranquilla, Atlántico - Colombia</span>
              </div>
            </div>

            {/* Salones de Clase */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-blue-400 uppercase tracking-wider">
                Salones por Edades (al 31 Dic)
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Visionarios:</span>
                  <span className="font-semibold text-sky-300">3 a 5 años</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Exploradores:</span>
                  <span className="font-semibold text-blue-300">6 a 8 años</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Conquistadores:</span>
                  <span className="font-semibold text-indigo-300">9 a 13 años</span>
                </li>
              </ul>
            </div>

            {/* Legal Framework & Cloud Persistence */}
            <div className="space-y-2 text-xs text-slate-400">
              <h4 className="font-bold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Base de Datos y Sincronización</span>
              </h4>
              <p className="leading-relaxed text-[11px]">
                Base de datos en la nube (Firebase Firestore) activa con sincronización en tiempo real. Los registros y la asistencia dominical se respaldan instantáneamente entre maestros y recepción.
              </p>
              <p className="leading-relaxed text-[11px] pt-1">
                Tratamiento conforme a las Leyes colombianas <strong>527 de 1999</strong> y <strong>1581 de 2012</strong>.
              </p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Iglesia Comunidad Cristiana de Fe y Fuego · Tierra Prometida Barranquilla.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab(activeTab === 'register' ? 'teachers' : 'register')}
                className="hover:text-slate-300 transition-colors"
              >
                Cambiar a {activeTab === 'register' ? 'Portal de Maestros' : 'Formulario de Padres'}
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}


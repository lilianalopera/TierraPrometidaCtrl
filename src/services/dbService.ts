import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { ChildRecord, AttendanceLogRecord, ClassroomType } from '../types';
import { INITIAL_CHILDREN } from '../data/initialData';
import { formatDateTime } from '../utils/classroom';

const CHILDREN_COLLECTION = 'children';
const ATTENDANCE_COLLECTION = 'attendance_logs';

export const dbService = {
  /**
   * Subscribe to real-time updates for all registered children in Firestore.
   */
  subscribeToChildren(
    onSuccess: (children: ChildRecord[]) => void,
    onError?: (error: unknown) => void
  ): () => void {
    const colRef = collection(db, CHILDREN_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      async (snapshot) => {
        // If Firestore is completely fresh and empty, seed with initial sample children
        if (snapshot.empty) {
          try {
            await this.seedInitialChildren();
            return;
          } catch (e) {
            console.error('Error seeding initial data:', e);
            onSuccess(INITIAL_CHILDREN);
            return;
          }
        }

        const list: ChildRecord[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as ChildRecord),
          id: docSnap.id,
        }));
        onSuccess(list);
      },
      (error) => {
        console.error('Snapshot listener error on children collection:', error);
        onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, CHILDREN_COLLECTION);
        } catch (e) {
          // Keep callback alive
        }
      }
    );
  },

  /**
   * Subscribe to real-time attendance logs for a specific Sunday or all dates.
   */
  subscribeToAttendanceLogs(
    dateFilter: string | null,
    onSuccess: (logs: AttendanceLogRecord[]) => void,
    onError?: (error: unknown) => void
  ): () => void {
    const colRef = collection(db, ATTENDANCE_COLLECTION);
    const q = dateFilter
      ? query(colRef, where('date', '==', dateFilter), orderBy('time', 'desc'))
      : query(colRef, orderBy('date', 'desc'), orderBy('time', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const logs: AttendanceLogRecord[] = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as AttendanceLogRecord),
          id: docSnap.id,
        }));
        onSuccess(logs);
      },
      (error) => {
        console.error('Snapshot listener error on attendance logs:', error);
        onError?.(error);
        try {
          handleFirestoreError(error, OperationType.GET, ATTENDANCE_COLLECTION);
        } catch (e) {
          // Keep callback alive
        }
      }
    );
  },

  /**
   * Save or update a child's registration record in Firestore.
   */
  async saveChild(child: ChildRecord): Promise<void> {
    const docPath = `${CHILDREN_COLLECTION}/${child.id}`;
    try {
      const docRef = doc(db, CHILDREN_COLLECTION, child.id);
      await setDoc(docRef, child, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  },

  /**
   * Delete a child's record from Firestore.
   */
  async deleteChild(childId: string): Promise<void> {
    const docPath = `${CHILDREN_COLLECTION}/${childId}`;
    try {
      const docRef = doc(db, CHILDREN_COLLECTION, childId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * Record Sunday attendance check-in or cancellation.
   */
  async recordAttendance(
    child: ChildRecord,
    isPresent: boolean,
    serviceName: string = 'Culto Dominical Principal',
    pickupAdult?: string,
    notes?: string
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Update child state
    const updatedChild: ChildRecord = {
      ...child,
      checkedInToday: isPresent,
      checkedInAt: isPresent ? nowTime : undefined,
    };
    await this.saveChild(updatedChild);

    // 2. If marking present, create an immutable log for tracking this specific Sunday
    const logId = `${today}_${child.id}`;
    const logDocPath = `${ATTENDANCE_COLLECTION}/${logId}`;

    if (isPresent) {
      const logRecord: AttendanceLogRecord = {
        id: logId,
        childId: child.id,
        childName: child.fullName,
        classroom: child.classroom,
        date: today,
        time: nowTime,
        serviceName,
        pickupPerson: pickupAdult || child.churchResponsibleAdult,
        notes: notes || 'Check-in dominical registrado',
      };

      try {
        const logRef = doc(db, ATTENDANCE_COLLECTION, logId);
        await setDoc(logRef, logRecord);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, logDocPath);
      }
    } else {
      // If unchecked, delete that day's log entry
      try {
        const logRef = doc(db, ATTENDANCE_COLLECTION, logId);
        await deleteDoc(logRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, logDocPath);
      }
    }
  },

  /**
   * Seed Firestore initially with the approved church records if the database is newly provisioned.
   */
  async seedInitialChildren(): Promise<void> {
    for (const child of INITIAL_CHILDREN) {
      const docRef = doc(db, CHILDREN_COLLECTION, child.id);
      await setDoc(docRef, child);
    }
  },

  /**
   * Generate next registration number based on the current children list.
   */
  generateNextRegNumber(existingChildren: ChildRecord[]): string {
    const year = new Date().getFullYear();
    const maxNum = existingChildren.reduce((acc, c) => {
      const match = c.registrationNumber?.match(/TP-\d{4}-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const next = (maxNum + 1).toString().padStart(3, '0');
    return `TP-${year}-${next}`;
  },
};

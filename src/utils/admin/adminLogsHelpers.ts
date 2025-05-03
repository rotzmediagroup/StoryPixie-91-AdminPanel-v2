import { collection, doc, addDoc, getDocs, query, where, serverTimestamp, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminActivityLog } from '@/types';

// Log admin actions
export const logAdminActivity = async (
  adminId: string,
  adminEmail: string,
  action: string,
  details: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const ipAddress = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown');
    
    const logEntry: Omit<AdminActivityLog, 'id'> = {
      adminId,
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent: navigator.userAgent
    };
    
    await addDoc(collection(db, 'adminActivityLogs'), {
      ...logEntry,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
};

// Get admin activity logs
export const getAdminActivityLogs = async (limit = 100): Promise<AdminActivityLog[]> => {
  try {
    const logsSnapshot = await getDocs(
      query(
        collection(db, 'adminActivityLogs'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limit)
      )
    );
    
    return logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<AdminActivityLog, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return [];
  }
};

// Get admin user login history
export const getAdminLoginHistory = async (userId: string): Promise<AdminActivityLog[]> => {
  try {
    const logsSnapshot = await getDocs(
      query(
        collection(db, 'adminActivityLogs'),
        where('adminId', '==', userId),
        where('action', '==', 'login'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(50)
      )
    );
    
    return logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<AdminActivityLog, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching login history:', error);
    return [];
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHostel } from './HostelContext';

export type UserRole = 'OWNER' | 'STUDENT';

interface AuthContextType {
  role: UserRole;
  currentStudentId: string | null;
  autoTriggerPay: boolean;
  setAutoTriggerPay: (val: boolean) => void;
  setRole: (role: UserRole) => void;
  setCurrentStudentId: (studentId: string | null) => void;
  loginAsOwner: () => void;
  loginAsStudent: (studentId: string) => void;
  loginWithPhone: (phone: string) => { success: boolean; studentName?: string; error?: string };
  logoutStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenants, switchHostel } = useHostel();

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('hostel_os_auth_role');
    return (saved === 'STUDENT' || saved === 'OWNER') ? saved : 'OWNER';
  });

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    return localStorage.getItem('hostel_os_student_id') || 'tenant-1';
  });

  const [autoTriggerPay, setAutoTriggerPay] = useState<boolean>(false);

  // Deep Link URL detection (?student=9849123456&action=pay)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const studentParam = params.get('student');
      const actionParam = params.get('action');

      if (studentParam) {
        const cleanParam = studentParam.replace(/\D/g, '');
        const matched = tenants.find(
          t => t.id === studentParam || (cleanParam && t.phone.replace(/\D/g, '').endsWith(cleanParam.slice(-10)))
        );

        if (matched) {
          switchHostel(matched.hostelId);
          setCurrentStudentId(matched.id);
          setRole('STUDENT');
          if (actionParam === 'pay') {
            setAutoTriggerPay(true);
          }
        }
      }
    } catch {
      // Ignore URL parsing errors in non-browser environments
    }
  }, [tenants, switchHostel]);

  useEffect(() => {
    localStorage.setItem('hostel_os_auth_role', role);
  }, [role]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('hostel_os_student_id', currentStudentId);
    } else {
      localStorage.removeItem('hostel_os_student_id');
    }
  }, [currentStudentId]);

  const loginAsOwner = () => {
    setRole('OWNER');
  };

  const loginAsStudent = (studentId: string) => {
    const matched = tenants.find(t => t.id === studentId);
    if (matched) {
      switchHostel(matched.hostelId);
    }
    setCurrentStudentId(studentId);
    setRole('STUDENT');
  };

  const loginWithPhone = (phone: string): { success: boolean; studentName?: string; error?: string } => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    const matched = tenants.find(
      t => t.status === 'ACTIVE' && t.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );

    if (matched) {
      switchHostel(matched.hostelId);
      setCurrentStudentId(matched.id);
      setRole('STUDENT');
      return { success: true, studentName: matched.fullName };
    }

    return { success: false, error: 'Mobile number not registered in any Hostel OS branch.' };
  };

  const logoutStudent = () => {
    setCurrentStudentId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentStudentId,
        autoTriggerPay,
        setAutoTriggerPay,
        setRole,
        setCurrentStudentId,
        loginAsOwner,
        loginAsStudent,
        loginWithPhone,
        logoutStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

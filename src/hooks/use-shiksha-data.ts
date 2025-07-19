
'use client'
import * as React from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set, off, get, child } from 'firebase/database';
import { initialScheduleData, usersData, initialAllStudentsFeeData, initialTestsData, initialTestResultsData, initialAnnouncementsData, initialAttendanceData } from '@/lib/data';

type ShikshaData = {
  students: any;
  teachers: any;
  schedules: any;
  fees: any;
  tests: any;
  testResults: any;
  announcements: any;
  attendance: any;
};

export function useShikshaData() {
  const [data, setData] = React.useState<ShikshaData | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const dbRef = ref(database);
    
    const listener = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        // Initialize DB with default data if it's empty
        console.log("No data found, initializing with default data.");
        const initialData = {
            students: usersData.students,
            teachers: usersData.teachers,
            schedules: initialScheduleData,
            fees: initialAllStudentsFeeData,
            tests: initialTestsData,
            testResults: initialTestResultsData,
            announcements: initialAnnouncementsData,
            attendance: initialAttendanceData,
        };
        set(dbRef, initialData);
        setData(initialData);
      }
      setLoading(false);
    });

    // Detach listener on unmount
    return () => {
      off(dbRef, 'value', listener);
    };
  }, []);

  const saveData = React.useCallback(async (path: string, value: any) => {
    try {
      const pathRef = ref(database, path);
      await set(pathRef, value);
    } catch (error) {
      console.error("Firebase write failed: ", error);
    }
  }, []);

  return { data, loading, saveData };
}

import { subDays, format } from 'date-fns';

const today = new Date();

export const studentData = {
  summary: {
    studentName: 'Anjali Kulkarni',
    overallGrade: 'A-',
    attendance: '95%',
    upcomingAssignments: 3,
  },
  schedule: [
    { time: '09:00 AM', subject: 'Mathematics', type: 'class' },
    { time: '10:00 AM', subject: 'Physics', type: 'class' },
    { time: '11:00 AM', subject: 'Chemistry Lab', type: 'lab' },
    { time: '01:00 PM', subject: 'English', type: 'class' },
    { time: '02:00 PM', subject: 'History', type: 'class' },
  ],
  performance: [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 88 },
    { subject: 'History', score: 78 },
    { subject: 'Marathi', score: 95 },
  ],
};

export const attendanceData = {
  present: [
    subDays(today, 2),
    subDays(today, 3),
    subDays(today, 4),
    subDays(today, 7),
    subDays(today, 8),
    subDays(today, 9),
    subDays(today, 10),
    subDays(today, 11),
    subDays(today, 14),
    subDays(today, 15),
  ],
  absent: [subDays(today, 5)],
  holidays: [subDays(today, 1), subDays(today, 16), subDays(today, 17)],
};

export const documentsData = [
  {
    id: 1,
    title: 'Algebra Chapter 5 Notes',
    subject: 'Mathematics',
    uploadDate: format(subDays(today, 2), 'dd MMM, yyyy'),
  },
  {
    id: 2,
    title: 'Thermodynamics Summary',
    subject: 'Physics',
    uploadDate: format(subDays(today, 5), 'dd MMM, yyyy'),
  },
  {
    id: 3,
    title: 'Indian Independence Movement',
    subject: 'History',
    uploadDate: format(subDays(today, 10), 'dd MMM, yyyy'),
  },
];

export const testResultsData = [
    { id: 1, subject: 'Mathematics', testName: 'Unit Test 1', date: format(subDays(today, 7), 'dd MMM, yyyy'), score: 85 },
    { id: 2, subject: 'Science', testName: 'Mid-term Exam', date: format(subDays(today, 14), 'dd MMM, yyyy'), score: 92 },
    { id: 3, subject: 'English', testName: 'Essay Submission', date: format(subDays(today, 4), 'dd MMM, yyyy'), score: 88 },
    { id: 4, subject: 'History', testName: 'Quiz 3', date: format(subDays(today, 10), 'dd MMM, yyyy'), score: 78 },
    { id: 5, subject: 'Marathi', testName: 'Unit Test 1', date: format(subDays(today, 8), 'dd MMM, yyyy'), score: 95 },
];


export const feeData = {
  summary: {
    total: 50000,
    paid: 45000,
    due: 5000,
    dueDate: format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'dd MMM, yyyy'),
  },
  history: [
    { id: 'INV-2024001', date: '15 Apr, 2024', amount: 25000, status: 'Paid' },
    { id: 'INV-2024002', date: '12 Jun, 2024', amount: 20000, status: 'Paid' },
    { id: 'INV-2024003', date: '30 Jul, 2024', amount: 5000, status: 'Due' },
  ],
};

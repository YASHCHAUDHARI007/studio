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

export const initialDocumentsData = [
  {
    id: 1,
    title: 'Algebra Chapter 5 Notes',
    subject: 'Mathematics',
    uploadDate: format(subDays(today, 2), 'dd MMM, yyyy'),
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
  {
    id: 2,
    title: 'Thermodynamics Summary',
    subject: 'Physics',
    uploadDate: format(subDays(today, 5), 'dd MMM, yyyy'),
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
  {
    id: 3,
    title: 'Indian Independence Movement',
    subject: 'History',
    uploadDate: format(subDays(today, 10), 'dd MMM, yyyy'),
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
];

export const initialTestResultsData = [
    { id: 8, studentId: 'STU-001', studentName: 'Rohan Sharma', subject: 'English', testName: 'Essay Submission', date: format(subDays(today, 4), 'dd MMM, yyyy'), score: 88 },
    { id: 7, studentId: 'STU-002', studentName: 'Priya Singh', subject: 'English', testName: 'Essay Submission', date: format(subDays(today, 4), 'dd MMM, yyyy'), score: 94 },
    { id: 6, studentId: 'STU-003', studentName: 'Amit Patel', subject: 'Marathi', testName: 'Unit Test 1', date: format(subDays(today, 8), 'dd MMM, yyyy'), score: 80 },
    { id: 5, studentId: 'STU-001', studentName: 'Rohan Sharma', subject: 'Mathematics', testName: 'Unit Test 1', date: format(subDays(today, 7), 'dd MMM, yyyy'), score: 85 },
    { id: 4, studentId: 'STU-002', studentName: 'Priya Singh', subject: 'Mathematics', testName: 'Unit Test 1', date: format(subDays(today, 7), 'dd MMM, yyyy'), score: 91 },
    { id: 3, studentId: 'STU-003', studentName: 'Amit Patel', subject: 'Mathematics', testName: 'Unit Test 1', date: format(subDays(today, 7), 'dd MMM, yyyy'), score: 76 },
    { id: 2, studentId: 'STU-001', studentName: 'Rohan Sharma', subject: 'Science', testName: 'Mid-term Exam', date: format(subDays(today, 14), 'dd MMM, yyyy'), score: 92 },
    { id: 1, studentId: 'STU-002', studentName: 'Priya Singh', subject: 'Science', testName: 'Mid-term Exam', date: format(subDays(today, 14), 'dd MMM, yyyy'), score: 88 },
];

export const initialStudentFeeData = {
  summary: {
    total: 75000,
    paid: 50000,
    due: 25000,
    dueDate: '31 Aug, 2024',
  },
  monthlyBreakdown: [
    { month: 'August 2024', invoiceId: 'INV-2024004', total: 25000, paid: 0, status: 'Due', dueDate: '31 Aug, 2024' },
    { month: 'July 2024', invoiceId: 'INV-2024003', total: 25000, paid: 25000, status: 'Paid', dueDate: '30 Jul, 2024' },
    { month: 'June 2024', invoiceId: 'INV-2024002', total: 25000, paid: 25000, status: 'Paid', dueDate: '15 Jun, 2024' },
  ],
};

export const initialAllStudentsFeeData = {
  'STU-001': {
    name: 'Rohan Sharma',
    summary: { total: 75000, paid: 50000, due: 25000, dueDate: '31 Aug, 2024' },
    monthlyBreakdown: [
      { month: 'August 2024', total: 25000, paid: 0, status: 'Due' },
      { month: 'July 2024', total: 25000, paid: 25000, status: 'Paid' },
      { month: 'June 2024', total: 25000, paid: 25000, status: 'Paid' },
    ],
  },
  'STU-002': {
    name: 'Priya Singh',
    summary: { total: 75000, paid: 75000, due: 0, dueDate: 'N/A' },
    monthlyBreakdown: [
      { month: 'August 2024', total: 25000, paid: 25000, status: 'Paid' },
      { month: 'July 2024', total: 25000, paid: 25000, status: 'Paid' },
      { month: 'June 2024', total: 25000, paid: 25000, status: 'Paid' },
    ],
  },
  'STU-003': {
    name: 'Amit Patel',
    summary: { total: 75000, paid: 25000, due: 50000, dueDate: '31 Jul, 2024' },
    monthlyBreakdown: [
      { month: 'August 2024', total: 25000, paid: 0, status: 'Due' },
      { month: 'July 2024', total: 25000, paid: 0, status: 'Due' },
      { month: 'June 2024', total: 25000, paid: 25000, status: 'Paid' },
    ],
  },
};

export const usersData = {
  students: [
    { id: 'STU-001', name: 'Rohan Sharma', grade: '10th', parentName: 'Mr. Sharma', parentContact: '9876543210', email: 'rohan.sharma@example.com', dateOfBirth: '2007-07-27', dateJoined: '2021-06-15', username: '9876543210', password: 'rohan27072007' },
    { id: 'STU-002', name: 'Priya Singh', grade: '10th', parentName: 'Ms. Singh', parentContact: '9876543211', email: 'priya.singh@example.com', dateOfBirth: '2007-05-15', dateJoined: '2021-06-15', username: '9876543211', password: 'priya15052007' },
    { id: 'STU-003', name: 'Amit Patel', grade: '9th', parentName: 'Mr. Patel', parentContact: '9876543212', email: 'amit.patel@example.com', dateOfBirth: '2008-09-01', dateJoined: '2022-04-01', username: '9876543212', password: 'amit01092008' },
  ],
  teachers: [
    { id: 'TCH-001', name: 'Mrs. Davis', subject: 'Mathematics', email: 'davis@example.com', username: 'davis@example.com', password: 'password123' },
    { id: 'TCH-002', name: 'Mr. Khan', subject: 'Science', email: 'khan@example.com', username: 'khan@example.com', password: 'password123' },
    { id: 'TCH-003', name: 'Ms. Joshi', subject: 'English', email: 'joshi@example.com', username: 'joshi@example.com', password: 'password123' },
  ]
};

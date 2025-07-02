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

export const initialTestsData = [
  {
    id: 'TEST-001',
    testName: 'Mid-term Exam',
    subject: 'Science',
    grade: '10th',
    medium: 'English',
    date: format(subDays(today, 14), 'yyyy-MM-dd'),
    time: '10:00',
    totalMarks: 100,
    status: 'Completed',
  },
  {
    id: 'TEST-002',
    testName: 'Unit Test 1',
    subject: 'Mathematics',
    grade: '10th',
    medium: 'English',
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    time: '11:00',
    totalMarks: 50,
    status: 'Completed',
  },
    {
    id: 'TEST-003',
    testName: 'Unit Test 1',
    subject: 'Mathematics',
    grade: '9th',
    medium: 'Semi-English',
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    time: '11:00',
    totalMarks: 50,
    status: 'Completed',
  },
  {
    id: 'TEST-004',
    testName: 'Upcoming Quiz',
    subject: 'History',
    grade: '10th',
    medium: 'English',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    totalMarks: 25,
    status: 'Upcoming',
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


export const initialTestResultsData = [
    // Results for TEST-001 (Science, 100 marks)
    { id: 1, testId: 'TEST-001', studentId: 'STU-001', studentName: 'Rohan Sharma', score: 92 },
    { id: 2, testId: 'TEST-001', studentId: 'STU-002', studentName: 'Priya Singh', score: 88 },

    // Results for TEST-002 (Math, 50 marks)
    { id: 3, testId: 'TEST-002', studentId: 'STU-001', studentName: 'Rohan Sharma', score: 43 },
    { id: 4, testId: 'TEST-002', studentId: 'STU-002', studentName: 'Priya Singh', score: 46 },

    // Results for TEST-003 (Math, 50 marks)
    { id: 5, testId: 'TEST-003', studentId: 'STU-003', studentName: 'Amit Patel', score: 38 },
];


export const initialStudentFeeData = {
  summary: {
    total: 75000,
    paid: 50000,
    due: 25000,
    dueDate: '31 Aug, 2024',
  },
  paymentHistory: [
    { id: 'PAY-001', date: '2024-06-15', amount: 25000, notes: 'First installment' },
    { id: 'PAY-002', date: '2024-07-30', amount: 25000, notes: 'Second installment' },
  ],
};

export const initialAllStudentsFeeData = {
  'STU-001': {
    name: 'Rohan Sharma',
    summary: { total: 75000, paid: 50000, due: 25000, dueDate: '31 Aug, 2024' },
    paymentHistory: [
      { id: 'PAY-001', date: '2024-06-15', amount: 25000, notes: 'First installment' },
      { id: 'PAY-002', date: '2024-07-30', amount: 25000, notes: 'Second installment' },
    ],
  },
  'STU-002': {
    name: 'Priya Singh',
    summary: { total: 75000, paid: 75000, due: 0, dueDate: 'N/A' },
    paymentHistory: [
      { id: 'PAY-003', date: '2024-06-15', amount: 25000, notes: 'First installment' },
      { id: 'PAY-004', date: '2024-07-30', amount: 25000, notes: 'Second installment' },
      { id: 'PAY-005', date: '2024-08-10', amount: 25000, notes: 'Final installment' },
    ],
  },
  'STU-003': {
    name: 'Amit Patel',
    summary: { total: 68000, paid: 25000, due: 43000, dueDate: '31 Aug, 2024' },
    paymentHistory: [
      { id: 'PAY-006', date: '2024-06-20', amount: 25000, notes: 'First installment' },
    ],
  },
};

export const usersData = {
  students: [
    { id: 'STU-001', name: 'Rohan Sharma', grade: '10th', medium: 'English', parentName: 'Mr. Sharma', parentContact: '9876543210', email: 'rohan.sharma@example.com', dateOfBirth: '2007-07-27', dateJoined: '2021-06-15', username: '9876543210', password: 'rohan27072007', totalAnnualFees: 75000 },
    { id: 'STU-002', name: 'Priya Singh', grade: '10th', medium: 'English', parentName: 'Ms. Singh', parentContact: '9876543211', email: 'priya.singh@example.com', dateOfBirth: '2007-05-15', dateJoined: '2021-06-15', username: '9876543211', password: 'priya15052007', totalAnnualFees: 75000 },
    { id: 'STU-003', name: 'Amit Patel', grade: '9th', medium: 'Semi-English', parentName: 'Mr. Patel', parentContact: '9876543212', email: 'amit.patel@example.com', dateOfBirth: '2008-09-01', dateJoined: '2022-04-01', username: '9876543212', password: 'amit01092008', totalAnnualFees: 68000 },
  ],
  teachers: [
    { id: 'TCH-001', name: 'Mrs. Davis', subject: 'Mathematics', email: 'davis@example.com', username: 'davis@example.com', password: 'password123' },
    { id: 'TCH-002', name: 'Mr. Khan', subject: 'Science', email: 'khan@example.com', username: 'khan@example.com', password: 'password123' },
    { id: 'TCH-003', name: 'Ms. Joshi', subject: 'English', email: 'joshi@example.com', username: 'joshi@example.com', password: 'password123' },
  ]
};

export const initialAnnouncementsData: { id: string; title: string; message: string; date: string }[] = [
  {
    id: 'AN-1',
    title: 'Holiday Declared',
    message: 'School will be closed tomorrow on account of a regional festival.',
    date: subDays(today, 1).toISOString(),
  },
  {
    id: 'AN-2',
    title: 'Annual Sports Day',
    message: 'The annual sports day will be held next Friday. All students are requested to participate.',
    date: subDays(today, 3).toISOString(),
  }
];

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


const monthlyFees = [
    { month: 'August 2024', invoiceId: 'INV-2024004', total: 5000, paid: 0, status: 'Due', dueDate: '31 Aug, 2024' },
    { month: 'July 2024', invoiceId: 'INV-2024003', total: 25000, paid: 25000, status: 'Paid', dueDate: '30 Jul, 2024' },
    { month: 'June 2024', invoiceId: 'INV-2024002', total: 20000, paid: 20000, status: 'Paid', dueDate: '15 Jun, 2024' },
    { month: 'May 2024', invoiceId: null, total: 0, paid: 0, status: 'No Dues', dueDate: null },
    { month: 'April 2024', invoiceId: 'INV-2024001', total: 25000, paid: 25000, status: 'Paid', dueDate: '15 Apr, 2024' },
];

const feeSummary = monthlyFees.reduce((acc, fee) => {
    acc.total += fee.total;
    acc.paid += fee.paid;
    return acc;
}, { total: 0, paid: 0 });

const dueAmount = feeSummary.total - feeSummary.paid;
const nextDueItem = monthlyFees.find(f => f.status === 'Due');

export const feeData = {
  summary: {
    total: feeSummary.total,
    paid: feeSummary.paid,
    due: dueAmount,
    dueDate: nextDueItem ? nextDueItem.dueDate : 'N/A',
  },
  monthlyBreakdown: monthlyFees,
};

export const usersData = {
  students: [
    { id: 'STU-001', name: 'Rohan Sharma', grade: '10th', parentName: 'Mr. Sharma', parentContact: '9876543210', email: 'rohan.sharma@example.com', dateOfBirth: '2007-07-27', username: '9876543210', password: 'rohan27072007' },
    { id: 'STU-002', name: 'Priya Singh', grade: '10th', parentName: 'Ms. Singh', parentContact: '9876543211', email: 'priya.singh@example.com', dateOfBirth: '2007-05-15', username: '9876543211', password: 'priya15052007' },
    { id: 'STU-003', name: 'Amit Patel', grade: '9th', parentName: 'Mr. Patel', parentContact: '9876543212', email: 'amit.patel@example.com', dateOfBirth: '2008-09-01', username: '9876543212', password: 'amit01092008' },
  ],
  teachers: [
    { id: 'TCH-001', name: 'Mrs. Davis', subject: 'Mathematics', email: 'davis@example.com', username: 'davis@example.com', password: 'password123' },
    { id: 'TCH-002', name: 'Mr. Khan', subject: 'Science', email: 'khan@example.com', username: 'khan@example.com', password: 'password123' },
    { id: 'TCH-003', name: 'Ms. Joshi', subject: 'English', email: 'joshi@example.com', username: 'joshi@example.com', password: 'password123' },
  ]
};
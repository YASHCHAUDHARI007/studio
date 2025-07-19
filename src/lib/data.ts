import { format } from 'date-fns';

const today = new Date('2024-07-26T12:00:00Z');

export const studentData = {
  summary: {
    studentName: 'Anjali Kulkarni',
    overallGrade: 'A-',
    attendance: '95%',
    upcomingAssignments: 3,
  },
  performance: [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 88 },
    { subject: 'History', score: 78 },
    { subject: 'Marathi', score: 95 },
  ],
};

export const initialScheduleData = {
    "10th-English": {
        "Monday": [
            { id: "1", time: "09:00", subject: "Mathematics", type: "class" },
            { id: "2", time: "10:00", subject: "Physics", type: "class" },
            { id: "3", time: "11:00", subject: "Chemistry", type: "class" },
            { id: "4", time: "13:00", subject: "English", type: "class" },
        ],
        "Tuesday": [
            { id: "5", time: "09:00", subject: "Mathematics", type: "class" },
            { id: "6", time: "10:00", subject: "Biology", type: "class" },
            { id: "7", time: "11:00", subject: "History", type: "class" },
            { id: "8", time: "13:00", subject: "Geography", type: "class" },
        ],
        "Wednesday": [
            { id: "9", time: "09:00", subject: "Physics", type: "class" },
            { id: "10", time: "10:00", subject: "Chemistry", type: "class" },
            { id: "11", time: "11:00", subject: "English", type: "class" },
            { id: "12", time: "13:00", subject: "Mathematics", type: "class" },
        ],
        "Thursday": [
            { id: "13", time: "09:00", subject: "Biology", type: "class" },
            { id: "14", time: "10:00", subject: "History", type: "class" },
            { id: "15", time: "11:00", subject: "Geography", type: "class" },
            { id: "16", time: "13:00", subject: "Physics", type: "class" },
        ],
        "Friday": [
            { id: "17", time: "09:00", subject: "Chemistry Lab", type: "lab" },
            { id: "18", time: "11:00", subject: "Mathematics", type: "class" },
            { id: "19", time: "13:00", subject: "English", type: "class" },
        ],
        "Saturday": [],
        "Sunday": [],
    }
}


export const initialDocumentsData = [
  {
    id: 1,
    title: 'Algebra Chapter 5 Notes',
    subject: 'Mathematics',
    uploadDate: format(new Date('2024-07-24T12:00:00Z'), 'dd MMM, yyyy'),
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
  {
    id: 2,
    title: 'Thermodynamics Summary',
    subject: 'Physics',
    uploadDate: format(new Date('2024-07-21T12:00:00Z'), 'dd MMM, yyyy'),
    url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  },
  {
    id: 3,
    title: 'Indian Independence Movement',
    subject: 'History',
    uploadDate: format(new Date('2024-07-16T12:00:00Z'), 'dd MMM, yyyy'),
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
    date: '2024-07-12',
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
    date: '2024-07-19',
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
    date: '2024-07-19',
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
    date: '2024-07-26',
    time: '14:00',
    totalMarks: 25,
    status: 'Upcoming',
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


export const initialTestResultsData = {
    "TEST-001": {
        'STU-001': { id: 'TR-1', testId: 'TEST-001', studentId: 'STU-001', studentName: 'Rohan Sharma', score: 92 },
        'STU-002': { id: 'TR-2', testId: 'TEST-001', studentId: 'STU-002', studentName: 'Priya Singh', score: 88 },
    },
    "TEST-002": {
        'STU-001': { id: 'TR-3', testId: 'TEST-002', studentId: 'STU-001', studentName: 'Rohan Sharma', score: 43 },
        'STU-002': { id: 'TR-4', testId: 'TEST-002', studentId: 'STU-002', studentName: 'Priya Singh', score: 46 },
    },
    "TEST-003": {
         'STU-003': { id: 'TR-5', testId: 'TEST-003', studentId: 'STU-003', studentName: 'Amit Patel', score: 38 },
    }
}


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
  students: {
    'STU-001': { id: 'STU-001', name: 'Rohan Sharma', grade: '10th', medium: 'English', parentName: 'Mr. Sharma', parentContact: '9876543210', email: 'rohan.sharma@example.com', dateOfBirth: '2007-07-27', dateJoined: '2021-06-15', username: '9876543210', password: 'rohan27072007', totalAnnualFees: 75000 },
    'STU-002': { id: 'STU-002', name: 'Priya Singh', grade: '10th', medium: 'English', parentName: 'Ms. Singh', parentContact: '9876543211', email: 'priya.singh@example.com', dateOfBirth: '2007-05-15', dateJoined: '2021-06-15', username: '9876543211', password: 'priya15052007', totalAnnualFees: 75000 },
    'STU-003': { id: 'STU-003', name: 'Amit Patel', grade: '9th', medium: 'Semi-English', parentName: 'Mr. Patel', parentContact: '9876543212', email: 'amit.patel@example.com', dateOfBirth: '2008-09-01', dateJoined: '2022-04-01', username: '9876543212', password: 'amit01092008', totalAnnualFees: 68000 },
  },
  teachers: {
    'TCH-001': { id: 'TCH-001', name: 'Mrs. Davis', subject: 'Mathematics', email: 'davis@example.com', username: 'davis@example.com', password: 'password123' },
    'TCH-002': { id: 'TCH-002', name: 'Mr. Khan', subject: 'Science', email: 'khan@example.com', username: 'khan@example.com', password: 'password123' },
    'TCH-003': { id: 'TCH-003', name: 'Ms. Joshi', subject: 'English', email: 'joshi@example.com', username: 'joshi@example.com', password: 'password123' },
    'TCH-004': { id: 'TCH-004', name: 'Yash Chaudhari', subject: 'IT', email: 'yashchaudhari478@gmail.com', username: 'yashchaudhari478@gmail.com', password: 'samarth@12345' },
  }
};

export const initialAnnouncementsData = {
  'AN-1': {
    id: 'AN-1',
    title: 'Holiday Declared',
    message: 'School will be closed tomorrow on account of a regional festival.',
    date: new Date('2024-07-25T12:00:00Z').toISOString(),
  },
  'AN-2': {
    id: 'AN-2',
    title: 'Annual Sports Day',
    message: 'The annual sports day will be held next Friday. All students are requested to participate.',
    date: new Date('2024-07-23T12:00:00Z').toISOString(),
  }
};


export const initialAttendanceData = {};

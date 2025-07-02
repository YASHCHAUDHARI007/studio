'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { studentData, initialTestResultsData, initialTestsData, usersData } from "@/lib/data"
import { format } from "date-fns"

export default function StudentDashboard() {
  const { summary, schedule, performance } = studentData;
  const [currentUser, setCurrentUser] = React.useState<{type: string, id: string, name: string, grade?: string, medium?: string} | null>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const studentDetails = usersData.students.find(s => s.id === userData.id);
      if(studentDetails) {
        setCurrentUser({...userData, grade: studentDetails.grade, medium: studentDetails.medium });
      } else {
        setCurrentUser(userData);
      }
    }
  }, []);

  const studentResults = initialTestResultsData
    .filter(r => r.studentId === currentUser?.id)
    .map(result => {
        const test = initialTestsData.find(t => t.id === result.testId);
        return {
            ...result,
            testName: test?.testName || 'N/A',
            subject: test?.subject || 'N/A',
            date: test ? format(new Date(test.date), 'dd MMM, yyyy') : 'N/A',
            totalMarks: test?.totalMarks || 100,
        };
    })
    .slice(0, 3);
  
  const upcomingTests = (currentUser?.grade && currentUser?.medium)
  ? initialTestsData.filter(t => t.status === 'Upcoming' && t.grade === currentUser.grade && t.medium === currentUser.medium) 
  : [];


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes and activities for today.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {schedule.map((item) => (
                    <TableRow key={item.time}>
                    <TableCell className="font-medium">{item.time}</TableCell>
                    <TableCell>
                        <Badge variant={item.type === 'class' ? 'default' : 'secondary'}>{item.subject}</Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Upcoming Tests</CardTitle>
            <CardDescription>Tests you need to prepare for.</CardDescription>
            </CardHeader>
            <CardContent>
            {upcomingTests.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Test</TableHead>
                            <TableHead>Subject</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {upcomingTests.map((test) => (
                        <TableRow key={test.id}>
                            <TableCell>{format(new Date(test.date), 'dd MMM, yyyy')}</TableCell>
                            <TableCell className="font-medium">{test.testName}</TableCell>
                            <TableCell>{test.subject}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground">No upcoming tests scheduled.</p>
            )}
            </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Welcome back, {summary.studentName}!</CardTitle>
                <CardDescription>Here's a quick summary of your progress.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Overall Grade</h3>
                    <p className="text-3xl font-bold">{summary.overallGrade}</p>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Attendance</h3>
                    <p className="text-3xl font-bold">{summary.attendance}</p>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Upcoming Tests</h3>
                    <p className="text-3xl font-bold">{upcomingTests.length}</p>
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>A summary of your most recent test scores.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {studentResults.map((result) => (
                    <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.subject}</TableCell>
                    <TableCell>{result.testName}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant={result.score/result.totalMarks > 0.85 ? "default" : result.score/result.totalMarks > 0.60 ? "secondary" : "destructive"}>
                        {result.score} / {result.totalMarks} ({((result.score / result.totalMarks) * 100).toFixed(0)}%)
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  )
}


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
import { Badge } from "@/components/ui/badge"
import { studentData } from "@/lib/data"
import { format } from "date-fns"
import { useShikshaData } from '@/hooks/use-shiksha-data'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudentDashboard() {
  const { summary } = studentData;
  const { data, loading } = useShikshaData();
  const [currentUser, setCurrentUser] = React.useState<{type: string, id: string, name: string, grade?: string, medium?: string} | null>(null);
  const [todaysSchedule, setTodaysSchedule] = React.useState<any[]>([]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser(userData);
    }
  }, []);

  React.useEffect(() => {
    if (data && currentUser) {
      const studentDetails = data.students[currentUser.id];
      if (studentDetails) {
          setCurrentUser(prev => ({ ...prev!, grade: studentDetails.grade, medium: studentDetails.medium }));
      }
      const today = format(new Date(), 'eeee');
      const batchKey = studentDetails ? `${studentDetails.grade}-${studentDetails.medium}` : '';
      const scheduleForToday = data.schedules[batchKey]?.[today] || [];
      setTodaysSchedule(Object.values(scheduleForToday).sort((a:any,b:any) => a.time.localeCompare(b.time)));
    }
  }, [data, currentUser]);

  if (loading || !data || !currentUser) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <div className="grid gap-6 lg:grid-cols-3">
                <Skeleton className="h-64 w-full lg:col-span-2" />
                <Skeleton className="h-64 w-full" />
            </div>
             <Skeleton className="h-48 w-full" />
        </div>
    )
  }
  
  const studentResults = Object.values(data.testResults)
    .flatMap((test: any) => Object.values(test))
    .filter((r: any) => r.studentId === currentUser.id)
    .map((result: any) => {
        const test = data.tests.find((t: any) => t.id === result.testId);
        return {
            ...result,
            testName: test?.testName || 'N/A',
            subject: test?.subject || 'N/A',
            date: test ? format(new Date(`${test.date}T00:00:00Z`), 'dd MMM, yyyy') : 'N/A',
            totalMarks: test?.totalMarks || 100,
        };
    })
    .slice(0, 3);
  
  const upcomingTests = currentUser.grade && currentUser.medium
  ? Object.values(data.tests).filter((t: any) => t.status === 'Upcoming' && t.grade === currentUser.grade && t.medium === currentUser.medium) 
  : [];
  
  const formatTime12Hour = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minuteString = m < 10 ? '0' + m : String(m);
    return `${hour12}:${minuteString} ${ampm}`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Welcome back, {currentUser?.name || 'Student'}!</CardTitle>
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

        <Card className="lg:col-span-2">
            <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes and activities for today.</CardDescription>
            </CardHeader>
            <CardContent>
            {todaysSchedule.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {todaysSchedule.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{formatTime12Hour(item.time)}</TableCell>
                        <TableCell>
                            <Badge variant={item.type === 'class' ? 'default' : 'secondary'}>{item.subject}</Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No classes scheduled for today. Enjoy your day!</p>
            )}
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
                    {upcomingTests.map((test: any) => (
                        <TableRow key={test.id}>
                            <TableCell>{format(new Date(`${test.date}T00:00:00Z`), 'dd MMM, yyyy')}</TableCell>

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
                {studentResults.map((result: any) => (
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

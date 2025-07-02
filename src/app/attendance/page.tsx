
'use client'

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { usersData } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Check, Save } from "lucide-react"
import { format, startOfDay } from "date-fns"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

type AttendanceRecords = {
  [date: string]: {
    [studentId: string]: 'present' | 'absent'
  }
}

export default function AttendancePage() {
  const [currentUser, setCurrentUser] = React.useState<{type: string, id: string} | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (currentUser?.type === 'student') {
    return <StudentAttendanceView studentId={currentUser.id} />
  }
  
  if (currentUser?.type === 'teacher' || currentUser?.type === 'superadmin') {
    return <TeacherAttendanceView />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>You do not have permission to view this page.</CardDescription>
      </CardHeader>
    </Card>
  )
}

function StudentAttendanceView({ studentId }: { studentId: string }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecords>({});
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedRecords = localStorage.getItem('shiksha-attendance');
        setAttendanceRecords(savedRecords ? JSON.parse(savedRecords) : {});
    }
  }, []);

  const { presentDays, absentDays } = React.useMemo(() => {
    const present: Date[] = [];
    const absent: Date[] = [];

    Object.entries(attendanceRecords).forEach(([dateStr, dailyRecords]) => {
      const status = dailyRecords[studentId];
      if (status === 'present') {
        present.push(new Date(dateStr));
      } else if (status === 'absent') {
        absent.push(new Date(dateStr));
      }
    });
    
    return { presentDays: present, absentDays: absent };
  }, [attendanceRecords, studentId]);

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>My Attendance Record</CardTitle>
          <CardDescription>
            View your monthly attendance record.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              present: presentDays,
              absent: absentDays,
            }}
            modifiersClassNames={{
              present: 'bg-primary/20 text-primary rounded-full',
              absent: 'bg-destructive/20 text-destructive rounded-full',
            }}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary/30"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive/20 border border-destructive/30"></div>
              <span className="text-sm">Absent</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground"></div>
              <span className="text-sm">Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherAttendanceView() {
    const { toast } = useToast()
    const [allStudents, setAllStudents] = React.useState(usersData.students)
    const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecords>({});
    
    const [selectedGrade, setSelectedGrade] = React.useState<string>('')
    const [selectedMedium, setSelectedMedium] = React.useState<string>('')
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
    
    const [currentAttendance, setCurrentAttendance] = React.useState<Record<string, 'present' | 'absent'>>({});

    React.useEffect(() => {
        const savedStudents = localStorage.getItem('shiksha-students');
        setAllStudents(savedStudents ? JSON.parse(savedStudents) : usersData.students);

        const savedRecords = localStorage.getItem('shiksha-attendance');
        setAttendanceRecords(savedRecords ? JSON.parse(savedRecords) : {});
    }, []);

    const studentsInBatch = React.useMemo(() => {
        return allStudents.filter(s => s.grade === selectedGrade && s.medium === selectedMedium);
    }, [allStudents, selectedGrade, selectedMedium]);
    
    React.useEffect(() => {
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        const dailyRecords = attendanceRecords[dateKey] || {};
        setCurrentAttendance(dailyRecords);
    }, [selectedDate, selectedGrade, selectedMedium, attendanceRecords]);


    const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
        setCurrentAttendance(prev => ({...prev, [studentId]: status}));
    }

    const handleSaveAttendance = () => {
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        const updatedRecords = {
            ...attendanceRecords,
            [dateKey]: {
                ...attendanceRecords[dateKey],
                ...currentAttendance
            }
        };

        const hasUnmarked = studentsInBatch.some(s => !currentAttendance[s.id]);
        if(hasUnmarked) {
             toast({
                variant: 'destructive',
                title: "Incomplete Attendance",
                description: "Please mark attendance for all students before saving.",
            })
            return;
        }

        setAttendanceRecords(updatedRecords);
        localStorage.setItem('shiksha-attendance', JSON.stringify(updatedRecords));

        toast({
            title: "Attendance Saved",
            description: `Attendance for ${selectedGrade} grade on ${format(selectedDate, 'PPP')} has been saved.`,
        })
    }
    
    const grades = [...new Set(allStudents.map(s => s.grade))].sort();
    const mediums = [...new Set(allStudents.map(s => s.medium))].sort();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>
                Select a batch and date to mark attendance for students.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Grade</Label>
                        <Select onValueChange={setSelectedGrade} value={selectedGrade}>
                            <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                            <SelectContent>
                                {grades.map(grade => <SelectItem key={grade} value={grade}>{grade} Grade</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Medium</Label>
                        <Select onValueChange={setSelectedMedium} value={selectedMedium}>
                            <SelectTrigger><SelectValue placeholder="Select Medium" /></SelectTrigger>
                            <SelectContent>
                               {mediums.map(medium => <SelectItem key={medium} value={medium}>{medium}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={selectedDate} onSelect={(d) => setSelectedDate(d || new Date())} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {selectedGrade && selectedMedium ? (
                    studentsInBatch.length > 0 ? (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInBatch.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                value={currentAttendance[student.id]}
                                                onValueChange={(value) => handleStatusChange(student.id, value as 'present' | 'absent')}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="present" id={`present-${student.id}`} />
                                                    <Label htmlFor={`present-${student.id}`}>Present</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                                                    <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                                                </div>
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveAttendance}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Attendance
                            </Button>
                        </div>
                    </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                           <p className="text-muted-foreground">No students found for the selected batch.</p>
                        </div>
                    )
                ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Please select a grade and medium to view students.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

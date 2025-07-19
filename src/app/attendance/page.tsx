
'use client'

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
import { Calendar as CalendarIcon, Save, PartyPopper } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useShikshaData } from "@/hooks/use-shiksha-data"

// Type definitions
type DailyStudentRecords = {
  [studentId: string]: 'present' | 'absent'
}
type HolidayRecord = {
  isHoliday: true
  reason?: string
}
type AttendanceRecords = {
  [date: string]: DailyStudentRecords | HolidayRecord
}

export default function AttendancePage() {
  const [currentUser, setCurrentUser] = React.useState<{type: string, id: string} | null>(null)
  const [isLoadingUser, setIsLoadingUser] = React.useState(true)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
      setIsLoadingUser(false)
    }
  }, [])

  if (isLoadingUser) {
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
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const {data, loading} = useShikshaData();

  const attendanceRecords: AttendanceRecords = data?.attendance || {}

  React.useEffect(() => {
    setDate(new Date());
  }, []);

  const { presentDays, absentDays, holidayDays, holidayReasons } = React.useMemo(() => {
    const present: Date[] = [];
    const absent: Date[] = [];
    const holiday: Date[] = [];
    const reasons: { [date: string]: string } = {};

    Object.entries(attendanceRecords).forEach(([dateStr, dailyRecords]) => {
      const parsedDate = new Date(dateStr);
      if ('isHoliday' in dailyRecords && dailyRecords.isHoliday) {
        holiday.push(parsedDate);
        if (dailyRecords.reason) {
          reasons[dateStr] = dailyRecords.reason;
        }
      } else {
        const status = (dailyRecords as DailyStudentRecords)[studentId];
        if (status === 'present') {
          present.push(parsedDate);
        } else if (status === 'absent') {
          absent.push(parsedDate);
        }
      }
    });
    
    return { presentDays: present, absentDays: absent, holidayDays: holiday, holidayReasons: reasons };
  }, [attendanceRecords, studentId]);
  
  const selectedDateStr = date ? format(startOfDay(date), 'yyyy-MM-dd') : '';
  const holidayReasonForSelectedDate = holidayReasons[selectedDateStr];

  if(loading) {
    return <div className="flex justify-center"><Skeleton className="h-[400px] w-full max-w-2xl" /></div>
  }

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
              holiday: holidayDays,
            }}
            modifiersClassNames={{
              present: 'bg-primary/20 text-primary rounded-full',
              absent: 'bg-destructive/20 text-destructive rounded-full',
              holiday: 'bg-accent text-accent-foreground rounded-full',
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
              <div className="h-4 w-4 rounded-full bg-accent border border-accent/30"></div>
              <span className="text-sm">Holiday</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground"></div>
              <span className="text-sm">Selected</span>
            </div>
          </div>
        </CardContent>
        {holidayReasonForSelectedDate && (
          <CardFooter className="flex-col items-start border-t pt-4">
              <p className="text-sm font-semibold">Holiday Reason:</p>
              <p className="text-sm text-muted-foreground">{holidayReasonForSelectedDate}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function TeacherAttendanceView() {
    const { toast } = useToast()
    const { data, loading, saveData } = useShikshaData();
    
    const [selectedGrade, setSelectedGrade] = React.useState<string>('')
    const [selectedMedium, setSelectedMedium] = React.useState<string>('')
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
    
    const [currentAttendance, setCurrentAttendance] = React.useState<Record<string, 'present' | 'absent'>>({});
    
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = React.useState(false);
    const [holidayReason, setHolidayReason] = React.useState('');

    React.useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    const allStudents = data ? Object.values(data.students) : [];
    const attendanceRecords: AttendanceRecords = data?.attendance || {};

    const studentsInBatch = React.useMemo(() => {
        return allStudents.filter(s => s.grade === selectedGrade && s.medium === selectedMedium);
    }, [allStudents, selectedGrade, selectedMedium]);
    
    React.useEffect(() => {
        if (!selectedDate) return;
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        const dailyRecords = attendanceRecords[dateKey] || {};
        if (!('isHoliday' in dailyRecords)) {
            setCurrentAttendance(dailyRecords as DailyStudentRecords);
        } else {
            setCurrentAttendance({});
        }
    }, [selectedDate, selectedGrade, selectedMedium, attendanceRecords]);


    const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
        setCurrentAttendance(prev => ({...prev, [studentId]: status}));
    }

    const handleSaveAttendance = () => {
        if (!selectedDate) return;
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');

        const hasUnmarked = studentsInBatch.some(s => !currentAttendance[s.id]);
        if(hasUnmarked) {
             toast({
                variant: 'destructive',
                title: "Incomplete Attendance",
                description: "Please mark attendance for all students before saving.",
            })
            return;
        }

        const path = `attendance/${dateKey}`;
        saveData(path, currentAttendance);

        toast({
            title: "Attendance Saved",
            description: `Attendance for ${selectedGrade} grade on ${format(selectedDate, 'PPP')} has been saved.`,
        })
    }
    
    const dateKey = selectedDate ? format(startOfDay(selectedDate), 'yyyy-MM-dd') : '';
    const dayRecord = dateKey ? attendanceRecords[dateKey] : undefined;
    const isHoliday = dayRecord && 'isHoliday' in dayRecord;
    const currentHolidayReason = isHoliday ? (dayRecord as HolidayRecord).reason : '';

    const handleMarkAsHoliday = () => {
        if (!selectedDate) return;
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        const holidayData = {
            isHoliday: true,
            reason: holidayReason
        };

        saveData(`attendance/${dateKey}`, holidayData);

        toast({
            title: "Holiday Marked",
            description: `${format(selectedDate, 'PPP')} has been marked as a holiday.`,
        });
        setIsHolidayDialogOpen(false);
        setHolidayReason('');
    };

    const handleUnmarkHoliday = () => {
        if (!selectedDate) return;
        const dateKey = format(startOfDay(selectedDate), 'yyyy-MM-dd');
        
        saveData(`attendance/${dateKey}`, null); // Remove the holiday entry

        toast({
            title: "Holiday Removed",
            description: `The holiday on ${format(selectedDate, 'PPP')} has been removed.`,
        });
    };
    
    if (loading) {
      return (
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent><Skeleton className="h-64 w-full" /></CardContent>
        </Card>
      )
    }

    const grades = [...new Set(allStudents.map(s => s.grade))].sort();
    const mediums = [...new Set(allStudents.map(s => s.medium))].sort();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>
                Select a batch and date to mark attendance for students, or mark a day as a holiday.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
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
                                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex justify-end">
                    {isHoliday ? (
                        <Button variant="outline" onClick={handleUnmarkHoliday}>Unmark as Holiday</Button>
                    ) : (
                        <Dialog open={isHolidayDialogOpen} onOpenChange={setIsHolidayDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline"><PartyPopper className="mr-2 h-4 w-4" /> Mark as Holiday</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Mark {selectedDate ? format(selectedDate, 'PPP') : ''} as a holiday?</DialogTitle>
                                    <DialogDescription>This will apply to all grades. No attendance can be marked for this day.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <Label htmlFor="holiday-reason">Reason (Optional)</Label>
                                    <Input id="holiday-reason" value={holidayReason} onChange={(e) => setHolidayReason(e.target.value)} placeholder="e.g., National Festival" />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                    <Button onClick={handleMarkAsHoliday}>Save Holiday</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {isHoliday ? (
                     <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                        <div className="text-center text-muted-foreground">
                            <PartyPopper className="mx-auto h-8 w-8 text-accent" />
                            <p className="font-semibold">This day is marked as a holiday.</p>
                            {currentHolidayReason && <p>Reason: {currentHolidayReason}</p>}
                        </div>
                    </div>
                ) : selectedGrade && selectedMedium ? (
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
                            <Button onClick={handleSaveAttendance} disabled={!selectedDate}>
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

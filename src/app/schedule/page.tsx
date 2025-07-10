
'use client'

import * as React from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { initialScheduleData, usersData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const scheduleEntrySchema = z.object({
  id: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
  subject: z.string().min(1, 'Subject is required'),
  type: z.enum(['class', 'lab']),
})

type ScheduleEntry = z.infer<typeof scheduleEntrySchema>
type Schedule = { [day: string]: ScheduleEntry[] }
type AllSchedules = { [batchKey: string]: Schedule }

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const [currentUser, setCurrentUser] = React.useState<{type: string, id?: string; name?: string; grade?: string; medium?: string;} | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
         if (userData.type === 'student') {
            const studentDetails = usersData.students.find(s => s.id === userData.id);
            setCurrentUser(studentDetails ? { ...userData, grade: studentDetails.grade, medium: studentDetails.medium } : userData);
        } else {
           setCurrentUser(userData);
        }
      }
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (currentUser?.type === 'student') {
    return <StudentScheduleView student={currentUser} />
  }

  if (currentUser?.type === 'teacher' || currentUser?.type === 'superadmin') {
    return <TeacherScheduleView />
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

function StudentScheduleView({ student }: { student: any }) {
  const [allSchedules, setAllSchedules] = React.useState<AllSchedules>({})

  React.useEffect(() => {
     const savedSchedules = localStorage.getItem('shiksha-schedule');
     setAllSchedules(savedSchedules ? JSON.parse(savedSchedules) : initialScheduleData);
  }, [])
  
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

  const batchKey = `${student.grade}-${student.medium}`;
  const studentSchedule = allSchedules[batchKey] || {};

  return (
     <Card>
        <CardHeader>
            <CardTitle>My Weekly Schedule</CardTitle>
            <CardDescription>Your class schedule for the week for {student.grade} Grade ({student.medium}).</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="Monday" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
                    {daysOfWeek.map(day => <TabsTrigger key={day} value={day}>{day.substring(0,3)}</TabsTrigger>)}
                </TabsList>
                {daysOfWeek.map(day => (
                    <TabsContent key={day} value={day}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentSchedule[day] && studentSchedule[day].length > 0 ? (
                                    studentSchedule[day]
                                        .sort((a,b) => a.time.localeCompare(b.time))
                                        .map(entry => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">{formatTime12Hour(entry.time)}</TableCell>
                                                <TableCell>{entry.subject}</TableCell>
                                                <TableCell><Badge variant={entry.type === 'class' ? 'default' : 'secondary'}>{entry.type}</Badge></TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">No classes scheduled for {day}.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                ))}
            </Tabs>
        </CardContent>
     </Card>
  )
}

function TeacherScheduleView() {
    const { toast } = useToast()
    const [allStudents, setAllStudents] = React.useState(usersData.students)
    const [allSchedules, setAllSchedules] = React.useState<AllSchedules>(initialScheduleData);

    const [selectedGrade, setSelectedGrade] = React.useState<string>('')
    const [selectedMedium, setSelectedMedium] = React.useState<string>('')
    
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingEntry, setEditingEntry] = React.useState<ScheduleEntry | null>(null);
    const [selectedDay, setSelectedDay] = React.useState<string>('');
    
    const [entryToDelete, setEntryToDelete] = React.useState<{day: string, id: string} | null>(null)
    
    const form = useForm<ScheduleEntry>({ resolver: zodResolver(scheduleEntrySchema) });

    React.useEffect(() => {
        const savedSchedules = localStorage.getItem('shiksha-schedule');
        setAllSchedules(savedSchedules ? JSON.parse(savedSchedules) : initialScheduleData);
    }, []);

    React.useEffect(() => {
        localStorage.setItem('shiksha-schedule', JSON.stringify(allSchedules));
    }, [allSchedules]);

    const batchKey = selectedGrade && selectedMedium ? `${selectedGrade}-${selectedMedium}` : '';
    const currentSchedule = allSchedules[batchKey] || daysOfWeek.reduce((acc, day) => ({...acc, [day]: []}), {});
    
    const grades = [...new Set(allStudents.map(s => s.grade))].sort();
    const mediums = [...new Set(allStudents.map(s => s.medium))].sort();
    
    const handleOpenForm = (day: string, entry: ScheduleEntry | null) => {
        setSelectedDay(day);
        setEditingEntry(entry);
        form.reset(entry || { time: '', subject: '', type: 'class'});
        setIsFormOpen(true);
    };

    const handleFormSubmit = (data: ScheduleEntry) => {
        if (!batchKey || !selectedDay) return;

        const newEntry = { ...data, id: editingEntry ? editingEntry.id : `E-${Date.now()}` };

        setAllSchedules(prev => {
            const updatedDaySchedule = editingEntry
                ? currentSchedule[selectedDay].map(e => e.id === newEntry.id ? newEntry : e)
                : [...(currentSchedule[selectedDay] || []), newEntry];

            return {
                ...prev,
                [batchKey]: {
                    ...currentSchedule,
                    [selectedDay]: updatedDaySchedule,
                }
            };
        });

        toast({ title: editingEntry ? "Entry Updated" : "Entry Added", description: `Schedule for ${selectedDay} has been updated.` });
        setIsFormOpen(false);
    };
    
    const handleDeleteEntry = () => {
        if (!entryToDelete || !batchKey) return;
        const { day, id } = entryToDelete;
        
        setAllSchedules(prev => {
             const updatedDaySchedule = prev[batchKey]?.[day]?.filter(e => e.id !== id) || [];
             return {
                ...prev,
                [batchKey]: {
                    ...prev[batchKey],
                    [day]: updatedDaySchedule,
                }
             }
        });

        toast({ title: "Entry Deleted", description: `Schedule entry for ${day} has been removed.` });
        setEntryToDelete(null);
    };

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
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Class Schedule Management</CardTitle>
                    <CardDescription>Select a batch to view and manage their weekly class schedule.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Grade</Label>
                            <Select onValueChange={setSelectedGrade} value={selectedGrade}>
                                <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                                <SelectContent>{grades.map(grade => <SelectItem key={grade} value={grade}>{grade} Grade</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Medium</Label>
                            <Select onValueChange={setSelectedMedium} value={selectedMedium}>
                                <SelectTrigger><SelectValue placeholder="Select Medium" /></SelectTrigger>
                                <SelectContent>{mediums.map(medium => <SelectItem key={medium} value={medium}>{medium}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    {batchKey ? (
                        <Tabs defaultValue="Monday" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
                                {daysOfWeek.map(day => <TabsTrigger key={day} value={day}>{day}</TabsTrigger>)}
                            </TabsList>
                            {daysOfWeek.map(day => (
                                <TabsContent key={day} value={day}>
                                    <div className="flex justify-end mb-4">
                                        <Button onClick={() => handleOpenForm(day, null)}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
                                        </Button>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentSchedule[day] && currentSchedule[day].length > 0 ? (
                                                currentSchedule[day]
                                                    .sort((a,b) => a.time.localeCompare(b.time))
                                                    .map(entry => (
                                                        <TableRow key={entry.id}>
                                                            <TableCell className="font-medium">{formatTime12Hour(entry.time)}</TableCell>
                                                            <TableCell>{entry.subject}</TableCell>
                                                            <TableCell><Badge variant={entry.type === 'class' ? 'default' : 'secondary'}>{entry.type}</Badge></TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                <Button variant="outline" size="icon" onClick={() => handleOpenForm(day, entry)}><Edit className="h-4 w-4" /></Button>
                                                                <AlertDialogTrigger asChild><Button variant="destructive" size="icon" onClick={() => setEntryToDelete({day, id: entry.id})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                            ) : (
                                                <TableRow><TableCell colSpan={4} className="h-24 text-center">No classes scheduled for {day}.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            ))}
                        </Tabs>
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                            <p className="text-muted-foreground">Please select a grade and medium to manage the schedule.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingEntry ? "Edit" : "Add"} Schedule Entry for {selectedDay}</DialogTitle>
                        <DialogDescription>Enter the details for the class or lab session.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                            <FormField control={form.control} name="time" render={({ field }) => (
                                <FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subject" render={({ field }) => (
                                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Physics" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="class">Class</SelectItem>
                                        <SelectItem value="lab">Lab</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit">Save Entry</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the schedule entry.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEntry}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

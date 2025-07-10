
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
import { PlusCircle, Calendar as CalendarIcon, FilePenLine, BarChart2, CalendarClock, Edit, Trash2 } from "lucide-react"
import { initialTestsData, initialTestResultsData, usersData } from "@/lib/data"
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
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

const scheduleTestSchema = z.object({
  id: z.string().optional(),
  testName: z.string().min(1, 'Test name is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Please select a grade'),
  medium: z.string().min(1, 'Please select a medium'),
  date: z.date({ required_error: "Test date is required." }),
  time: z.string().min(1, 'Test time is required'),
  totalMarks: z.coerce.number().min(1, 'Total marks must be at least 1'),
})

const studentMarkSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  score: z.coerce.number().optional(),
});

const enterMarksSchema = z.object({
  marks: z.array(studentMarkSchema),
});

type Test = z.infer<typeof scheduleTestSchema> & { id: string; status: 'Upcoming' | 'Completed'; date: string }

export default function TestsPage() {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = React.useState<{type: string; id?: string; name?: string; grade?: string; medium?: string;} | null>(null);
  
  const [allStudents, setAllStudents] = React.useState<any[]>([]);

  const [tests, setTests] = React.useState<Test[]>([])
  const [testResults, setTestResults] = React.useState([])
  
  const [isScheduleTestOpen, setIsScheduleTestOpen] = React.useState(false)
  const [isEnterMarksOpen, setIsEnterMarksOpen] = React.useState(false)
  
  const [editingTest, setEditingTest] = React.useState<Test | null>(null)
  const [deletingTestId, setDeletingTestId] = React.useState<string | null>(null)
  const [selectedTestForMarks, setSelectedTestForMarks] = React.useState<Test | null>(null)
  
  const scheduleTestForm = useForm<z.infer<typeof scheduleTestSchema>>({
    resolver: zodResolver(scheduleTestSchema),
    defaultValues: { testName: '', subject: '', grade: '', medium: '', date: undefined, time: '', totalMarks: 100 },
  })

  const enterMarksForm = useForm<z.infer<typeof enterMarksSchema>>({
    defaultValues: { marks: [] },
  });
  
  const { fields, replace } = useFieldArray({
    control: enterMarksForm.control,
    name: "marks",
  });
  
  React.useEffect(() => {
    // This now runs only on the client
    const savedStudents = localStorage.getItem('shiksha-students');
    const currentStudents = savedStudents ? JSON.parse(savedStudents) : usersData.students;
    setAllStudents(currentStudents);

    const savedTests = localStorage.getItem('shiksha-tests');
    setTests(savedTests ? JSON.parse(savedTests) : initialTestsData);

    const savedResults = localStorage.getItem('shiksha-test-results');
    setTestResults(savedResults ? JSON.parse(savedResults) : initialTestResultsData);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.type === 'student') {
            const studentDetails = currentStudents.find((s:any) => s.id === userData.id);
            if (studentDetails) {
                setCurrentUser({ ...userData, grade: studentDetails.grade, medium: studentDetails.medium });
            } else {
                setCurrentUser(userData);
            }
        } else {
            setCurrentUser(userData);
        }
    }
  }, []);

  React.useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem('shiksha-tests', JSON.stringify(tests));
    }
  }, [tests]);

  React.useEffect(() => {
    if (testResults.length > 0) {
      localStorage.setItem('shiksha-test-results', JSON.stringify(testResults));
    }
  }, [testResults]);

  const userType = currentUser?.type;
  const isTeacherOrAdmin = userType === 'teacher' || userType === 'superadmin';

  function handleOpenScheduleForm(test: Test | null) {
    setEditingTest(test)
    if (test) {
        scheduleTestForm.reset({
            ...test,
            date: new Date(`${test.date}T00:00:00Z`),
        });
    } else {
        scheduleTestForm.reset({ testName: '', subject: '', grade: '', medium: '', date: new Date(), time: '', totalMarks: 100 });
    }
    setIsScheduleTestOpen(true);
  }

  function onScheduleTest(data: z.infer<typeof scheduleTestSchema>) {
    const formattedDate = format(data.date, 'yyyy-MM-dd');
    if (editingTest) {
        // Update existing test
        const updatedTest = { ...editingTest, ...data, date: formattedDate, status: new Date(data.date) > new Date() ? 'Upcoming' : 'Completed' } as Test;
        setTests(tests.map(t => t.id === editingTest.id ? updatedTest : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast({ title: "Success", description: "Test has been updated." });
    } else {
        // Add new test
        const newTest: Test = {
            id: `TEST-${String(tests.length + 1).padStart(3, '0')}`,
            ...data,
            date: formattedDate,
            status: new Date(data.date) > new Date() ? 'Upcoming' : 'Completed',
        }
        setTests([newTest, ...tests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast({ title: "Success", description: "New test has been scheduled." })
    }
    
    setIsScheduleTestOpen(false)
    setEditingTest(null)
  }

  function handleDeleteTest() {
    if (!deletingTestId) return;
    setTests(tests.filter(t => t.id !== deletingTestId));
    toast({ title: "Success", description: "Test has been deleted." });
    setDeletingTestId(null);
  }

  function handleOpenEnterMarks(test: Test) {
    const studentsOfBatch = allStudents.filter(s => s.grade === test.grade && s.medium === test.medium);
    if(studentsOfBatch.length === 0) {
      toast({
        variant: "destructive",
        title: "No Students Found",
        description: `There are no students in ${test.grade} grade (${test.medium}) to assign marks.`,
      })
      return;
    }
    
    enterMarksForm.control.register('marks', {
        validate: (value) => {
            if (value.some((v: any) => v.score > test.totalMarks)) {
                return `Score cannot exceed ${test.totalMarks}`
            }
            return true;
        }
    })
    const marksData = studentsOfBatch.map(s => ({ 
        studentId: s.id, 
        studentName: s.name, 
        score: testResults.find((r:any) => r.testId === test.id && r.studentId === s.id)?.score ?? undefined
    }));
    replace(marksData);
    setSelectedTestForMarks(test);
    setIsEnterMarksOpen(true);
  }

  function onEnterMarks(data: z.infer<typeof enterMarksSchema>) {
    if (!selectedTestForMarks) return;

    const invalidScores = data.marks.filter(mark => mark.score !== undefined && mark.score > selectedTestForMarks.totalMarks);
    if (invalidScores.length > 0) {
        toast({
            variant: "destructive",
            title: "Invalid Score",
            description: `One or more scores exceed the total marks of ${selectedTestForMarks.totalMarks}.`,
        });
        return;
    }
    
    const newResults = data.marks
      .filter(mark => mark.score !== undefined && mark.score !== null && mark.score >= 0)
      .map(mark => ({
        id: Math.random(),
        testId: selectedTestForMarks.id,
        studentId: mark.studentId,
        studentName: mark.studentName,
        score: mark.score!,
      }));
    
    const otherResults = testResults.filter((r:any) => r.testId !== selectedTestForMarks.id);
    setTestResults([...otherResults, ...newResults] as any);
    
    toast({ title: "Success", description: "Test results have been saved." });
    setIsEnterMarksOpen(false);
    setSelectedTestForMarks(null);
    enterMarksForm.reset();
  }

  const testsToDisplay = React.useMemo(() => {
    if (userType === 'student' && currentUser?.grade && currentUser?.medium) {
      return tests.filter(test => test.grade === currentUser.grade && test.medium === currentUser.medium);
    }
    return tests;
  }, [tests, userType, currentUser]);

  const completedTests = React.useMemo(() => {
    const allCompleted = tests.filter(t => t.status === 'Completed');
     if (userType === 'student' && currentUser?.grade && currentUser?.medium) {
        return allCompleted.filter(test => test.grade === currentUser.grade && test.medium === currentUser.medium);
     }
     return allCompleted;
  }, [tests, userType, currentUser]);
  
  const [selectedResultTestId, setSelectedResultTestId] = React.useState<string | undefined>(completedTests[0]?.id);
  
  React.useEffect(() => {
    if (completedTests.length > 0 && !selectedResultTestId) {
      setSelectedResultTestId(completedTests[0].id);
    }
  }, [completedTests, selectedResultTestId]);

  
  const selectedTestForResults = tests.find(t => t.id === selectedResultTestId);

  const resultsForSelectedTest = React.useMemo(() => {
    const results = testResults.filter((r:any) => r.testId === selectedResultTestId);
    if (userType === 'student') {
        return results.filter((r:any) => r.studentId === currentUser?.id);
    }
    return results;
  }, [testResults, selectedResultTestId, userType, currentUser]);
  
  let classAverage = 0;
  if (selectedTestForResults && resultsForSelectedTest.length > 0) {
    const totalScore = testResults.filter((r:any) => r.testId === selectedResultTestId).reduce((sum, r:any) => sum + r.score, 0);
    const totalStudentsInTest = testResults.filter((r:any) => r.testId === selectedResultTestId).length;
    classAverage = totalStudentsInTest > 0 ? (totalScore / totalStudentsInTest / selectedTestForResults.totalMarks) * 100 : 0;
  }

  const formatTime12Hour = (timeString: string) => {
    if (!timeString) {
      return '';
    }
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    const minuteString = m < 10 ? '0' + m : String(m);
    return `${h}:${minuteString} ${ampm}`;
  };

  return (
    <>
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="schedule">
            <CalendarClock className="mr-2 h-4 w-4" />
            Test Schedule
          </TabsTrigger>
          <TabsTrigger value="results">
            <BarChart2 className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Test Schedule</CardTitle>
                <CardDescription>
                  View, schedule, and manage all tests.
                </CardDescription>
              </div>
              {isTeacherOrAdmin && (
                 <Button onClick={() => handleOpenScheduleForm(null)} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Test
                 </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Status</TableHead>
                    {isTeacherOrAdmin && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testsToDisplay.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.testName}</TableCell>
                      <TableCell>{test.subject}</TableCell>
                      <TableCell>{test.grade} ({test.medium})</TableCell>
                      <TableCell>{format(new Date(`${test.date}T00:00:00Z`), 'dd MMM, yyyy')} @ {formatTime12Hour(test.time)}</TableCell>
                      <TableCell>{test.totalMarks}</TableCell>
                      <TableCell>
                        <Badge variant={test.status === 'Completed' ? 'secondary' : 'default'}>{test.status}</Badge>
                      </TableCell>
                       {isTeacherOrAdmin && (
                        <TableCell className="text-right space-x-2">
                          {test.status === 'Upcoming' && (
                             <>
                              <Button variant="outline" size="icon" onClick={() => handleOpenScheduleForm(test)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingTestId(test.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </>
                          )}
                          {test.status === 'Completed' && (
                            <Button variant="outline" size="sm" onClick={() => handleOpenEnterMarks(test)}>
                              <FilePenLine className="mr-2 h-4 w-4" />
                              Enter Marks
                            </Button>
                          )}
                        </TableCell>
                       )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
                <CardTitle>View Test Results</CardTitle>
                <CardDescription>
                  Select a completed test to view student performance.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                     <Select value={selectedResultTestId} onValueChange={setSelectedResultTestId}>
                        <SelectTrigger className="w-full sm:max-w-xs">
                            <SelectValue placeholder="Select a completed test" />
                        </SelectTrigger>
                        <SelectContent>
                            {completedTests.map(test => (
                                <SelectItem key={test.id} value={test.id}>{test.testName} ({test.subject} - {test.grade} {test.medium})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedTestForResults && isTeacherOrAdmin && (
                        <div className="flex items-center gap-4 rounded-lg border p-3">
                             <div className="text-center">
                                <p className="text-sm text-muted-foreground">Class Average</p>
                                <p className="text-xl font-bold">{classAverage.toFixed(1)}%</p>
                             </div>
                        </div>
                    )}
                 </div>
                {selectedTestForResults && (
                   <Table>
                        <TableHeader>
                            <TableRow>
                                {isTeacherOrAdmin && <TableHead>Student Name</TableHead>}
                                <TableHead className="text-right">Score</TableHead>
                                <TableHead className="text-right">Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resultsForSelectedTest.length > 0 ? (
                                resultsForSelectedTest.map((result:any) => (
                                    <TableRow key={result.id}>
                                        {isTeacherOrAdmin && <TableCell className="font-medium">{result.studentName}</TableCell>}
                                        <TableCell className="text-right">{result.score} / {selectedTestForResults.totalMarks}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={result.score/selectedTestForResults.totalMarks > 0.85 ? "default" : result.score/selectedTestForResults.totalMarks > 0.60 ? "secondary" : "destructive"}>
                                                {((result.score / selectedTestForResults.totalMarks) * 100).toFixed(1)}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        {userType === 'student' ? "Your result for this test has not been published yet." : "No results entered for this test."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                {!selectedResultTestId && (
                    <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Select a test to see the results.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isScheduleTestOpen} onOpenChange={setIsScheduleTestOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{editingTest ? 'Edit Test' : 'Schedule a New Test'}</DialogTitle>
                <DialogDescription>
                Enter the details for the test.
                </DialogDescription>
            </DialogHeader>
            <Form {...scheduleTestForm}>
                <form onSubmit={scheduleTestForm.handleSubmit(onScheduleTest)} className="space-y-4 py-4">
                <FormField control={scheduleTestForm.control} name="testName" render={({ field }) => (
                    <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input placeholder="e.g., Chapter 5 Quiz" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={scheduleTestForm.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={scheduleTestForm.control} name="grade" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {[...new Set(allStudents.map(s => s.grade))].sort().map(grade => (
                                <SelectItem key={grade} value={grade}>{grade} Grade</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={scheduleTestForm.control} name="medium" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Medium</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select medium" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Semi-English">Semi-English</SelectItem>
                            <SelectItem value="Marathi">Marathi</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={scheduleTestForm.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent></Popover><FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={scheduleTestForm.control} name="time" render={({ field }) => (
                        <FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={scheduleTestForm.control} name="totalMarks" render={({ field }) => (
                    <FormItem><FormLabel>Total Marks</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                    <Button type="submit">Save Test</Button>
                </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={!!deletingTestId} onOpenChange={() => setDeletingTestId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the test and all associated results.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTest}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>

       {selectedTestForMarks && (
          <Dialog open={isEnterMarksOpen} onOpenChange={setIsEnterMarksOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enter Marks for '{selectedTestForMarks.testName}'</DialogTitle>
                    <DialogDescription>
                        Subject: {selectedTestForMarks.subject} | Grade: {selectedTestForMarks.grade} {selectedTestForMarks.medium} | Total Marks: {selectedTestForMarks.totalMarks}
                    </DialogDescription>
                </DialogHeader>
                <Form {...enterMarksForm}>
                    <form onSubmit={enterMarksForm.handleSubmit(onEnterMarks)}>
                    <ScrollArea className="h-80 w-full pr-4">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell className="font-mono text-muted-foreground">{field.studentId}</TableCell>
                                <TableCell className="font-medium">{field.studentName}</TableCell>
                                <TableCell>
                                    <FormField
                                        control={enterMarksForm.control}
                                        name={`marks.${index}.score`}
                                        rules={{ max: { value: selectedTestForMarks.totalMarks, message: `Max ${selectedTestForMarks.totalMarks}`}, min: 0 }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="number" className="w-28 text-right ml-auto" placeholder={`/ ${selectedTestForMarks.totalMarks}`} {...field} />
                                                </FormControl>
                                                <FormMessage className="text-right" />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </ScrollArea>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Save Marks</Button>
                    </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        )}
    </>
  )
}

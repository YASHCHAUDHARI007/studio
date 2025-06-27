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
import { UploadCloud, ExternalLink, PlusCircle, FileText, BarChart2 } from "lucide-react"
import { initialDocumentsData, initialTestResultsData, studentData, usersData } from "@/lib/data"
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

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  url: z.string().url('Please enter a valid Google Drive URL'),
})

const testDetailsSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  testName: z.string().min(1, 'Test name is required'),
  grade: z.string().min(1, 'Please select a grade'),
  medium: z.string().min(1, 'Please select a medium'),
});

const studentMarkSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  score: z.coerce.number().min(0, 'Score must be >= 0').max(100, 'Score must be <= 100'),
});

const bulkResultSchema = z.object({
  marks: z.array(studentMarkSchema),
});


export default function DocumentsPage() {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = React.useState<{type: string; id?: string; name?: string;} | null>(null);
  const [testResults, setTestResults] = React.useState(initialTestResultsData)
  const [documents, setDocuments] = React.useState(initialDocumentsData)
  const [isAddNoteOpen, setIsAddNoteOpen] = React.useState(false)

  // State for the new bulk add dialog
  const [isBulkAddOpen, setIsBulkAddOpen] = React.useState(false)
  const [step, setStep] = React.useState<'details' | 'marks'>('details')
  const [testDetails, setTestDetails] = React.useState<z.infer<typeof testDetailsSchema> | null>(null);

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', subject: '', url: '' },
  })

  const testDetailsForm = useForm<z.infer<typeof testDetailsSchema>>({
    resolver: zodResolver(testDetailsSchema),
    defaultValues: { subject: '', testName: '', grade: '', medium: '' },
  })

  const bulkResultForm = useForm<z.infer<typeof bulkResultSchema>>({
    resolver: zodResolver(bulkResultSchema),
    defaultValues: { marks: [] },
  });
  
  const { fields, replace } = useFieldArray({
    control: bulkResultForm.control,
    name: "marks",
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const userType = currentUser?.type;
  const isTeacherOrAdmin = userType === 'teacher' || userType === 'superadmin'

  // Filter results for student view
  const displayedResults = isTeacherOrAdmin
    ? testResults
    : testResults.filter(r => r.studentId === currentUser?.id);

  const topScore = Math.max(0, ...testResults.map(r => r.score))

  function onAddNote(data: z.infer<typeof noteSchema>) {
    const newNote = {
      id: documents.length + 1,
      ...data,
      uploadDate: format(new Date(), 'dd MMM, yyyy'),
    }
    setDocuments([newNote, ...documents])
    toast({ title: "Success", description: "New study material has been added." })
    setIsAddNoteOpen(false)
    noteForm.reset()
  }

  function onTestDetailsSubmit(data: z.infer<typeof testDetailsSchema>) {
    const filteredStudents = usersData.students.filter(s => s.grade === data.grade);
    if (filteredStudents.length === 0) {
        toast({
            variant: 'destructive',
            title: "No Students Found",
            description: `No students found for grade ${data.grade}. Please check the grade.`,
        });
        return;
    }
    setTestDetails(data);
    const marksData = filteredStudents.map(s => ({ studentId: s.id, studentName: s.name, score: 0 }));
    replace(marksData);
    setStep('marks');
  }

  function onBulkResultSubmit(data: z.infer<typeof bulkResultSchema>) {
    if (!testDetails) return;
    
    const newResults = data.marks.map(mark => ({
      id: testResults.length + Math.random(),
      subject: testDetails.subject,
      testName: `${testDetails.testName} (${testDetails.medium})`,
      date: format(new Date(), 'dd MMM, yyyy'),
      score: mark.score,
      studentId: mark.studentId,
      studentName: mark.studentName,
    }));

    setTestResults([...newResults, ...testResults].sort((a,b) => b.id - a.id));
    toast({ title: "Success", description: "Test results have been added for the class." });
    
    setIsBulkAddOpen(false);
    setStep('details');
    testDetailsForm.reset();
    bulkResultForm.reset();
  }

  const handleBulkAddOpenChange = (open: boolean) => {
    if (!open) {
      setStep('details');
      testDetailsForm.reset();
      bulkResultForm.reset();
    }
    setIsBulkAddOpen(open);
  }

  return (
    <>
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">
            <BarChart2 className="mr-2 h-4 w-4" />
            Test Results
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            Notes & Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  {isTeacherOrAdmin 
                    ? "Performance of all students in recent tests."
                    : `Performance of ${currentUser?.name || 'the student'} in recent tests.`
                  }
                  {' '}Class top score is <span className="font-bold text-primary">{topScore}%</span>.
                </CardDescription>
              </div>
              {isTeacherOrAdmin && (
                 <Dialog open={isBulkAddOpen} onOpenChange={handleBulkAddOpenChange}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Bulk Add Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl">
                    {step === 'details' ? (
                      <>
                        <DialogHeader>
                          <DialogTitle>Add New Test - Step 1: Details</DialogTitle>
                          <DialogDescription>
                            Enter the details for the new test. Students will be filtered based on grade.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...testDetailsForm}>
                          <form onSubmit={testDetailsForm.handleSubmit(onTestDetailsSubmit)} className="space-y-4 py-4">
                            <FormField control={testDetailsForm.control} name="subject" render={({ field }) => (
                              <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Mathematics" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={testDetailsForm.control} name="testName" render={({ field }) => (
                              <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input placeholder="e.g., Chapter 5 Test" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField control={testDetailsForm.control} name="grade" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Grade</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                      {[...new Set(usersData.students.map(s => s.grade))].sort().map(grade => (
                                         <SelectItem key={grade} value={grade}>{grade} Grade</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={testDetailsForm.control} name="medium" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Medium</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a medium" /></SelectTrigger></FormControl>
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
                            <DialogFooter>
                              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                              <Button type="submit">Next: Enter Marks</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </>
                    ) : (
                      <>
                        <DialogHeader>
                          <DialogTitle>Add New Test - Step 2: Enter Marks</DialogTitle>
                          <DialogDescription>
                            Enter the marks for each student for the '{testDetails?.testName}' test in '{testDetails?.subject}'.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...bulkResultForm}>
                          <form onSubmit={bulkResultForm.handleSubmit(onBulkResultSubmit)}>
                            <ScrollArea className="h-72 w-full pr-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead className="text-right">Score (%)</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                      <TableCell className="font-mono text-muted-foreground">{field.studentId}</TableCell>
                                      <TableCell className="font-medium">{field.studentName}</TableCell>
                                      <TableCell className="text-right">
                                        <FormField
                                            control={bulkResultForm.control}
                                            name={`marks.${index}.score`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="number" className="w-24 text-right" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
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
                              <Button type="button" variant="secondary" onClick={() => setStep('details')}>Back</Button>
                              <Button type="submit">Save All Results</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {isTeacherOrAdmin && <TableHead>Student</TableHead>}
                    <TableHead>Subject</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedResults.map((result) => (
                    <TableRow key={result.id}>
                       {isTeacherOrAdmin && <TableCell className="font-medium">{result.studentName}</TableCell>}
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.testName}</TableCell>
                      <TableCell>{result.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={result.score > 85 ? "default" : result.score > 60 ? "secondary" : "destructive"}>
                          {result.score}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Notes & Materials</CardTitle>
                <CardDescription>
                  Download shared notes and study materials.
                </CardDescription>
              </div>
              {isTeacherOrAdmin && (
                <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Note/Material</DialogTitle>
                      <DialogDescription>
                        Provide a title, subject, and a link to the material (e.g., Google Drive).
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...noteForm}>
                      <form onSubmit={noteForm.handleSubmit(onAddNote)} className="space-y-4">
                        <FormField control={noteForm.control} name="title" render={({ field }) => (
                          <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={noteForm.control} name="subject" render={({ field }) => (
                          <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={noteForm.control} name="url" render={({ field }) => (
                          <FormItem><FormLabel>Google Drive Link</FormLabel><FormControl><Input placeholder="https://docs.google.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <Button type="submit">Save Note</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Subject: {doc.subject} | Uploaded on: {doc.uploadDate}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Link
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

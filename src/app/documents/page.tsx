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
import { Download, FileText, BarChart2, PlusCircle, UploadCloud, ExternalLink } from "lucide-react"
import { initialDocumentsData, initialTestResultsData, studentData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
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
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

const resultSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  testName: z.string().min(1, 'Test name is required'),
  score: z.coerce.number().min(0, 'Score must be at least 0').max(100, 'Score cannot exceed 100'),
})

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  url: z.string().url('Please enter a valid Google Drive URL'),
})

export default function DocumentsPage() {
  const { toast } = useToast()
  const [userType, setUserType] = React.useState<string | null>(null)
  const [testResults, setTestResults] = React.useState(initialTestResultsData)
  const [documents, setDocuments] = React.useState(initialDocumentsData)
  const [isAddResultOpen, setIsAddResultOpen] = React.useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = React.useState(false)

  const resultForm = useForm<z.infer<typeof resultSchema>>({
    resolver: zodResolver(resultSchema),
    defaultValues: { subject: '', testName: '', score: 0 },
  })

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', subject: '', url: '' },
  })

  React.useEffect(() => {
    const storedUserType = localStorage.getItem('userType')
    setUserType(storedUserType)
  }, [])

  const isTeacherOrAdmin = userType === 'teacher' || userType === 'superadmin'
  const topScore = Math.max(0, ...testResults.map(r => r.score))

  function onAddResult(data: z.infer<typeof resultSchema>) {
    const newResult = {
      id: testResults.length + 1,
      ...data,
      date: format(new Date(), 'dd MMM, yyyy'),
    }
    setTestResults([newResult, ...testResults])
    toast({ title: "Success", description: "New test result has been added." })
    setIsAddResultOpen(false)
    resultForm.reset()
  }

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
                  Performance of {studentData.summary.studentName} in recent tests.
                  Class top score is <span className="font-bold text-primary">{topScore}%</span>.
                </CardDescription>
              </div>
              {isTeacherOrAdmin && (
                <Dialog open={isAddResultOpen} onOpenChange={setIsAddResultOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Result
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Test Result</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new test result.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...resultForm}>
                      <form onSubmit={resultForm.handleSubmit(onAddResult)} className="space-y-4">
                        <FormField control={resultForm.control} name="subject" render={({ field }) => (
                          <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={resultForm.control} name="testName" render={({ field }) => (
                          <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={resultForm.control} name="score" render={({ field }) => (
                          <FormItem><FormLabel>Score (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <Button type="submit">Save Result</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
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
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
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

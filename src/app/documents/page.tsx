'use client'

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, ExternalLink } from "lucide-react"
import { initialDocumentsData } from "@/lib/data"
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

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  url: z.string().url('Please enter a valid Google Drive URL'),
})

export default function DocumentsPage() {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = React.useState<{type: string; id?: string; name?: string;} | null>(null);
  const [documents, setDocuments] = React.useState(initialDocumentsData)
  const [isAddNoteOpen, setIsAddNoteOpen] = React.useState(false)

  const noteForm = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: '', subject: '', url: '' },
  })

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const userType = currentUser?.type;
  const isTeacherOrAdmin = userType === 'teacher' || userType === 'superadmin'

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
  )
}

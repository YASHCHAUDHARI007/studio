
'use client'

import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { UserPlus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useShikshaData } from '@/hooks/use-shiksha-data'
import { Skeleton } from '@/components/ui/skeleton'

const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
})

type TeacherFormValues = z.infer<typeof teacherSchema>

export function TeacherManagement() {
  const { data, loading, saveData } = useShikshaData();
  const [isAddTeacherDialogOpen, setIsAddTeacherDialogOpen] = React.useState(false)
  const [showCredentialsDialog, setShowCredentialsDialog] = React.useState(false)
  const [generatedCredentials, setGeneratedCredentials] = React.useState({ username: '', password: '' })
  const { toast } = useToast()

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
    },
  })

  async function onSubmit(formData: TeacherFormValues) {
    const username = formData.email
    const password = 'password123' // Simple default password
    const teacherId = `TCH-${Date.now()}`;

    const newTeacher = {
      id: teacherId,
      username,
      password,
      ...formData,
    }
    await saveData(`teachers/${teacherId}`, newTeacher);
    
    setGeneratedCredentials({ username, password })
    toast({
      title: 'Teacher Added',
      description: `${formData.name} has been added successfully.`,
    })
    form.reset()
    setIsAddTeacherDialogOpen(false)
    setShowCredentialsDialog(true)
  }

  if (loading || !data) {
    return (
        <Card>
            <CardHeader><Skeleton className='h-8 w-1/2'/></CardHeader>
            <CardContent><Skeleton className='h-64 w-full'/></CardContent>
        </Card>
    )
  }
  
  const teachers = Object.values(data.teachers || {});

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Manage Teachers</CardTitle>
            <CardDescription>View, add, or edit teacher details.</CardDescription>
          </div>
          <Dialog open={isAddTeacherDialogOpen} onOpenChange={setIsAddTeacherDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Enter the details of the new teacher. Credentials will be generated.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mrs. Davis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Username)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="e.g., davis@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Add Teacher</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher: any) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-mono text-muted-foreground">{teacher.id}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.username}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Teacher Credentials Generated</DialogTitle>
            <DialogDescription>
              Please share these credentials securely with the teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 rounded-md border bg-muted/50 p-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" readOnly value={generatedCredentials.username} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" readOnly value={generatedCredentials.password} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCredentialsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

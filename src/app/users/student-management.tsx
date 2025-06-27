
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
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { usersData } from "@/lib/data"
import { CalendarIcon, UserPlus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  grade: z.string().min(1, 'Grade is required'),
  parentName: z.string().min(1, 'Parent name is required'),
  parentContact: z.string().min(10, 'Parent contact must be at least 10 digits').max(15),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  dateJoined: z.date({
    required_error: "Date joined is required.",
  }),
})

type StudentFormValues = z.infer<typeof studentSchema>

export function StudentManagement() {
  const [students, setStudents] = React.useState(usersData.students)
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = React.useState(false)
  const [showCredentialsDialog, setShowCredentialsDialog] = React.useState(false)
  const [generatedCredentials, setGeneratedCredentials] = React.useState({ username: '', password: '' })
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      grade: '',
      parentName: '',
      parentContact: '',
      dateOfBirth: undefined,
      dateJoined: undefined,
    },
  })

  function onSubmit(data: StudentFormValues) {
    const username = data.parentContact;
    const password = `${data.name.split(' ')[0].toLowerCase()}${format(data.dateOfBirth, 'ddMMyyyy')}`;
    
    const newStudent = {
      id: `STU-${String(students.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      grade: data.grade,
      parentName: data.parentName,
      parentContact: data.parentContact,
      dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
      dateJoined: format(data.dateJoined, 'yyyy-MM-dd'),
      username: username,
      password: password,
    }
    setStudents([...students, newStudent])
    setGeneratedCredentials({ username, password });
    toast({
      title: 'Student Added',
      description: `${data.name} has been added successfully.`,
    })
    form.reset()
    setIsAddStudentDialogOpen(false)
    setShowCredentialsDialog(true)
  }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Students</CardTitle>
          <CardDescription>View, add, or edit student details.</CardDescription>
        </div>
        <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the details of the new student.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rohan Sharma" {...field} />
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
                      <FormLabel>Student Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., rohan@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            fromYear={2000}
                            toYear={new Date().getFullYear()}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateJoined"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Joined</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            fromYear={2010}
                            toYear={new Date().getFullYear()}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2010-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1st">1st Grade</SelectItem>
                          <SelectItem value="2nd">2nd Grade</SelectItem>
                          <SelectItem value="3rd">3rd Grade</SelectItem>
                          <SelectItem value="4th">4th Grade</SelectItem>
                          <SelectItem value="5th">5th Grade</SelectItem>
                          <SelectItem value="6th">6th Grade</SelectItem>
                          <SelectItem value="7th">7th Grade</SelectItem>
                          <SelectItem value="8th">8th Grade</SelectItem>
                          <SelectItem value="9th">9th Grade</SelectItem>
                          <SelectItem value="10th">10th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mr. Sharma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent's Contact (Username)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 9876543210" {...field} />
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
                  <Button type="submit">Add Student</Button>
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
              <TableHead>Email</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-mono text-muted-foreground">{student.id}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.dateJoined}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>{student.parentContact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Student Credentials Generated</DialogTitle>
            <DialogDescription>
                Please share these credentials securely with the student and parent.
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

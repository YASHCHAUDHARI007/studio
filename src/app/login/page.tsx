'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Icons } from '@/components/icons'
import { Loader2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useShikshaData } from '@/hooks/use-shiksha-data'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { data, loading } = useShikshaData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Clear previous user
    localStorage.removeItem('user');

    // Mock authentication
    setTimeout(() => {
      if (!data) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
        setIsLoading(false);
        return;
      }

      const students = Object.values(data.students || {});
      const teachers = Object.values(data.teachers || {});

      const student = students.find(
        (s: any) => s.username === username && s.password === password
      )
      const teacher = teachers.find(
        (t: any) => t.username === username && t.password === password
      )

      if (username === 'superadmin' && password === 'superpassword') {
        toast({ title: 'Login Successful', description: 'Welcome, Super Admin!' })
        localStorage.setItem('user', JSON.stringify({ type: 'superadmin', name: 'Super Admin' }));
        router.push('/dashboard')
      } else if (student) {
        toast({ title: 'Login Successful', description: `Welcome back, ${(student as any).name}!` })
        localStorage.setItem('user', JSON.stringify({ type: 'student', id: (student as any).id, name: (student as any).name }));
        router.push('/student-dashboard')
      } else if (teacher) {
        toast({ title: 'Login Successful', description: `Welcome back, ${(teacher as any).name}!` })
        localStorage.setItem('user', JSON.stringify({ type: 'teacher', id: (teacher as any).id, name: (teacher as any).name }));
        router.push('/dashboard')
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid username or password.',
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  if(loading || !data) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
             <Skeleton className="w-full max-w-sm h-96" />
             <Skeleton className="w-full max-w-sm h-64" />
        </div>
    )
  }

  const students = Object.values(data.students);
  const teachers = Object.values(data.teachers);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Icons.logo className="size-12 text-primary" />
            </div>
          <CardTitle>Welcome to ShikshaSetu</CardTitle>
          <CardDescription>Enter your credentials to access your portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Test Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="students">
              <AccordionTrigger>Student Logins</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">Username</TableHead>
                      <TableHead className="font-mono">Password</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 2).map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono">{student.username}</TableCell>
                        <TableCell className="font-mono">{student.password}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="teachers">
              <AccordionTrigger>Teacher/Admin Logins</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">Username</TableHead>
                      <TableHead className="font-mono">Password</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">superadmin</TableCell>
                      <TableCell className="font-mono">superpassword</TableCell>
                    </TableRow>
                    {teachers.slice(0, 1).map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-mono">{teacher.username}</TableCell>
                        <TableCell className="font-mono">{teacher.password}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

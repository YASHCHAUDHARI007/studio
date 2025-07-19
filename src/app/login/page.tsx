
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
import { usersData } from '@/lib/data'

// Combine all users into a single list for authentication
const allUsers = [
  ...Object.values(usersData.students).map(u => ({ ...u, type: 'student' })),
  ...Object.values(usersData.teachers).map(u => ({ ...u, type: 'teacher' })),
  { id: 'superadmin', name: 'Super Admin', username: 'superadmin', password: 'superpassword', type: 'superadmin' }
];

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Clear previous user
    localStorage.removeItem('user');

    // Mock authentication
    setTimeout(() => {
      const user = allUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        toast({ title: 'Login Successful', description: `Welcome back, ${user.name}!` })
        
        const userToStore = {
            type: user.type,
            id: user.id,
            name: user.name,
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        
        if (user.type === 'student') {
            router.push('/student-dashboard');
        } else {
            router.push('/dashboard');
        }

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
                    {Object.values(usersData.students).slice(0, 2).map((student: any) => (
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
                    {Object.values(usersData.teachers).slice(0, 2).map((teacher: any) => (
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


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
import { database } from '@/lib/firebase'
import { ref, get } from 'firebase/database'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Clear previous user
    localStorage.removeItem('user');

    try {
        const dbRef = ref(database);
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            toast({
                variant: 'destructive',
                title: 'Database Error',
                description: 'Could not connect to the database. Please try again later.',
            });
            setIsLoading(false);
            return;
        }
        
        const data = snapshot.val();
        const students = Object.values(data.students || {});
        const teachers = Object.values(data.teachers || {});
        
        const allUsers = [
            ...students.map((u: any) => ({ ...u, type: 'student' })),
            ...teachers.map((u: any) => ({ ...u, type: 'teacher' })),
            { id: 'superadmin', name: 'Super Admin', username: 'superadmin', password: 'superpassword', type: 'superadmin' }
        ];

        const user = allUsers.find(
            (u: any) => u.username === username && u.password === password
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

    } catch (error) {
        console.error("Login failed:", error);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'An unexpected error occurred. Please check your connection.',
        });
    } finally {
        setIsLoading(false)
    }
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
    </div>
  )
}

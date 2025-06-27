'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Lock, Loader2 } from "lucide-react"
import { SuperAdminDashboard } from './super-admin-dashboard'

export default function SecretAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock authentication for the secret page
    setTimeout(() => {
      if (username === 'superadmin' && password === 'superpassword') {
        setIsAuthenticated(true)
        toast({ title: 'Authentication Successful', description: 'Welcome, Super Admin!' })
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'Invalid credentials for secret page.',
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  if (isAuthenticated) {
    return (
      <div className="p-4 sm:p-6">
        <SuperAdminDashboard />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Lock className="size-12 text-primary" />
          </div>
          <CardTitle>Secret Admin Access</CardTitle>
          <CardDescription>Enter the special credentials to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
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
              {isLoading ? 'Authenticating...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

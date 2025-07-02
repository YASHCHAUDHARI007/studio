'use client';

import * as React from 'react';
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
import { usersData } from "@/lib/data"
import { Users, BookOpen, FileText } from "lucide-react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TeacherDashboard() {
  const [assignedStudents, setAssignedStudents] = React.useState(usersData.students);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStudents = localStorage.getItem('shiksha-students');
      if (savedStudents) {
        setAssignedStudents(JSON.parse(savedStudents));
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Dashboard</CardTitle>
          <CardDescription>
            Welcome! Here's an overview of your students and classes.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Taught</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Hardcoded for now */}
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Grades 9 & 10</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage results and materials.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/documents">
                <FileText className="mr-2 h-4 w-4"/>
                Manage Documents
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>A list of students assigned to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Parent's Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

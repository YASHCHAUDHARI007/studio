
'use client'

import * as React from 'react'
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
import { Badge } from "@/components/ui/badge"
import { Users, User, DollarSign } from 'lucide-react'
import { useShikshaData } from '@/hooks/use-shiksha-data'
import { Skeleton } from '@/components/ui/skeleton'

export function SuperAdminDashboard() {
  const {data, loading} = useShikshaData();

  if (loading || !data) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
  }

  const students = Object.values(data.students || {});
  const teachers = Object.values(data.teachers || {});
  const feeData = data.fees || {};

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalDues = Object.values(feeData).reduce((acc: number, student: any) => acc + student.summary.due, 0);

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return formattedAmount.replace(/\s/g, '').replace('₹', 'Rs.');
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Super Admin Dashboard</CardTitle>
          <CardDescription>A complete overview of the entire institution.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDues)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: any) => (
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

        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher: any) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{teacher.id}</TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
        <Card>
          <CardHeader>
            <CardTitle>Fee Status Overview</CardTitle>
            <CardDescription>Fee summary for all students.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Total Fees</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(feeData).map((feeData: any) => (
                  <TableRow key={feeData.name}>
                    <TableCell className="font-medium">{feeData.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(feeData.summary.total)}</TableCell>
                    <TableCell className="text-right text-primary">{formatCurrency(feeData.summary.paid)}</TableCell>
                    <TableCell className="text-right text-destructive">{formatCurrency(feeData.summary.due)}</TableCell>
                    <TableCell>
                      <Badge variant={feeData.summary.due > 0 ? 'destructive' : 'default'}>
                        {feeData.summary.due > 0 ? 'Due' : 'Paid'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}

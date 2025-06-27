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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileDown, Send } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { allStudentsFeeData, usersData } from "@/lib/data"
import { Label } from '@/components/ui/label'

export default function FeesPage() {
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null)

  const feeData = selectedStudentId ? allStudentsFeeData[selectedStudentId as keyof typeof allStudentsFeeData] : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Due':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fee Management</CardTitle>
          <CardDescription>
            Select a student to view their fee details and manage payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="student-select">Select Student</Label>
            <Select onValueChange={setSelectedStudentId}>
              <SelectTrigger id="student-select" className="w-full">
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                {usersData.students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {feeData && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Annual Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(feeData.summary.total)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatCurrency(feeData.summary.paid)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Dues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">{formatCurrency(feeData.summary.due)}</p>
              </CardContent>
            </Card>
          </div>

          {feeData.summary.due > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Due</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Outstanding balance of {formatCurrency(feeData.summary.due)}. Next due date is {feeData.summary.dueDate}.
                </span>
                <Button size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reminder
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Monthly Fee Breakdown</CardTitle>
                <CardDescription>
                  A month-by-month payment record for {feeData.name}.
                </CardDescription>
              </div>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeData.monthlyBreakdown.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="font-medium">{item.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      <TableCell className="text-right text-primary">{formatCurrency(item.paid)}</TableCell>
                      <TableCell className="text-right text-destructive">{formatCurrency(item.total - item.paid)}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status === 'Due' ? (
                          <Button size="sm" variant="outline">Mark as Paid</Button>
                        ) : item.status === 'Paid' ? (
                          <Button size="sm" variant="ghost" disabled>Paid</Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

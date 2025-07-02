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
import { initialAllStudentsFeeData, usersData } from "@/lib/data"
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function FeesPage() {
  const { toast } = useToast()
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null)
  const [studentsFeeData, setStudentsFeeData] = React.useState(initialAllStudentsFeeData)

  const feeData = selectedStudentId ? studentsFeeData[selectedStudentId as keyof typeof studentsFeeData] : null

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `Rs. ${formattedAmount}`;
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

  const handleMarkAsPaid = (month: string) => {
    if (!selectedStudentId || !feeData) return

    setStudentsFeeData(prevData => {
      const updatedStudentData = { ...prevData[selectedStudentId as keyof typeof prevData] }
      const breakdown = updatedStudentData.monthlyBreakdown.map(item => {
        if (item.month === month && item.status === 'Due') {
          return { ...item, paid: item.total, status: 'Paid' }
        }
        return item
      })

      const paidAmount = breakdown.reduce((acc, item) => acc + item.paid, 0)
      const dueAmount = updatedStudentData.summary.total - paidAmount

      updatedStudentData.monthlyBreakdown = breakdown
      updatedStudentData.summary.paid = paidAmount
      updatedStudentData.summary.due = dueAmount

      return {
        ...prevData,
        [selectedStudentId]: updatedStudentData,
      }
    })

    toast({ title: "Payment Updated", description: `Marked ${month} as paid for ${feeData.name}.` })
  }

  const handleSendReminder = () => {
    if (!feeData) return
    toast({ title: "Reminder Sent", description: `A payment reminder has been sent for ${feeData.name}.` })
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
                <Button size="sm" onClick={handleSendReminder}>
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
                          <Button size="sm" variant="outline" onClick={() => handleMarkAsPaid(item.month)}>Mark as Paid</Button>
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

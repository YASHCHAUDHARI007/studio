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
import { AlertCircle } from "lucide-react"
import { initialStudentFeeData } from "@/lib/data"
import { Metadata } from "next"
import { useToast } from "@/hooks/use-toast"

export default function MyFeesPage() {
  const { toast } = useToast()
  const [feeData, setFeeData] = React.useState(initialStudentFeeData)
  const { summary, monthlyBreakdown } = feeData

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

  const handlePayNow = (month: string) => {
    setFeeData(prevData => {
      const updatedBreakdown = prevData.monthlyBreakdown.map(item => {
        if (item.month === month && item.status === 'Due') {
          return { ...item, paid: item.total, status: 'Paid' }
        }
        return item
      })

      const paidAmount = updatedBreakdown.reduce((acc, item) => acc + item.paid, 0)
      const dueAmount = prevData.summary.total - paidAmount
      
      return {
        ...prevData,
        monthlyBreakdown: updatedBreakdown,
        summary: {
          ...prevData.summary,
          paid: paidAmount,
          due: dueAmount,
        }
      }
    })
    toast({ title: 'Payment Successful', description: `Your payment for ${month} has been recorded.` })
  }

  return (
    <div className="space-y-6">
       <CardHeader className="p-0">
          <CardTitle>My Fee Details</CardTitle>
          <CardDescription>
            Here is a summary of your fee payments and outstanding dues.
          </CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Annual Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(summary.paid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{formatCurrency(summary.due)}</p>
          </CardContent>
        </Card>
      </div>

      {summary.due > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Due</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              You have an outstanding balance of {formatCurrency(summary.due)}. Next due date is {summary.dueDate}.
            </span>
            <Button size="sm">Pay All Dues</Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
            <CardTitle>Monthly Fee Breakdown</CardTitle>
            <CardDescription>
              A month-by-month record of your fee payments.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyBreakdown.map((item) => (
                <TableRow key={item.month}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === 'Due' ? (
                      <Button size="sm" variant="outline" onClick={() => handlePayNow(item.month)}>Pay Now</Button>
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
    </div>
  )
}

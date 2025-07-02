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
import { AlertCircle } from "lucide-react"
import { initialStudentFeeData } from "@/lib/data"
import { format } from 'date-fns'

export default function MyFeesPage() {
  const [feeData] = React.useState(initialStudentFeeData)
  const { summary, paymentHistory } = feeData

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return formattedAmount.replace(/\s/g, '');
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
          <AlertDescription>
              You have an outstanding balance of {formatCurrency(summary.due)}. Next due date is {summary.dueDate}. Please pay your dues at the office.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              A record of your fee payments.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{format(new Date(item.date), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No payments made yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

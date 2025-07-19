
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
import { AlertCircle, Loader2 } from "lucide-react"
import { format } from 'date-fns'
import { useShikshaData } from '@/hooks/use-shiksha-data'

type FeeData = {
  name: string;
  summary: {
    total: number;
    paid: number;
    due: number;
    dueDate: string;
  };
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    notes: string;
  }[];
};

export default function MyFeesPage() {
  const [feeData, setFeeData] = React.useState<FeeData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true);
  const {data, loading} = useShikshaData();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && data) {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setFeeData(data.fees[userData.id]);
        }
        setIsLoading(false);
    }
  }, [data]);

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return formattedAmount.replace(/\s/g, '').replace('₹', 'Rs.');
  }

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!feeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fee Details Not Found</CardTitle>
          <CardDescription>We could not find any fee records for your account.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { summary, paymentHistory } = feeData

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
              {paymentHistory && paymentHistory.length > 0 ? (
                paymentHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{format(new Date(`${item.date}T00:00:00`), 'dd MMM, yyyy')}</TableCell>
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

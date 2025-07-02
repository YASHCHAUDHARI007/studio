'use client'

import * as React from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
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
import { AlertCircle, FileDown, Send, PlusCircle, Calendar as CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { initialAllStudentsFeeData, usersData } from "@/lib/data"
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const paymentSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  date: z.date({ required_error: "Payment date is required." }),
  notes: z.string().optional(),
})

export default function FeesPage() {
  const { toast } = useToast()
  const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null)
  const [studentsFeeData, setStudentsFeeData] = React.useState(initialAllStudentsFeeData)
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = React.useState(false)

  const feeData = selectedStudentId ? studentsFeeData[selectedStudentId as keyof typeof studentsFeeData] : null

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: undefined, date: new Date(), notes: '' },
  })

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return formattedAmount.replace(/\s/g, '');
  }

  function handleRecordPayment(data: z.infer<typeof paymentSchema>) {
    if (!selectedStudentId || !feeData) return

    setStudentsFeeData(prevData => {
      const currentStudentData = prevData[selectedStudentId as keyof typeof prevData]
      
      const newPayment = {
        id: `PAY-${Math.random().toString(36).substring(2, 9)}`,
        date: format(data.date, 'yyyy-MM-dd'),
        amount: data.amount,
        notes: data.notes || 'Installment payment',
      }

      const updatedHistory = [...currentStudentData.paymentHistory, newPayment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const totalPaid = updatedHistory.reduce((acc, p) => acc + p.amount, 0)
      const totalDue = currentStudentData.summary.total - totalPaid

      const updatedStudentData = {
        ...currentStudentData,
        paymentHistory: updatedHistory,
        summary: {
          ...currentStudentData.summary,
          paid: totalPaid,
          due: totalDue,
        }
      }

      return {
        ...prevData,
        [selectedStudentId]: updatedStudentData,
      }
    })

    toast({ title: "Payment Recorded", description: `Recorded a payment of ${formatCurrency(data.amount)} for ${feeData.name}.` })
    setIsRecordPaymentOpen(false)
    paymentForm.reset({ amount: undefined, date: new Date(), notes: '' })
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  A record of payments for {feeData.name}.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Record Payment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record a New Payment</DialogTitle>
                      <DialogDescription>Enter the details for the payment received from {feeData.name}.</DialogDescription>
                    </DialogHeader>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(handleRecordPayment)} className="space-y-4 py-4">
                        <FormField control={paymentForm.control} name="amount" render={({ field }) => (
                          <FormItem><FormLabel>Amount Received</FormLabel><FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={paymentForm.control} name="date" render={({ field }) => (
                          <FormItem className="flex flex-col"><FormLabel>Payment Date</FormLabel>
                          <Popover><PopoverTrigger asChild><FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                          </FormControl></PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent></Popover><FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={paymentForm.control} name="notes" render={({ field }) => (
                          <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Second installment" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                          <Button type="submit">Save Payment</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
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
                  {feeData.paymentHistory.length > 0 ? (
                    feeData.paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{format(new Date(payment.date), 'dd MMM, yyyy')}</TableCell>
                        <TableCell>{payment.notes}</TableCell>
                        <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No payments recorded for this student.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

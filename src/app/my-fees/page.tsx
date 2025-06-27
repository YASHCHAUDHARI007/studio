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
import { studentFeeData } from "@/lib/data"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'My Fees',
};

export default function MyFeesPage() {
  const { summary, monthlyBreakdown } = studentFeeData

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
            <Button size="sm">Pay Now</Button>
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
                      <Button size="sm" variant="outline">Pay Now</Button>
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

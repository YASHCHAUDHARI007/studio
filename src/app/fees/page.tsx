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
import { AlertCircle, FileDown } from "lucide-react"
import { feeData } from "@/lib/data"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Fee Management',
};

export default function FeesPage() {
  const { summary, history } = feeData

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fees Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(summary.paid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Dues</CardTitle>
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
              You have an outstanding balance of {formatCurrency(summary.due)}. Please pay by {summary.dueDate}.
            </span>
            <Button size="sm">Pay Now</Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              A record of all your fee payments.
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
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-muted-foreground">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === 'Paid' ? 'default' : 'destructive'
                      }
                    >
                      {transaction.status}
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

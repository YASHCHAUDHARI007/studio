'use client'

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { studentData, testResultsData } from "@/lib/data"

export default function StudentDashboard() {
  const { summary, schedule, performance } = studentData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Welcome back, {summary.studentName}!</CardTitle>
                <CardDescription>Here's a quick summary of your progress.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Overall Grade</h3>
                    <p className="text-3xl font-bold">{summary.overallGrade}</p>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Attendance</h3>
                    <p className="text-3xl font-bold">{summary.attendance}</p>
                </div>
                <div className="flex flex-col space-y-1 rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Upcoming Assignments</h3>
                    <p className="text-3xl font-bold">{summary.upcomingAssignments}</p>
                </div>
            </CardContent>
        </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Academic Performance</CardTitle>
          <CardDescription>Your scores from recent tests and assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-64 w-full">
            <BarChart data={performance}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="subject"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="score" fill="var(--color-primary)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your classes and activities for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((item) => (
                <TableRow key={item.time}>
                  <TableCell className="font-medium">{item.time}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'class' ? 'default' : 'secondary'}>{item.subject}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>A summary of your most recent test scores.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testResultsData.slice(0, 3).map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.subject}</TableCell>
                  <TableCell>{result.testName}</TableCell>
                  <TableCell>{result.date}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={result.score > 85 ? "default" : result.score > 60 ? "secondary" : "destructive"}>
                      {result.score}%
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

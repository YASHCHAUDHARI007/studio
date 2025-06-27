'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { attendanceData } from "@/lib/data"

export default function AttendancePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const presentDays = attendanceData.present;
  const absentDays = attendanceData.absent;
  const holidays = attendanceData.holidays;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Attendance Record</CardTitle>
          <CardDescription>
            View the monthly attendance record.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              present: presentDays,
              absent: absentDays,
              holiday: holidays,
            }}
            modifiersClassNames={{
              present: 'bg-primary/20 text-primary rounded-full',
              absent: 'bg-destructive/20 text-destructive rounded-full',
              holiday: 'bg-accent/20 text-accent',
            }}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary/30"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive/20 border border-destructive/30"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-accent/20 border border-accent/30"></div>
              <span className="text-sm">Holiday</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground"></div>
              <span className="text-sm">Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

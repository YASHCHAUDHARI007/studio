'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
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
              present: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full',
              absent: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full',
              holiday: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            }}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-100 border"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-100 border"></div>
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-100 border"></div>
              <span className="text-sm">Holiday</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-accent"></div>
              </div>
              <span className="text-sm">Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

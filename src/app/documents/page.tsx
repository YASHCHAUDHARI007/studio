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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart2 } from "lucide-react"
import { documentsData, testResultsData, studentData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Documents',
};


export default function DocumentsPage() {
  const topScore = Math.max(...testResultsData.map(r => r.score));

  return (
    <Tabs defaultValue="results" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="results">
          <BarChart2 className="mr-2 h-4 w-4" />
          Test Results
        </TabsTrigger>
        <TabsTrigger value="notes">
          <FileText className="mr-2 h-4 w-4" />
          Notes & Materials
        </TabsTrigger>
      </TabsList>

      <TabsContent value="results">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Performance of {studentData.summary.studentName} in recent tests.
              Class top score is <span className="font-bold text-primary">{topScore}%</span>.
            </CardDescription>
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
                {testResultsData.map((result) => (
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
      </TabsContent>

      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Notes & Materials</CardTitle>
            <CardDescription>
              Download shared notes and study materials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentsData.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Subject: {doc.subject} | Uploaded on: {doc.uploadDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

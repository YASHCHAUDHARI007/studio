
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus } from "lucide-react"
import { StudentManagement } from "./student-management"
import { TeacherManagement } from "./teacher-management"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'User Management',
};

export default function UsersPage() {
  return (
    <Tabs defaultValue="students" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="students">
          <Users className="mr-2 h-4 w-4" />
          Students
        </TabsTrigger>
        <TabsTrigger value="teachers">
          <UserPlus className="mr-2 h-4 w-4" />
          Teachers
        </TabsTrigger>
      </TabsList>
      <TabsContent value="students">
        <StudentManagement />
      </TabsContent>
      <TabsContent value="teachers">
        <TeacherManagement />
      </TabsContent>
    </Tabs>
  )
}

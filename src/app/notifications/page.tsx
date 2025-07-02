import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationForm } from "./notification-form"
import { AnnouncementForm } from "./announcement-form"
import { Metadata } from "next"
import { MessageSquareText, Megaphone } from "lucide-react"

export const metadata: Metadata = {
  title: 'Notification Tools',
};

export default function NotificationsPage() {
  return (
    <Tabs defaultValue="personalized" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personalized">
          <MessageSquareText className="mr-2 h-4 w-4" />
          Personalized Message
        </TabsTrigger>
        <TabsTrigger value="announcements">
          <Megaphone className="mr-2 h-4 w-4" />
          Common Announcement
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personalized">
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>Personalized Notification Tool</CardTitle>
                <CardDescription>
                    Use our AI assistant to generate personalized, supportive messages for parents based on student data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationForm />
            </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="announcements">
        <Card className="mt-2">
            <CardHeader>
                <CardTitle>Common Announcement Tool</CardTitle>
                <CardDescription>
                    Broadcast a common message to all students and teachers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AnnouncementForm />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

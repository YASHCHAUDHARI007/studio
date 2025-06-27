import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NotificationForm } from "./notification-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Personalized Notifications',
};

export default function NotificationsPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl">
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
    </div>
  )
}

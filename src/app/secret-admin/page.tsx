import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Secret Admin Page',
};

export default function SecretAdminPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <CardTitle>Secret Admin Page</CardTitle>
          <CardDescription>
            This page is not accessible through the main navigation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You have discovered a secret area! This page can be used for special administrative functions or content that is not meant for regular users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

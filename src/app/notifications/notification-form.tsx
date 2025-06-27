'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedMessage } from '@/ai/flows/generate-personalized-messages';
import { studentData } from '@/lib/data';
import { Copy, Sparkles, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  studentName: z.string().min(1, 'Student name is required.'),
  studentPerformance: z.string().min(1, 'Performance summary is required.'),
  studentAttendance: z.string().min(1, 'Attendance summary is required.'),
  studentActivities: z.string().min(1, 'Activities summary is required.'),
});

export function NotificationForm() {
  const [generatedMessage, setGeneratedMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: studentData.summary.studentName,
      studentPerformance: 'Scored 85% in the recent Math test, showing great improvement in algebra. However, needs to focus more on geometry.',
      studentAttendance: '95% attendance this month. Was absent for one day due to illness.',
      studentActivities: 'Actively participated in the school science fair and won second prize.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedMessage('');
    try {
      const output = await generatePersonalizedMessage(values);
      setGeneratedMessage(output.message);
    } catch (error) {
      console.error('Failed to generate message:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was a problem generating the message. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
      title: "Copied to Clipboard",
      description: "The generated message has been copied.",
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Anjali Kulkarni" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentPerformance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Performance</FormLabel>
                <FormControl>
                  <Textarea placeholder="Summarize recent academic performance..." {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentAttendance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attendance Record</FormLabel>
                <FormControl>
                  <Textarea placeholder="Summarize attendance..." {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentActivities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extracurricular Activities</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mention recent activities or participation..." {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Message
          </Button>
        </form>
      </Form>
      
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Generated Message</h3>
        <div className="rounded-md border bg-muted/50 p-4 min-h-[300px] relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {generatedMessage ? (
                <>
                <p className="text-sm whitespace-pre-wrap">{generatedMessage}</p>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Sparkles className="h-8 w-8 mb-2" />
                    <p>Your personalized message will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}


'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { useShikshaData } from '@/hooks/use-shiksha-data';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  message: z.string().min(1, 'Message is required.'),
});

export function AnnouncementForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { saveData } = useShikshaData();

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof announcementSchema>) {
    setIsSubmitting(true);
    
    try {
        const id = `AN-${Date.now()}`;
        const newAnnouncement = {
            id,
            ...values,
            date: new Date().toISOString(),
        };

        await saveData(`announcements/${id}`, newAnnouncement);

        toast({
            title: 'Announcement Sent',
            description: 'The announcement has been broadcast to all users.',
        });
        form.reset();
    } catch (error) {
        console.error('Failed to send announcement:', error);
        toast({
            variant: 'destructive',
            title: 'Failed to Send',
            description: 'There was a problem sending the announcement.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Holiday Declared" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the announcement details here. This will be visible to all students and teachers."
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Announcement
          </Button>
        </form>
      </Form>
    </div>
  );
}

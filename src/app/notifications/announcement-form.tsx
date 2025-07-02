
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
import { initialAnnouncementsData } from '@/lib/data';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  message: z.string().min(1, 'Message is required.'),
});

type Announcement = z.infer<typeof announcementSchema> & { id: string; date: string };

export function AnnouncementForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof announcementSchema>) {
    setIsLoading(true);
    
    // Simulate sending notification
    setTimeout(() => {
        try {
            if (typeof window === 'undefined') return;
            const savedAnnouncements = localStorage.getItem('shiksha-announcements');
            const announcements: Announcement[] = savedAnnouncements ? JSON.parse(savedAnnouncements) : initialAnnouncementsData;
            
            const newAnnouncement: Announcement = {
                id: `AN-${Date.now()}`,
                ...values,
                date: new Date().toISOString(),
            };

            const updatedAnnouncements = [newAnnouncement, ...announcements];
            localStorage.setItem('shiksha-announcements', JSON.stringify(updatedAnnouncements));

            toast({
                title: 'Announcement Sent',
                description: 'The announcement has been broadcast to all users.',
            });
            form.reset();
             // Trigger a custom event to notify other components like the app shell
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Failed to send announcement:', error);
            toast({
                variant: 'destructive',
                title: 'Failed to Send',
                description: 'There was a problem sending the announcement.',
            });
        } finally {
            setIsLoading(false);
        }
    }, 500);
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
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

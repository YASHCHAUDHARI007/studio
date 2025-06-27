// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview AI-powered tool that suggests personalized notification messages to parents.
 *
 * - generatePersonalizedMessage - A function that handles the personalized message generation.
 * - PersonalizedMessageInput - The input type for the generatePersonalizedMessage function.
 * - PersonalizedMessageOutput - The return type for the generatePersonalizedMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMessageInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  studentPerformance: z.string().describe('A summary of the student\'s recent academic performance.'),
  studentAttendance: z.string().describe('A summary of the student\'s recent attendance record.'),
  studentActivities: z.string().describe('A summary of the student\'s recent activities and participation.'),
});
export type PersonalizedMessageInput = z.infer<typeof PersonalizedMessageInputSchema>;

const PersonalizedMessageOutputSchema = z.object({
  message: z.string().describe('A personalized notification message to the parent.'),
});
export type PersonalizedMessageOutput = z.infer<typeof PersonalizedMessageOutputSchema>;

export async function generatePersonalizedMessage(input: PersonalizedMessageInput): Promise<PersonalizedMessageOutput> {
  return generatePersonalizedMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMessagePrompt',
  input: {schema: PersonalizedMessageInputSchema},
  output: {schema: PersonalizedMessageOutputSchema},
  prompt: `You are an AI assistant that generates personalized notification messages to parents based on student performance, attendance, and recent activities.

  Student Name: {{{studentName}}}
  Performance: {{{studentPerformance}}}
  Attendance: {{{studentAttendance}}}
  Activities: {{{studentActivities}}}

  Compose a personalized notification message to the student's parents that is informative, supportive, and encouraging. Be specific and highlight key points from the provided information. The message should be concise, professional, and tailored to the individual student's situation.`,
});

const generatePersonalizedMessageFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedMessageFlow',
    inputSchema: PersonalizedMessageInputSchema,
    outputSchema: PersonalizedMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

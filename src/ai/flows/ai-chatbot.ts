'use server';
/**
 * @fileOverview An AI chatbot for practicing conversations in a target language.
 *
 * - aiChatbot - A function that initiates and manages the AI chatbot conversation.
 * - AIChatbotInput - The input type for the aiChatbot function, including language, dialect, topic, and user message.
 * - AIChatbotOutput - The return type for the aiChatbot function, providing the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotInputSchema = z.object({
  language: z.enum(['mandarin', 'french']).describe('The target language for the conversation (mandarin or french).'),
  dialect: z.string().describe('The dialect of the target language.'),
  topic: z.string().describe('The topic of the conversation (e.g., greetings, dining, shopping).'),
  userMessage: z.string().describe('The user message to the chatbot.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  aiResponse: z.string().describe('The AI chatbot response.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AIChatbotInputSchema},
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are a language tutor specializing in {{{language}}} ({{{dialect}}}).
  Your goal is to help the user practice conversations in this language.
  The current topic is: {{{topic}}}.

  User message: {{{userMessage}}}

  Respond in the target language, and keep the conversation going. If the user makes a mistake, gently correct them and explain the correction.
  If the user expresses that they are finished with the conversation, end the conversation gracefully.
  `,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI vocabulary tutor that introduces and reinforces words and phrases.
 *
 * - aiVocabularyTutor - A function that handles the vocabulary tutoring process.
 * - AIVocabularyTutorInput - The input type for the aiVocabularyTutor function.
 * - AIVocabularyTutorOutput - The return type for the aiVocabularyTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIVocabularyTutorInputSchema = z.object({
  language: z
    .string()
    .describe('The language to learn vocabulary in (e.g., Mandarin, French).'),
  topic: z
    .string()
    .describe('The specific topic for vocabulary learning (e.g., Greetings, Dining, Shopping, Travel, Business).'),
  currentVocabulary: z
    .array(z.string())
    .optional()
    .describe('The vocabulary the user already knows, if any.'),
});
export type AIVocabularyTutorInput = z.infer<typeof AIVocabularyTutorInputSchema>;

const AIVocabularyTutorOutputSchema = z.object({
  newVocabulary: z
    .array(z.string())
    .describe('New vocabulary words and phrases introduced in the lesson.'),
  exampleSentences: z
    .array(z.string())
    .describe('Example sentences using the new vocabulary.'),
  reinforcementExercises: z
    .array(z.string())
    .describe('Exercises to reinforce the new vocabulary.'),
});
export type AIVocabularyTutorOutput = z.infer<typeof AIVocabularyTutorOutputSchema>;

export async function aiVocabularyTutor(input: AIVocabularyTutorInput): Promise<AIVocabularyTutorOutput> {
  return aiVocabularyTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiVocabularyTutorPrompt',
  input: {schema: AIVocabularyTutorInputSchema},
  output: {schema: AIVocabularyTutorOutputSchema},
  prompt: `You are an AI vocabulary tutor, skilled in teaching {{language}} vocabulary related to the topic of {{topic}}.

  Introduce new vocabulary words and phrases appropriate for the user's level. Provide example sentences and reinforcement exercises to help the user learn.

  The user may already know some vocabulary: {{#if currentVocabulary}}{{{currentVocabulary}}}{{else}}None{{/if}}.

  Output newVocabulary, exampleSentences, and reinforcementExercises.
  `,
});

const aiVocabularyTutorFlow = ai.defineFlow(
  {
    name: 'aiVocabularyTutorFlow',
    inputSchema: AIVocabularyTutorInputSchema,
    outputSchema: AIVocabularyTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

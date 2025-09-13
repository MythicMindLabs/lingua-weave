'use server';

/**
 * @fileOverview Grammar check AI agent.
 *
 * - aiGrammarCheck - A function that handles the grammar check process.
 * - AiGrammarCheckInput - The input type for the aiGrammarCheck function.
 * - AiGrammarCheckOutput - The return type for the aiGrammarCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGrammarCheckInputSchema = z.object({
  text: z.string().describe('The sentence to check.'),
  language: z.enum(['mandarin', 'french']).describe('The target language.'),
  dialect: z.string().describe('The dialect of the target language.'),
});
export type AiGrammarCheckInput = z.infer<typeof AiGrammarCheckInputSchema>;

const AiGrammarCheckOutputSchema = z.object({
  correctedText: z.string().describe('The corrected sentence.'),
  explanation: z.string().describe('The explanation of the grammar rules.'),
});
export type AiGrammarCheckOutput = z.infer<typeof AiGrammarCheckOutputSchema>;

export async function aiGrammarCheck(input: AiGrammarCheckInput): Promise<AiGrammarCheckOutput> {
  return aiGrammarCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGrammarCheckPrompt',
  input: {schema: AiGrammarCheckInputSchema},
  output: {schema: AiGrammarCheckOutputSchema},
  prompt: `You are an expert language tutor specializing in grammar.

You will check the grammar of the sentence provided, and correct it if necessary.

Language: {{{language}}}
Dialect: {{{dialect}}}
Sentence: {{{text}}}

You will provide the corrected sentence, and an explanation of the grammar rules that were violated.  The explanation should be tailored to a language learner.

Output the corrected sentence in the correctedText field, and the explanation in the explanation field.
`,
});

const aiGrammarCheckFlow = ai.defineFlow(
  {
    name: 'aiGrammarCheckFlow',
    inputSchema: AiGrammarCheckInputSchema,
    outputSchema: AiGrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

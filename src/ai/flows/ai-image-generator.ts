'use server';
/**
 * @fileOverview An AI image generator.
 *
 * - aiImageGenerator - A function that generates an image from a text prompt.
 * - AIImageGeneratorInput - The input type for the aiImageGenerator function.
 * - AIImageGeneratorOutput - The return type for the aiImageGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIImageGeneratorInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type AIImageGeneratorInput = z.infer<typeof AIImageGeneratorInputSchema>;

const AIImageGeneratorOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type AIImageGeneratorOutput = z.infer<typeof AIImageGeneratorOutputSchema>;

export async function aiImageGenerator(input: AIImageGeneratorInput): Promise<AIImageGeneratorOutput> {
  return aiImageGeneratorFlow(input);
}

const aiImageGeneratorFlow = ai.defineFlow(
  {
    name: 'aiImageGeneratorFlow',
    inputSchema: AIImageGeneratorInputSchema,
    outputSchema: AIImageGeneratorOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a simple, clear, and vibrant flashcard-style image for the following concept: ${prompt}. The image should be easy to understand for a language learner. Avoid text and complex scenes.`,
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed to produce a URL.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

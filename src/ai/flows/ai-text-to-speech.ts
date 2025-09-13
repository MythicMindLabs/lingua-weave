'use server';

/**
 * @fileOverview Text-to-speech AI agent.
 *
 * - aiTextToSpeech - A function that converts text to speech.
 * - AiTextToSpeechInput - The input type for the aiTextToSpeech function.
 * - AiTextToSpeechOutput - The return type for the aiTextToSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiTextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type AiTextToSpeechInput = z.infer<typeof AiTextToSpeechInputSchema>;

const AiTextToSpeechOutputSchema = z.object({
  audio: z.string().describe("The base64 encoded audio data in WAV format, as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type AiTextToSpeechOutput = z.infer<typeof AiTextToSpeechOutputSchema>;

export async function aiTextToSpeech(
  input: AiTextToSpeechInput
): Promise<AiTextToSpeechOutput> {
  return aiTextToSpeechFlow(input);
}


const aiTextToSpeechFlow = ai.defineFlow(
  {
    name: 'aiTextToSpeechFlow',
    inputSchema: AiTextToSpeechInputSchema,
    outputSchema: AiTextToSpeechOutputSchema,
  },
  async ({ text }) => {
    // Fallback to google tts
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    return {
      audio: media.url
    };
  }
);

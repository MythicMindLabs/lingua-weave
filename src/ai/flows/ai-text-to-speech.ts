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
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

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

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const aiTextToSpeechFlow = ai.defineFlow(
  {
    name: 'aiTextToSpeechFlow',
    inputSchema: AiTextToSpeechInputSchema,
    outputSchema: AiTextToSpeechOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
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
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audio: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

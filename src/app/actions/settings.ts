'use server';

import fs from 'fs/promises';
import path from 'path';

export async function saveElevenLabsApiKey(apiKey: string) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const lines = envContent.split('\n');
    let keyFound = false;
    const newLines = lines.map((line) => {
      if (line.startsWith('ELEVENLABS_API_KEY=')) {
        keyFound = true;
        return `ELEVENLABS_API_KEY=${apiKey}`;
      }
      return line;
    });

    if (!keyFound) {
      newLines.push(`ELEVENLABS_API_KEY=${apiKey}`);
    }

    await fs.writeFile(envPath, newLines.join('\n'));

    return { success: true };
  } catch (error) {
    console.error('Failed to save API key:', error);
    return { success: false, error: 'Failed to save API key.' };
  }
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, Volume2 } from 'lucide-react';
import { aiVocabularyTutor, type AIVocabularyTutorOutput } from '@/ai/flows/ai-vocabulary-tutor';
import { aiTextToSpeech } from '@/ai/flows/ai-text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface VocabularyModeProps {
  language: string;
  topic: string;
}

export function VocabularyMode({ language, topic }: VocabularyModeProps) {
  const [lesson, setLesson] = useState<AIVocabularyTutorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState<string | null>(null);
  const { toast } = useToast();

  const generateLesson = async () => {
    setIsLoading(true);
    setLesson(null);

    try {
      const response = await aiVocabularyTutor({
        language,
        topic,
      });
      setLesson(response);
    } catch (error) {
      console.error('Error generating vocabulary lesson:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate a lesson. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayAudio = async (text: string) => {
    setIsSynthesizing(text);
    try {
      const { audio } = await aiTextToSpeech({ text });
      const audioPlayer = new Audio(audio);
      audioPlayer.play();
      audioPlayer.onended = () => setIsSynthesizing(null);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to synthesize audio. Please try again.',
      });
      setIsSynthesizing(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Vocabulary Tutor</CardTitle>
          <CardDescription>
            Generate a new vocabulary lesson for {language} on the topic of {topic}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateLesson} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Lesson...
              </>
            ) : (
               <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate New Lesson
               </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-headline text-xl">New Vocabulary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-2/3" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-headline text-xl">Example Sentences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="font-headline text-xl">Reinforcement Exercises</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </CardContent>
          </Card>
        </div>
      )}

      {lesson && !isLoading && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">New Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {lesson.newVocabulary.map((word, index) => (
                  <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <span className="font-medium font-code">{word}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handlePlayAudio(word)}
                      disabled={isSynthesizing !== null}
                    >
                       {isSynthesizing === word ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                       <span className="sr-only">Play audio for {word}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Example Sentences</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {lesson.exampleSentences.map((sentence, index) => (
                   <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                    <p className="text-muted-foreground italic">"{sentence}"</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handlePlayAudio(sentence)}
                      disabled={isSynthesizing !== null}
                    >
                       {isSynthesizing === sentence ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                       <span className="sr-only">Play audio for sentence</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Reinforcement Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {lesson.reinforcementExercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {!lesson && !isLoading && (
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No lesson generated yet</h3>
          <p className="mt-1 text-sm text-gray-500">Click the button above to start your learning journey.</p>
        </div>
      )}
    </div>
  );
}

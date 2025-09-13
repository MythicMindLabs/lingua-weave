'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { aiGrammarCheck, type AiGrammarCheckOutput } from '@/ai/flows/ai-grammar-check';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface GrammarModeProps {
  language: 'mandarin' | 'french';
  dialect: string;
}

export function GrammarMode({ language, dialect }: GrammarModeProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AiGrammarCheckOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckGrammar = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to check.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await aiGrammarCheck({
        text,
        language,
        dialect,
      });
      setResult(response);
    } catch (error) {
      console.error('Error checking grammar:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to check grammar. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Grammar Check</CardTitle>
          <CardDescription>
            Enter a sentence in {language} and the AI will check its grammar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[150px] text-base"
              disabled={isLoading}
            />
            <Button onClick={handleCheckGrammar} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Grammar'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Corrected Text</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-primary">{result.correctedText}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Loader2, User, Bot, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { aiChatbot } from '@/ai/flows/ai-chatbot';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ConversationModeProps {
  language: 'mandarin' | 'french';
  dialect: string;
  topic: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ConversationMode({ language, dialect, topic }: ConversationModeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [language, dialect, topic]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await aiChatbot({
        language,
        dialect,
        topic,
        userMessage: input,
      });

      if (result.aiResponse) {
        const aiMessage: Message = { role: 'assistant', content: result.aiResponse };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error during AI chat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
      });
      setMessages(prev => prev.slice(0, -1)); // remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col max-h-[calc(100vh-4rem)]">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Conversation Practice</CardTitle>
        <CardDescription>Practice your {language} speaking skills on the topic of {topic}.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                   {message.role === 'assistant' && (
                     <Button variant="ghost" size="icon" className="mt-2 h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Volume2 className="h-4 w-4" />
                        <span className="sr-only">Play audio</span>
                     </Button>
                   )}
                </div>
                {message.role === 'user' && (
                   <Avatar className="w-8 h-8">
                     <AvatarFallback><User size={20}/></AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot size={20}/></AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg px-4 py-3 bg-muted flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground py-8">
                <p>Start the conversation by sending a message.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type your message in ${language}...`}
            className="flex-1"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

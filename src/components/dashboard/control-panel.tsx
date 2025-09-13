'use client';

import type { Language, Dialect, Topic, Mode } from '@/app/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { BookOpenCheck, Languages, Lightbulb, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  language: Language;
  dialect: Dialect;
  topic: Topic;
  mode: Mode;
  availableDialects: Dialect[];
  onLanguageChange: (language: Language) => void;
  onDialectChange: (dialect: Dialect) => void;
  onTopicChange: (topic: Topic) => void;
  onModeChange: (mode: Mode) => void;
}

const topics: Topic[] = ['Greetings', 'Dining', 'Shopping', 'Travel', 'Business'];

export function ControlPanel({
  language,
  dialect,
  topic,
  mode,
  availableDialects,
  onLanguageChange,
  onDialectChange,
  onTopicChange,
  onModeChange,
}: ControlPanelProps) {
  return (
    <aside className="flex flex-col bg-card border-r p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          LinguaWeave
        </h1>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <h2 className="text-lg font-semibold mb-4 font-headline tracking-tight">Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">Language</Label>
              <Select
                value={language}
                onValueChange={(value) => onLanguageChange(value as Language)}
              >
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="french">French 🇫🇷</SelectItem>
                  <SelectItem value="mandarin">Mandarin 🇨🇳</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialect-select">Dialect</Label>
              <Select
                value={dialect}
                onValueChange={(value) => onDialectChange(value as Dialect)}
              >
                <SelectTrigger id="dialect-select" className="w-full">
                  <SelectValue placeholder="Select a dialect" />
                </SelectTrigger>
                <SelectContent>
                  {availableDialects.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-select">Topic</Label>
              <Select
                value={topic}
                onValueChange={(value) => onTopicChange(value as Topic)}
              >
                <SelectTrigger id="topic-select" className="w-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold mb-4 font-headline tracking-tight">Learning Mode</h2>
          <div className="flex flex-col space-y-2">
            <Button
              variant={mode === 'Conversation' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => onModeChange('Conversation')}
            >
              <MessagesSquare className="mr-2 h-4 w-4" />
              Conversation
            </Button>
            <Button
              variant={mode === 'Grammar' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => onModeChange('Grammar')}
            >
              <BookOpenCheck className="mr-2 h-4 w-4" />
              Grammar Check
            </Button>
            <Button
              variant={mode === 'Vocabulary' ? 'default' : 'ghost'}
              className="justify-start"
              onClick={() => onModeChange('Vocabulary')}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Vocabulary Tutor
            </Button>
          </div>
        </div>
      </div>
      <footer className="text-center text-xs text-muted-foreground mt-6">
        <p>&copy; {new Date().getFullYear()} LinguaWeave</p>
      </footer>
    </aside>
  );
}

'use client';

import { useState } from 'react';
import { ControlPanel } from '@/components/dashboard/control-panel';
import { ConversationMode } from '@/components/dashboard/conversation-mode';
import { GrammarMode } from '@/components/dashboard/grammar-mode';
import { VocabularyMode } from '@/components/dashboard/vocabulary-mode';
import { Card, CardContent } from '@/components/ui/card';
import { Languages } from 'lucide-react';

export type Language = 'mandarin' | 'french';
export type Dialect = 'Beijing' | 'Taiwanese' | 'Metropolitan' | 'Québécois';
export type Topic = 'Greetings' | 'Dining' | 'Shopping' | 'Travel' | 'Business';
export type Mode = 'Conversation' | 'Grammar' | 'Vocabulary';

const dialects: Record<Language, Dialect[]> = {
  mandarin: ['Beijing', 'Taiwanese'],
  french: ['Metropolitan', 'Québécois'],
};

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>('french');
  const [dialect, setDialect] = useState<Dialect>('Metropolitan');
  const [topic, setTopic] = useState<Topic>('Greetings');
  const [mode, setMode] = useState<Mode>('Conversation');

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setDialect(dialects[newLanguage][0]);
  };

  return (
    <div className="grid md:grid-cols-[320px_1fr] min-h-screen">
      <ControlPanel
        language={language}
        dialect={dialect}
        topic={topic}
        mode={mode}
        availableDialects={dialects[language]}
        onLanguageChange={handleLanguageChange}
        onDialectChange={setDialect}
        onTopicChange={setTopic}
        onModeChange={setMode}
      />

      <main className="p-4 md:p-6 lg:p-8 overflow-y-auto">
        {mode === 'Conversation' && <ConversationMode language={language} dialect={dialect} topic={topic} />}
        {mode === 'Grammar' && <GrammarMode language={language} dialect={dialect} />}
        {mode === 'Vocabulary' && <VocabularyMode language={language} topic={topic} />}
      </main>
    </div>
  );
}

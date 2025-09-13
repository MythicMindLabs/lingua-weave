import { Languages } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Languages className="h-12 w-12 animate-pulse text-primary" />
        <p className="font-headline text-xl text-primary/80">LinguaWeave</p>
      </div>
    </div>
  );
}

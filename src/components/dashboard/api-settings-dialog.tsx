'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveElevenLabsApiKey } from '@/app/actions/settings';
import { Loader2 } from 'lucide-react';

interface ApiSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiSettingsDialog({ open, onOpenChange }: ApiSettingsDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveElevenLabsApiKey(apiKey);
    setIsSaving(false);
    if (result.success) {
      toast({
        title: 'API Key Saved',
        description: 'Your ElevenLabs API key has been saved successfully.',
      });
      onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Saving API Key',
        description: result.error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Manage your API keys for third-party services here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="elevenlabs-key" className="text-right">
              ElevenLabs
            </Label>
            <Input
              id="elevenlabs-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your ElevenLabs API Key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !apiKey}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@heroui/react';
import { VersionManager } from '@/components/versions';

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presentationId?: string;
}

/**
 * A dialog that displays version history for a presentation
 */
export function VersionHistoryDialog({ 
  isOpen, 
  onClose, 
  presentationId 
}: VersionHistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        
        <VersionManager
          presentationId={presentationId}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to manage the version history dialog state
 */
export function useVersionHistoryDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [presentationId, setPresentationId] = React.useState<string | undefined>(undefined);
  
  const openDialog = React.useCallback((id?: string) => {
    setPresentationId(id);
    setIsOpen(true);
  }, []);
  
  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const dialog = React.useMemo(() => (
    <VersionHistoryDialog
      isOpen={isOpen}
      onClose={closeDialog}
      presentationId={presentationId}
    />
  ), [isOpen, closeDialog, presentationId]);
  
  return {
    dialog,
    openVersionHistory: openDialog,
    closeVersionHistory: closeDialog,
  };
} 
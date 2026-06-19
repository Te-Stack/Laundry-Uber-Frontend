import { Button } from '@/components/ui/button';

// ============================================================================
// DeleteServiceDialog
// A simple confirmation modal used in MyServices before permanently removing
// a service listing.
// ============================================================================

interface DeleteServiceDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteServiceDialog({ isDeleting, onCancel, onConfirm }: DeleteServiceDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-card rounded-xl p-6 max-w-sm mx-4 space-y-4">
        <h3 className="font-semibold">Delete Service?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone. The service will be permanently removed.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

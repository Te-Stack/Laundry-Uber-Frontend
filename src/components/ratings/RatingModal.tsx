import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { laundryApi } from '@/services/laundryApi';
import { queryKeys } from '@/lib/queryKeys';
import { queryClient } from '@/lib/queryClient';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RatingModalProps {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for submitting a rating and review after a request is delivered.
 */
export function RatingModal({ requestId, isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { mutate: submitRating, isPending } = useMutation({
    mutationFn: () => laundryApi.rateRequest(requestId, rating, review || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.customer() });
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-card rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-1">Rate Your Experience</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          How was your laundry service? Your feedback helps providers improve.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="review">Review (optional)</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => submitRating()}
            disabled={rating === 0 || isPending}
            className="flex-1"
          >
            {isPending ? 'Submitting...' : 'Submit Rating'}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

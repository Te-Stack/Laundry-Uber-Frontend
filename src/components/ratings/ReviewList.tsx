import { StarRating } from './StarRating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review?: string;
  date: string;
}

interface ReviewListProps {
  reviews: Review[];
}

/**
 * Displays a list of customer reviews sorted by most recent.
 */
export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">No reviews yet.</p>
    );
  }

  const sorted = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sorted.map((r) => (
        <div key={r.id} className="flex gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback className="text-xs">{r.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm">{r.customerName}</span>
              <span className="text-xs text-gray-400">
                {new Date(r.date).toLocaleDateString()}
              </span>
            </div>
            <StarRating value={r.rating} readonly size="sm" />
            {r.review && (
              <p className="text-sm text-gray-600 mt-1">{r.review}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Phone, Star } from 'lucide-react';
import { useProviderProfile, useProviderSchedule } from '@/hooks/useProviders';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { ReviewList, type Review } from '@/components/ratings/ReviewList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ProviderProfileProps {
  providerId: string;
}

/**
 * Full provider profile showing name, rating, services, schedule, and reviews.
 */
export function ProviderProfile({ providerId }: ProviderProfileProps) {
  const navigate = useNavigate();
  const { data: profileResult, isLoading } = useProviderProfile(providerId);
  const { data: scheduleResult } = useProviderSchedule(providerId);

  const provider = profileResult?.data;
  const scheduleData = scheduleResult?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Loading provider profile...
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Provider not found.
      </div>
    );
  }

  // Build placeholder reviews from provider data (real reviews would come from a dedicated endpoint)
  const reviews: Review[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl">{provider.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">{provider.fullName}</h2>
            <Badge
              className={provider.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}
            >
              {provider.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {provider.rating.toFixed(1)} ({provider.totalRatings} ratings)
            </span>
            {provider.phoneNumber && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {provider.phoneNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button onClick={() => navigate(`/messages/${providerId}`)}>
          Message Provider
        </Button>
        <Button variant="outline" onClick={() => navigate('/services')}>
          Book Service
        </Button>
      </div>

      {/* Schedule */}
      {scheduleData?.schedule && (
        <div>
          <h3 className="font-semibold mb-3">Availability Schedule</h3>
          <ScheduleGrid schedule={scheduleData.schedule} readonly />
        </div>
      )}

      {/* Reviews */}
      <div>
        <h3 className="font-semibold mb-3">Reviews</h3>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}

import { StarIcon } from 'hugeicons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types/api';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

const categoryColors: Record<string, string> = {
  washing: 'bg-blue-100 text-blue-700',
  dry_cleaning: 'bg-purple-100 text-purple-700',
  ironing: 'bg-orange-100 text-orange-700',
  folding: 'bg-green-100 text-green-700',
  special: 'bg-pink-100 text-pink-700',
};

const unitLabels: Record<string, string> = {
  per_piece: 'per piece',
  per_kg: 'per kg',
  per_load: 'per load',
};

/**
 * Card displaying a laundry service with pricing and provider info.
 */
export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{service.name}</CardTitle>
          <Badge className={`text-xs flex-shrink-0 ${categoryColors[service.category] ?? 'bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-400'}`}>
            {service.category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {service.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.description}</p>
        )}

        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-gray-900 dark:text-foreground">
            ₦{service.basePrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">{unitLabels[service.unit] ?? service.unit}</span>
        </div>

        {service.estimatedDuration > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Est. {service.estimatedDuration}h turnaround
          </p>
        )}

        {service.provider && (
          <div className="flex items-center gap-2 pt-1 border-t">
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {service.provider.fullName || (service.provider as any).name || "Provider"}
            </span>
            <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
              <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {service.provider.rating != null ? Number(service.provider.rating).toFixed(1) : "5.0"}
              </span>
            </div>
          </div>
        )}

        {onBook && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onBook(service)}
          >
            Book Service
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

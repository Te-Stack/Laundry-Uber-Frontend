import { useState } from 'react';
import { Search } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from './ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Service, ServiceCategory } from '@/types/api';

const CATEGORIES: { value: ServiceCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'washing', label: 'Washing' },
  { value: 'dry_cleaning', label: 'Dry Cleaning' },
  { value: 'ironing', label: 'Ironing' },
  { value: 'folding', label: 'Folding' },
  { value: 'special', label: 'Special' },
];

interface ServiceGridProps {
  onBook?: (service: Service) => void;
}

/**
 * Responsive grid of services with category filter and search.
 */
export function ServiceGrid({ onBook }: ServiceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: result, isLoading } = useServices(
    selectedCategory !== 'all' ? { category: selectedCategory } : undefined
  );

  const services = (result?.data ?? []).filter((s) =>
    search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            size="sm"
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No services found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onBook={onBook} />
          ))}
        </div>
      )}
    </div>
  );
}

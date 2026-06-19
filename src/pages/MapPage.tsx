import { ProviderMap } from '@/components/maps/ProviderMap';
import { Navigation } from '@/components/Navigation';

/**
 * Map page showing nearby providers for customers.
 */
export function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Find Nearby Providers</h1>
        <ProviderMap />
      </main>
    </div>
  );
}

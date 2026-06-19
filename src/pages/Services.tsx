import { ServiceGrid } from '@/components/services/ServiceGrid';
import { Navigation } from '@/components/Navigation';

/**
 * Customer-facing service catalog page.
 */
export function Services() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse Services</h1>
        <ServiceGrid />
      </main>
    </div>
  );
}

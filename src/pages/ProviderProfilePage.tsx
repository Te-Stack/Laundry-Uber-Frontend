import { useParams } from 'react-router-dom';
import { ProviderProfile } from '@/components/providers/ProviderProfile';
import { Navigation } from '@/components/Navigation';

/**
 * Provider profile page. Uses URL params to determine which provider to show.
 */
export function ProviderProfilePage() {
  const { providerId } = useParams<{ providerId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {providerId ? (
          <ProviderProfile providerId={providerId} />
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-center py-12">Provider not found.</p>
        )}
      </main>
    </div>
  );
}

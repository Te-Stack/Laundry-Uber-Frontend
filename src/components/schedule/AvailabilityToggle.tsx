import { useToggleAvailability } from '@/hooks/useSchedule';
import { useCurrentUser } from '@/hooks/useProfile';

/**
 * Toggle switch for provider online/offline availability.
 */
export function AvailabilityToggle() {
  const { data: userResult } = useCurrentUser();
  const { mutate: toggle, isPending } = useToggleAvailability();

  const isOnline = userResult?.data?.isOnline ?? false;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
      <button
        role="switch"
        aria-checked={isOnline}
        disabled={isPending}
        onClick={() => toggle(!isOnline)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
          isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            isOnline ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

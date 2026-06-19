import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useProfile';
import { useProviderSchedule, useSetSchedule } from '@/hooks/useSchedule';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { AvailabilityToggle } from '@/components/schedule/AvailabilityToggle';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import type { ProviderSchedule } from '@/types/api';

const DEFAULT_SCHEDULE: ProviderSchedule = {
  monday: { start: '09:00', end: '18:00' },
  tuesday: { start: '09:00', end: '18:00' },
  wednesday: { start: '09:00', end: '18:00' },
  thursday: { start: '09:00', end: '18:00' },
  friday: { start: '09:00', end: '17:00' },
  saturday: { start: '10:00', end: '14:00' },
  sunday: null,
};

/**
 * Provider schedule management page.
 */
export function Schedule() {
  const { data: userResult } = useCurrentUser();
  const providerId = userResult?.data?.id ?? null;

  const { data: scheduleResult } = useProviderSchedule(providerId);
  const { mutate: saveSchedule, isPending, isSuccess } = useSetSchedule();

  const [schedule, setSchedule] = useState<ProviderSchedule>(DEFAULT_SCHEDULE);

  // Populate schedule from server data
  useEffect(() => {
    if (scheduleResult?.data?.schedule) {
      setSchedule(scheduleResult.data.schedule);
    }
  }, [scheduleResult]);

  const handleSave = () => {
    saveSchedule(schedule);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <AvailabilityToggle />
        </div>

        <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-1">Weekly Availability</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set your working hours for each day. Uncheck a day to mark it as unavailable.
            </p>
            <ScheduleGrid schedule={schedule} onChange={setSchedule} />
          </div>

          {isSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-3 py-2 text-sm text-green-700 dark:text-green-400">
              Schedule saved successfully!
            </div>
          )}

          <Button onClick={handleSave} disabled={isPending} className="w-full">
            {isPending ? 'Saving...' : 'Save Schedule'}
          </Button>
        </div>
      </main>
    </div>
  );
}

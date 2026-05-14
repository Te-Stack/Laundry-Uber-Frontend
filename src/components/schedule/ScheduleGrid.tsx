import type { ProviderSchedule, DaySchedule } from '@/types/api';

const DAYS: { key: keyof ProviderSchedule; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface ScheduleGridProps {
  schedule: ProviderSchedule;
  onChange?: (schedule: ProviderSchedule) => void;
  readonly?: boolean;
}

/**
 * Weekly schedule grid with time pickers for each day.
 * Validates that end time is after start time.
 */
export function ScheduleGrid({ schedule, onChange, readonly = false }: ScheduleGridProps) {
  const handleDayToggle = (day: keyof ProviderSchedule, available: boolean) => {
    if (!onChange) return;
    onChange({
      ...schedule,
      [day]: available ? { start: '09:00', end: '18:00' } : null,
    });
  };

  const handleTimeChange = (
    day: keyof ProviderSchedule,
    field: keyof DaySchedule,
    value: string
  ) => {
    if (!onChange) return;
    const current = schedule[day] ?? { start: '09:00', end: '18:00' };
    const updated = { ...current, [field]: value };

    // Validate end > start
    if (updated.start >= updated.end) return;

    onChange({ ...schedule, [day]: updated });
  };

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const daySchedule = schedule[key];
        const isAvailable = daySchedule !== null && daySchedule !== undefined;

        return (
          <div
            key={key}
            className={`flex items-center gap-4 p-3 rounded-lg border ${
              isAvailable ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            {/* Day toggle */}
            <div className="w-28 flex items-center gap-2">
              {!readonly && (
                <input
                  type="checkbox"
                  id={`day-${key}`}
                  checked={isAvailable}
                  onChange={(e) => handleDayToggle(key, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
              )}
              <label
                htmlFor={`day-${key}`}
                className={`text-sm font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {label}
              </label>
            </div>

            {/* Time pickers */}
            {isAvailable ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={daySchedule?.start ?? '09:00'}
                  onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                  disabled={readonly}
                  className="h-8 rounded border border-gray-300 px-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="time"
                  value={daySchedule?.end ?? '18:00'}
                  onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                  disabled={readonly}
                  className="h-8 rounded border border-gray-300 px-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Unavailable</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

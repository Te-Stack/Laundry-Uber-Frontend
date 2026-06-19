/**
 * Maps a LaundryRequest status string to Tailwind CSS badge colour classes.
 * Single source of truth — imported by CustomerDashboard and ProviderDashboard.
 */
export const STATUS_COLORS: Record<string, string> = {
  pending:          'bg-yellow-100 text-yellow-800',
  accepted:         'bg-blue-100 text-blue-800',
  declined:         'bg-red-100 text-red-800',
  picked_up:        'bg-purple-100 text-purple-800',
  washing:          'bg-indigo-100 text-indigo-800',
  ready:            'bg-green-100 text-green-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered:        'bg-gray-100 text-gray-800',
};

/**
 * Returns the Tailwind colour classes for the given request status.
 * Falls back to a neutral grey if the status is unrecognised.
 */
export const getStatusColor = (status: string): string =>
  STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800';

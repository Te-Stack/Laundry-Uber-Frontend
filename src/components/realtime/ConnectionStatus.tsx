import { useSocket } from '@/contexts/SocketContext';

/**
 * Displays the current Socket.IO connection status.
 * Green dot = connected, red = disconnected.
 */
export function ConnectionStatus() {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center gap-1.5" title={isConnected ? 'Connected' : 'Disconnected'}>
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}

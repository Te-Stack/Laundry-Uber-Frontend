import { Link } from 'react-router-dom';
import { usePaymentHistory } from '@/hooks/usePayments';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

/**
 * Page showing the user's payment history.
 */
export function PaymentHistory() {
  const { data: result, isLoading } = usePaymentHistory();
  const payments = result?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>

        {isLoading ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-12">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-12">No payments yet.</p>
        ) : (
          <div className="bg-white dark:bg-card rounded-xl border dark:border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-muted border-b dark:border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-border">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-muted">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {payment.reference.slice(-12)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[payment.status] ?? 'bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-400'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {payment.requestId && (
                        <Link
                          to="/dashboard"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                        >
                          #{payment.requestId.slice(-6)}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

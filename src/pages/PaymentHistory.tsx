import { Link } from 'react-router-dom';
import { usePaymentHistory } from '@/hooks/usePayments';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

/**
 * Page showing the user's payment history.
 */
export function PaymentHistory() {
  const { data: result, isLoading } = usePaymentHistory();
  const payments = result?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>

        {isLoading ? (
          <p className="text-gray-400 text-center py-12">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No payments yet.</p>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Reference</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {payment.reference.slice(-12)}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[payment.status] ?? 'bg-gray-100 text-gray-600'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {payment.requestId && (
                        <Link
                          to="/dashboard"
                          className="text-blue-600 hover:underline text-xs"
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

import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useVerifyPayment } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';

/**
 * Page shown after returning from Paystack payment.
 * Extracts the reference from the URL and verifies the payment.
 */
export function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') ?? searchParams.get('trxref');

  const { data: result, isLoading, isError } = useVerifyPayment(reference);

  const paymentData = result?.data?.data;
  const isSuccess = paymentData?.paymentStatus === 'success';

  if (!reference) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-xl font-semibold">Invalid Payment Link</h1>
          <p className="text-gray-500 dark:text-gray-400">No payment reference found in the URL.</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 text-blue-400 mx-auto animate-spin" />
          <h1 className="text-xl font-semibold">Verifying Payment...</h1>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (isError || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <XCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-xl font-semibold">Verification Failed</h1>
          <p className="text-gray-500 dark:text-gray-400">We couldn't verify your payment. Please contact support.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Reference: {reference}</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-xl font-semibold text-green-700 dark:text-green-400">Payment Successful!</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your payment of ₦{paymentData.amount?.toLocaleString()} has been confirmed.
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p>Reference: {paymentData.reference}</p>
              {paymentData.channel && <p>Channel: {paymentData.channel}</p>}
            </div>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h1 className="text-xl font-semibold text-red-700 dark:text-red-400">Payment Failed</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your payment could not be processed. Please try again.
            </p>
          </>
        )}

        <div className="flex gap-2 justify-center pt-2">
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/payments">Payment History</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

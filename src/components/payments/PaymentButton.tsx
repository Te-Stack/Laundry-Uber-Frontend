import { Button } from '@/components/ui/button';
import { useInitializePayment } from '@/hooks/usePayments';

interface PaymentButtonProps {
  requestId: string;
  amount: number;
  userEmail: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

/**
 * Button that initiates a Paystack payment for a laundry request.
 * Redirects to Paystack checkout on click.
 */
export function PaymentButton({ requestId, amount, userEmail, disabled, onSuccess }: PaymentButtonProps) {
  const { mutate: initializePayment, isPending } = useInitializePayment();

  const handleClick = () => {
    initializePayment(
      {
        requestId,
        amount,
        email: userEmail,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Initializing...
        </span>
      ) : (
        'Pay Now'
      )}
    </Button>
  );
}

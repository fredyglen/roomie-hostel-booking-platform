
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

interface PaymentStatusTrackerProps {
  transactionReference: string;
  onStatusUpdate?: (status: string) => void;
}

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  transactionReference,
  onStatusUpdate
}) => {
  const [status, setStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(false);
  const { verifyAndProcessPayment } = useBusinessPaymentFlow();

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      const result = await verifyAndProcessPayment(transactionReference);
      if (result.success) {
        setStatus('success');
        onStatusUpdate?.('success');
      } else {
        setStatus('failed');
        onStatusUpdate?.('failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
      onStatusUpdate?.('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-check status on mount
    checkPaymentStatus();
  }, [transactionReference]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Status</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium">Transaction Reference</p>
            <p className="text-sm text-gray-600 font-mono">{transactionReference}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            {status === 'success' && 'Payment completed successfully!'}
            {status === 'failed' && 'Payment failed. Please try again.'}
            {status === 'error' && 'Error checking payment status. Please contact support.'}
            {status === 'pending' && 'Checking payment status...'}
          </p>
        </div>

        <Button
          onClick={checkPaymentStatus}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Refresh Status'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusTracker;

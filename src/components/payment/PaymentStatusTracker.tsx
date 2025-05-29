
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePaystackIntegration } from '@/hooks/payment/usePaystackIntegration';
import { getTransactionStatus } from '@/utils/paystackIntegration';
import { formatCurrency } from '@/utils/currency';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';

interface PaymentStatusTrackerProps {
  transactionReference: string;
  onStatusUpdate?: (status: string) => void;
}

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  transactionReference,
  onStatusUpdate
}) => {
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { verifyTransaction, verifying } = usePaystackIntegration();

  const fetchTransactionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTransactionStatus(transactionReference);
      setTransaction(data);
      
      if (onStatusUpdate) {
        onStatusUpdate(data.status);
      }
    } catch (err) {
      setError('Failed to fetch transaction status');
      console.error('Error fetching transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    try {
      await verifyTransaction(transactionReference);
      await fetchTransactionStatus();
    } catch (err) {
      setError('Payment verification failed');
    }
  };

  useEffect(() => {
    fetchTransactionStatus();
    
    // Poll for status updates every 30 seconds for pending transactions
    const interval = setInterval(() => {
      if (transaction?.status === 'pending') {
        fetchTransactionStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [transactionReference]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !transaction) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading transaction details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !transaction) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTransactionStatus} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Status</span>
          {transaction && (
            <Badge className={getStatusColor(transaction.status)}>
              {getStatusIcon(transaction.status)}
              <span className="ml-1 capitalize">{transaction.status}</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {transaction && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Reference</p>
                <p className="font-mono text-xs">{transaction.reference}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-gray-600">Currency</p>
                <p>{transaction.currency}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="capitalize">{transaction.payment_method || 'Not specified'}</p>
              </div>
            </div>

            {transaction.paystack_reference && (
              <div>
                <p className="text-gray-600 text-sm">Paystack Reference</p>
                <p className="font-mono text-xs">{transaction.paystack_reference}</p>
              </div>
            )}

            <div>
              <p className="text-gray-600 text-sm">Created</p>
              <p className="text-sm">{new Date(transaction.created_at).toLocaleString()}</p>
            </div>

            {transaction.status === 'pending' && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleVerifyPayment}
                  disabled={verifying}
                  variant="outline"
                  className="w-full"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Verify Payment
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Click to check if payment has been completed
                </p>
              </div>
            )}

            {transaction.status === 'success' && (
              <div className="pt-4 border-t bg-green-50 p-3 rounded-lg">
                <div className="flex items-center text-green-800">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span className="font-medium">Payment Successful</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your payment has been processed successfully.
                </p>
              </div>
            )}

            {transaction.status === 'failed' && (
              <div className="pt-4 border-t bg-red-50 p-3 rounded-lg">
                <div className="flex items-center text-red-800">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Payment Failed</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Your payment could not be processed. Please try again.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatusTracker;

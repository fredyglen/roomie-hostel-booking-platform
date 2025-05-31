
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NextStepsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What's Next?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm">You'll receive a confirmation email with detailed instructions</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm">The property owner will contact you within 24 hours</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm">Your agent will coordinate move-in details</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm">Keep your booking reference for all communications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;

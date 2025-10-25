import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BuildingCreatorGatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (requiresStructure: boolean) => void;
}

const BuildingCreatorGatingModal: React.FC<BuildingCreatorGatingModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [q3, setQ3] = useState<boolean | null>(null);

  const canContinue = q1 !== null && q2 !== null && q3 !== null;
  const requiresStructure = !!(q1 || q2 || q3);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Smart Building Setup</DialogTitle>
          <DialogDescription>
            Answer a few quick questions so we can decide if you should use the Intelligent Building Creator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">1) Do you have multiple buildings on this property?</p>
            <div className="flex gap-2">
              <Button variant={q1 === true ? 'default' : 'outline'} size="sm" onClick={() => setQ1(true)}>Yes</Button>
              <Button variant={q1 === false ? 'default' : 'outline'} size="sm" onClick={() => setQ1(false)}>No</Button>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">2) Do you want to manage individual rooms and availability?</p>
            <div className="flex gap-2">
              <Button variant={q2 === true ? 'default' : 'outline'} size="sm" onClick={() => setQ2(true)}>Yes</Button>
              <Button variant={q2 === false ? 'default' : 'outline'} size="sm" onClick={() => setQ2(false)}>No</Button>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">3) Do you need floor-by-floor configuration?</p>
            <div className="flex gap-2">
              <Button variant={q3 === true ? 'default' : 'outline'} size="sm" onClick={() => setQ3(true)}>Yes</Button>
              <Button variant={q3 === false ? 'default' : 'outline'} size="sm" onClick={() => setQ3(false)}>No</Button>
            </div>
          </div>

          <Separator />
          <div className="rounded-md bg-amber-50 p-3 text-amber-900 text-sm">
            If you answered "Yes" to any question, we'll guide you to set up your building structure first.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!canContinue} onClick={() => onConfirm(requiresStructure)}>
            {requiresStructure ? 'Use Intelligent Building Creator' : 'Skip for now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingCreatorGatingModal;


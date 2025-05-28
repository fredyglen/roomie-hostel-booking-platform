
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Users, Bed, Lightbulb, Star } from 'lucide-react';

interface StructureTabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StructureTabModal: React.FC<StructureTabModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building className="w-6 h-6 text-blue-500" />
            <span>Building Structure - What is this?</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>What is Building Structure?</span>
              </h3>
              <p className="text-gray-600">
                Building Structure allows you to create detailed layouts of your property with multiple buildings, 
                floors, and individual rooms. This helps students visualize your property better and makes 
                booking management more precise.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold">Buildings</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Create multiple buildings (Block A, Block B, etc.)</li>
                  <li>• Set building-specific amenities</li>
                  <li>• Add building descriptions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold">Floors</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Organize rooms by floors</li>
                  <li>• Ground floor, First floor, etc.</li>
                  <li>• Floor-specific features</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Bed className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold">Rooms</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Individual room management</li>
                  <li>• Set room-specific pricing</li>
                  <li>• Track bed availability</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold">Benefits</h4>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Professional property presentation</li>
                  <li>• Better booking management</li>
                  <li>• Higher student trust</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-gray-600">
                Use the <strong>Intelligent Building Creator</strong> to quickly generate your entire building 
                structure with consistent room naming (like FK101, FK102 based on your initials). 
                You can always edit individual rooms later!
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Got it, let's build!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StructureTabModal;

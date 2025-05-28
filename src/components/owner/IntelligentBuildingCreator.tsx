
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Building, Users, Bed } from 'lucide-react';

interface IntelligentBuildingCreatorProps {
  onCreateBuilding: (buildingData: any) => void;
}

const IntelligentBuildingCreator: React.FC<IntelligentBuildingCreatorProps> = ({ onCreateBuilding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [buildingConfig, setBuildingConfig] = useState({
    buildingName: '',
    ownerInitials: '',
    totalFloors: 1,
    roomsPerFloor: 4,
    bedsPerRoom: 2,
    baseRent: 1500,
    roomType: 'shared',
    amenities: [] as string[]
  });

  const handleConfigChange = (field: string, value: any) => {
    setBuildingConfig(prev => ({ ...prev, [field]: value }));
  };

  const generateRoomNumber = (floor: number, roomIndex: number) => {
    const { ownerInitials } = buildingConfig;
    if (ownerInitials) {
      return `${ownerInitials}${floor}${String(roomIndex + 1).padStart(2, '0')}`;
    }
    return `Room ${floor}${String(roomIndex + 1).padStart(2, '0')}`;
  };

  const createIntelligentBuilding = () => {
    const { buildingName, totalFloors, roomsPerFloor, bedsPerRoom, baseRent, roomType } = buildingConfig;
    
    const floors = [];
    for (let floorNum = 1; floorNum <= totalFloors; floorNum++) {
      const rooms = [];
      for (let roomIndex = 0; roomIndex < roomsPerFloor; roomIndex++) {
        rooms.push({
          id: `room-${Date.now()}-${floorNum}-${roomIndex}`,
          roomNumber: generateRoomNumber(floorNum, roomIndex),
          roomType,
          bedCount: bedsPerRoom,
          bedsAvailable: bedsPerRoom,
          maxOccupants: bedsPerRoom,
          rentAmount: baseRent,
          amenities: [],
          description: `${roomType} room with ${bedsPerRoom} beds`
        });
      }
      
      floors.push({
        id: `floor-${Date.now()}-${floorNum}`,
        floorNumber: floorNum,
        name: `Floor ${floorNum}`,
        description: `Floor ${floorNum} with ${roomsPerFloor} rooms`,
        rooms
      });
    }

    const newBuilding = {
      id: `building-${Date.now()}`,
      name: buildingName || `Intelligent Building ${Date.now()}`,
      description: `Auto-generated building with ${totalFloors} floors, ${roomsPerFloor} rooms per floor`,
      floors
    };

    onCreateBuilding(newBuilding);
    setIsOpen(false);
    setStep(1);
  };

  const getTotalStats = () => {
    const totalRooms = buildingConfig.totalFloors * buildingConfig.roomsPerFloor;
    const totalBeds = totalRooms * buildingConfig.bedsPerRoom;
    return { totalRooms, totalBeds };
  };

  const stats = getTotalStats();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Wand2 className="w-4 h-4 mr-2" />
          Intelligent Building Creator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>Intelligent Building Creator</span>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buildingName">Building Name</Label>
                <Input
                  id="buildingName"
                  value={buildingConfig.buildingName}
                  onChange={(e) => handleConfigChange('buildingName', e.target.value)}
                  placeholder="e.g., Main Block, Block A"
                />
              </div>
              <div>
                <Label htmlFor="ownerInitials">Owner Initials (for room naming)</Label>
                <Input
                  id="ownerInitials"
                  value={buildingConfig.ownerInitials}
                  onChange={(e) => handleConfigChange('ownerInitials', e.target.value.toUpperCase())}
                  placeholder="e.g., FK, JD"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalFloors">Total Floors</Label>
                <Input
                  id="totalFloors"
                  type="number"
                  min="1"
                  max="20"
                  value={buildingConfig.totalFloors}
                  onChange={(e) => handleConfigChange('totalFloors', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="roomsPerFloor">Rooms Per Floor</Label>
                <Input
                  id="roomsPerFloor"
                  type="number"
                  min="1"
                  max="50"
                  value={buildingConfig.roomsPerFloor}
                  onChange={(e) => handleConfigChange('roomsPerFloor', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="bedsPerRoom">Beds Per Room</Label>
                <Select value={String(buildingConfig.bedsPerRoom)} onValueChange={(value) => handleConfigChange('bedsPerRoom', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bed (Single)</SelectItem>
                    <SelectItem value="2">2 Beds (Double)</SelectItem>
                    <SelectItem value="3">3 Beds (Triple)</SelectItem>
                    <SelectItem value="4">4 Beds (Quad)</SelectItem>
                    <SelectItem value="6">6 Beds (Shared)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baseRent">Base Rent (₵)</Label>
                <Input
                  id="baseRent"
                  type="number"
                  min="0"
                  value={buildingConfig.baseRent}
                  onChange={(e) => handleConfigChange('baseRent', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={buildingConfig.roomType} onValueChange={(value) => handleConfigChange('roomType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-blue-600">
                      <Building className="w-4 h-4" />
                      <span className="font-bold">{buildingConfig.totalFloors}</span>
                    </div>
                    <p className="text-xs text-blue-800">Floors</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-green-600">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">{stats.totalRooms}</span>
                    </div>
                    <p className="text-xs text-green-800">Rooms</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-orange-600">
                      <Bed className="w-4 h-4" />
                      <span className="font-bold">{stats.totalBeds}</span>
                    </div>
                    <p className="text-xs text-orange-800">Beds</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-600">Sample room names:</p>
                  <div className="flex justify-center space-x-2 mt-1">
                    {[0, 1, 2].map((index) => (
                      <Badge key={index} variant="outline">
                        {generateRoomNumber(1, index)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createIntelligentBuilding}>
                Create Building
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IntelligentBuildingCreator;


import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Plus, Minus, Building, Users, Bed } from 'lucide-react';

interface BuildingStructureFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

interface Building {
  id: string;
  name: string;
  description: string;
  floors: Floor[];
}

interface Floor {
  id: string;
  floorNumber: number;
  name: string;
  description: string;
  rooms: Room[];
}

interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  bedCount: number;
  bedsAvailable: number;
  maxOccupants: number;
  rentAmount: number;
  amenities: string[];
  description: string;
}

const BuildingStructureFields: React.FC<BuildingStructureFieldsProps> = ({ form, propertyCategory }) => {
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: '1',
      name: 'Main Building',
      description: '',
      floors: [
        {
          id: '1',
          floorNumber: 1,
          name: 'Ground Floor',
          description: '',
          rooms: [
            {
              id: '1',
              roomNumber: 'Room 101',
              roomType: 'double',
              bedCount: 2,
              bedsAvailable: 2,
              maxOccupants: 2,
              rentAmount: 1500,
              amenities: [],
              description: ''
            }
          ]
        }
      ]
    }
  ]);

  const addBuilding = () => {
    const newBuilding: Building = {
      id: Date.now().toString(),
      name: `Building ${buildings.length + 1}`,
      description: '',
      floors: [
        {
          id: Date.now().toString(),
          floorNumber: 1,
          name: 'Ground Floor',
          description: '',
          rooms: []
        }
      ]
    };
    setBuildings([...buildings, newBuilding]);
  };

  const addFloor = (buildingId: string) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        const newFloor: Floor = {
          id: Date.now().toString(),
          floorNumber: building.floors.length + 1,
          name: `Floor ${building.floors.length + 1}`,
          description: '',
          rooms: []
        };
        return { ...building, floors: [...building.floors, newFloor] };
      }
      return building;
    }));
  };

  const addRoom = (buildingId: string, floorId: string) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => {
            if (floor.id === floorId) {
              const roomNumber = `Room ${floor.floorNumber}${(floor.rooms.length + 1).toString().padStart(2, '0')}`;
              const newRoom: Room = {
                id: Date.now().toString(),
                roomNumber,
                roomType: propertyCategory === 'Hostel' ? 'shared' : 'single',
                bedCount: propertyCategory === 'Hostel' ? 4 : 1,
                bedsAvailable: propertyCategory === 'Hostel' ? 4 : 1,
                maxOccupants: propertyCategory === 'Hostel' ? 4 : propertyCategory === 'Homestel' ? 2 : 1,
                rentAmount: 1500,
                amenities: [],
                description: ''
              };
              return { ...floor, rooms: [...floor.rooms, newRoom] };
            }
            return floor;
          })
        };
      }
      return building;
    }));
  };

  const removeBuilding = (buildingId: string) => {
    if (buildings.length > 1) {
      setBuildings(buildings.filter(building => building.id !== buildingId));
    }
  };

  const removeFloor = (buildingId: string, floorId: string) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId && building.floors.length > 1) {
        return {
          ...building,
          floors: building.floors.filter(floor => floor.id !== floorId)
        };
      }
      return building;
    }));
  };

  const removeRoom = (buildingId: string, floorId: string, roomId: string) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                rooms: floor.rooms.filter(room => room.id !== roomId)
              };
            }
            return floor;
          })
        };
      }
      return building;
    }));
  };

  const updateBuilding = (buildingId: string, field: string, value: string) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        return { ...building, [field]: value };
      }
      return building;
    }));
  };

  const updateFloor = (buildingId: string, floorId: string, field: string, value: string | number) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => {
            if (floor.id === floorId) {
              return { ...floor, [field]: value };
            }
            return floor;
          })
        };
      }
      return building;
    }));
  };

  const updateRoom = (buildingId: string, floorId: string, roomId: string, field: string, value: string | number) => {
    setBuildings(buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                rooms: floor.rooms.map(room => {
                  if (room.id === roomId) {
                    return { ...room, [field]: value };
                  }
                  return room;
                })
              };
            }
            return floor;
          })
        };
      }
      return building;
    }));
  };

  const getTotalRooms = () => {
    return buildings.reduce((total, building) => 
      total + building.floors.reduce((floorTotal, floor) => floorTotal + floor.rooms.length, 0), 0
    );
  };

  const getTotalBeds = () => {
    return buildings.reduce((total, building) => 
      total + building.floors.reduce((floorTotal, floor) => 
        floorTotal + floor.rooms.reduce((roomTotal, room) => roomTotal + room.bedCount, 0), 0
      ), 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Structure</h3>
          <p className="text-sm text-gray-600">
            Define the buildings, floors, and rooms for your {propertyCategory.toLowerCase()}
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building className="w-3 h-3" />
            {buildings.length} Building{buildings.length !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {getTotalRooms()} Room{getTotalRooms() !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {getTotalBeds()} Bed{getTotalBeds() !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {buildings.map((building, buildingIndex) => (
        <Card key={building.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Building {buildingIndex + 1}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFloor(building.id)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Floor
                </Button>
                {buildings.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBuilding(building.id)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Building Name</label>
                <Input
                  value={building.name}
                  onChange={(e) => updateBuilding(building.id, 'name', e.target.value)}
                  placeholder="e.g., Main Building, Block A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={building.description}
                  onChange={(e) => updateBuilding(building.id, 'description', e.target.value)}
                  placeholder="Building description"
                  className="h-10"
                />
              </div>
            </div>

            {building.floors.map((floor, floorIndex) => (
              <Card key={floor.id} className="border-l-4 border-l-green-500 ml-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Floor {floor.floorNumber}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addRoom(building.id, floor.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Room
                      </Button>
                      {building.floors.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFloor(building.id, floor.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Floor Name</label>
                      <Input
                        value={floor.name}
                        onChange={(e) => updateFloor(building.id, floor.id, 'name', e.target.value)}
                        placeholder="e.g., Ground Floor, First Floor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={floor.description}
                        onChange={(e) => updateFloor(building.id, floor.id, 'description', e.target.value)}
                        placeholder="Floor description"
                        className="h-10"
                      />
                    </div>
                  </div>

                  {floor.rooms.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Rooms</h4>
                      <div className="grid gap-3">
                        {floor.rooms.map((room) => (
                          <Card key={room.id} className="border-l-4 border-l-yellow-500 ml-4">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium">{room.roomNumber}</h5>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeRoom(building.id, floor.id, room.id)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs font-medium mb-1">Room Number</label>
                                  <Input
                                    value={room.roomNumber}
                                    onChange={(e) => updateRoom(building.id, floor.id, room.id, 'roomNumber', e.target.value)}
                                    placeholder="Room 101"
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Room Type</label>
                                  <Select
                                    value={room.roomType}
                                    onValueChange={(value) => updateRoom(building.id, floor.id, room.id, 'roomType', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="single">Single</SelectItem>
                                      <SelectItem value="double">Double</SelectItem>
                                      <SelectItem value="shared">Shared</SelectItem>
                                      <SelectItem value="apartment">Apartment</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Bed Count</label>
                                  <Input
                                    type="number"
                                    value={room.bedCount}
                                    onChange={(e) => updateRoom(building.id, floor.id, room.id, 'bedCount', parseInt(e.target.value) || 0)}
                                    min="1"
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Rent (₵)</label>
                                  <Input
                                    type="number"
                                    value={room.rentAmount}
                                    onChange={(e) => updateRoom(building.id, floor.id, room.id, 'rentAmount', parseInt(e.target.value) || 0)}
                                    min="0"
                                    className="h-8"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addBuilding}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Building
      </Button>
    </div>
  );
};

export default BuildingStructureFields;

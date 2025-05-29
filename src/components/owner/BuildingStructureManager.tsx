import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Trash2, Edit3, Users, Bed, Pencil } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import IntelligentBuildingCreator from './IntelligentBuildingCreator';

interface BuildingStructureManagerProps {
  form: UseFormReturn<PropertyFormValues>;
}

const roomSchema = z.object({
  id: z.string(),
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.string().min(1, 'Room type is required'),
  bedCount: z.number().min(1, 'Must have at least 1 bed'),
  bedsAvailable: z.number().min(0),
  maxOccupants: z.number().min(1),
  rentAmount: z.number().min(0),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const floorSchema = z.object({
  id: z.string(),
  floorNumber: z.number(),
  name: z.string().min(1, 'Floor name is required'),
  description: z.string().optional(),
  rooms: z.array(roomSchema),
});

const buildingSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Building name is required'),
  description: z.string().optional(),
  floors: z.array(floorSchema),
});

type Room = z.infer<typeof roomSchema>;
type Floor = z.infer<typeof floorSchema>;
type Building = z.infer<typeof buildingSchema>;

const BuildingStructureManager: React.FC<BuildingStructureManagerProps> = ({ form }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<string | null>(null);
  const [editingFloor, setEditingFloor] = useState<string | null>(null);
  const [editingBuildingName, setEditingBuildingName] = useState<string>('');
  const [editingFloorName, setEditingFloorName] = useState<string>('');
  const [editingRoomNumbers, setEditingRoomNumbers] = useState<{[key: string]: string}>({});

  const buildings = form.watch('buildings') || [];

  const roomForm = useForm<Room>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      id: '',
      roomNumber: '',
      roomType: 'standard',
      bedCount: 1,
      bedsAvailable: 1,
      maxOccupants: 1,
      rentAmount: 0,
      amenities: [],
      description: '',
    },
  });

  const addIntelligentBuilding = (buildingData: Building) => {
    form.setValue('buildings', [...buildings, buildingData]);
  };

  const handleBuildingNameEdit = (buildingId: string, newName: string) => {
    const updatedBuildings = buildings.map(building => 
      building.id === buildingId ? { ...building, name: newName } : building
    );
    form.setValue('buildings', updatedBuildings);
  };

  const handleFloorNameEdit = (buildingId: string, floorId: string, newName: string) => {
    const updatedBuildings = buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => 
            floor.id === floorId ? { ...floor, name: newName } : floor
          )
        };
      }
      return building;
    });
    form.setValue('buildings', updatedBuildings);
  };

  const handleRoomNumberEdit = (buildingId: string, floorId: string, roomId: string, newNumber: string) => {
    const updatedBuildings = buildings.map(building => {
      if (building.id === buildingId) {
        return {
          ...building,
          floors: building.floors.map(floor => {
            if (floor.id === floorId) {
              return {
                ...floor,
                rooms: floor.rooms.map(room => 
                  room.id === roomId ? { ...room, roomNumber: newNumber } : room
                )
              };
            }
            return floor;
          })
        };
      }
      return building;
    });
    form.setValue('buildings', updatedBuildings);
  };

  const startEditingBuilding = (buildingId: string, currentName: string) => {
    setEditingBuilding(buildingId);
    setEditingBuildingName(currentName);
  };

  const finishEditingBuilding = (buildingId: string) => {
    if (editingBuildingName.trim()) {
      handleBuildingNameEdit(buildingId, editingBuildingName.trim());
    }
    setEditingBuilding(null);
    setEditingBuildingName('');
  };

  const startEditingFloor = (floorId: string, currentName: string) => {
    setEditingFloor(floorId);
    setEditingFloorName(currentName);
  };

  const finishEditingFloor = (buildingId: string, floorId: string) => {
    if (editingFloorName.trim()) {
      handleFloorNameEdit(buildingId, floorId, editingFloorName.trim());
    }
    setEditingFloor(null);
    setEditingFloorName('');
  };

  const startEditingRoom = (roomId: string, currentNumber: string) => {
    setEditingRoomNumbers(prev => ({ ...prev, [roomId]: currentNumber }));
  };

  const finishEditingRoom = (buildingId: string, floorId: string, roomId: string) => {
    const newNumber = editingRoomNumbers[roomId];
    if (newNumber && newNumber.trim()) {
      handleRoomNumberEdit(buildingId, floorId, roomId, newNumber.trim());
    }
    setEditingRoomNumbers(prev => {
      const { [roomId]: _, ...rest } = prev;
      return rest;
    });
  };

  const addBuilding = () => {
    const newBuilding: Building = {
      id: `building-${Date.now()}`,
      name: `Building ${buildings.length + 1}`,
      description: '',
      floors: [],
    };
    
    form.setValue('buildings', [...buildings, newBuilding]);
    setSelectedBuilding(newBuilding.id);
  };

  const addFloor = (buildingId: string) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    if (buildingIndex === -1) return;

    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      floorNumber: buildings[buildingIndex].floors.length + 1,
      name: `Floor ${buildings[buildingIndex].floors.length + 1}`,
      description: '',
      rooms: [],
    };

    const updatedBuildings = [...buildings];
    updatedBuildings[buildingIndex].floors.push(newFloor);
    form.setValue('buildings', updatedBuildings);
    setSelectedFloor(newFloor.id);
  };

  const addRoom = (buildingId: string, floorId: string, roomData: Room) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    const floorIndex = buildings[buildingIndex].floors.findIndex(f => f.id === floorId);
    
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };

    const updatedBuildings = [...buildings];
    updatedBuildings[buildingIndex].floors[floorIndex].rooms.push(newRoom);
    form.setValue('buildings', updatedBuildings);
    roomForm.reset();
    setEditingRoom(null);
  };

  const removeBuilding = (buildingId: string) => {
    const updatedBuildings = buildings.filter(b => b.id !== buildingId);
    form.setValue('buildings', updatedBuildings);
    if (selectedBuilding === buildingId) {
      setSelectedBuilding(null);
    }
  };

  const removeFloor = (buildingId: string, floorId: string) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    const updatedBuildings = [...buildings];
    updatedBuildings[buildingIndex].floors = updatedBuildings[buildingIndex].floors.filter(f => f.id !== floorId);
    form.setValue('buildings', updatedBuildings);
    if (selectedFloor === floorId) {
      setSelectedFloor(null);
    }
  };

  const removeRoom = (buildingId: string, floorId: string, roomId: string) => {
    const buildingIndex = buildings.findIndex(b => b.id === buildingId);
    const floorIndex = buildings[buildingIndex].floors.findIndex(f => f.id === floorId);
    const updatedBuildings = [...buildings];
    updatedBuildings[buildingIndex].floors[floorIndex].rooms = 
      updatedBuildings[buildingIndex].floors[floorIndex].rooms.filter(r => r.id !== roomId);
    form.setValue('buildings', updatedBuildings);
  };

  const getTotalStats = () => {
    let totalRooms = 0;
    let totalBeds = 0;
    let availableBeds = 0;

    buildings.forEach(building => {
      building.floors.forEach(floor => {
        totalRooms += floor.rooms.length;
        floor.rooms.forEach(room => {
          totalBeds += room.bedCount;
          availableBeds += room.bedsAvailable;
        });
      });
    });

    return { totalRooms, totalBeds, availableBeds };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Building Structure</span>
            </span>
            <div className="flex space-x-2">
              <IntelligentBuildingCreator onCreateBuilding={addIntelligentBuilding} />
              <Button onClick={addBuilding} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Manual Building
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalRooms > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalRooms}</p>
                <p className="text-sm text-blue-800">Total Rooms</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.totalBeds}</p>
                <p className="text-sm text-green-800">Total Beds</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.availableBeds}</p>
                <p className="text-sm text-orange-800">Available Beds</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {buildings.map((building) => (
              <Card key={building.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {editingBuilding === building.id ? (
                        <Input
                          value={editingBuildingName}
                          onChange={(e) => setEditingBuildingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              finishEditingBuilding(building.id);
                            }
                          }}
                          onBlur={() => finishEditingBuilding(building.id)}
                          className="font-semibold"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <h3 
                            className="font-semibold cursor-pointer hover:text-blue-600"
                            onClick={() => startEditingBuilding(building.id, building.name)}
                          >
                            {building.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingBuilding(building.id, building.name)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-gray-600">{building.floors.length} floors</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => addFloor(building.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Floor
                      </Button>
                      <Button
                        onClick={() => removeBuilding(building.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {building.floors.map((floor) => (
                      <div key={floor.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {editingFloor === floor.id ? (
                              <Input
                                value={editingFloorName}
                                onChange={(e) => setEditingFloorName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    finishEditingFloor(building.id, floor.id);
                                  }
                                }}
                                onBlur={() => finishEditingFloor(building.id, floor.id)}
                                className="font-medium"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <h4 
                                  className="font-medium cursor-pointer hover:text-blue-600"
                                  onClick={() => startEditingFloor(floor.id, floor.name)}
                                >
                                  {floor.name}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingFloor(floor.id, floor.name)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <p className="text-sm text-gray-600">{floor.rooms.length} rooms</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => {
                                setSelectedBuilding(building.id);
                                setSelectedFloor(floor.id);
                                setEditingRoom({
                                  id: '',
                                  roomNumber: '',
                                  roomType: 'standard',
                                  bedCount: 1,
                                  bedsAvailable: 1,
                                  maxOccupants: 1,
                                  rentAmount: 0,
                                  amenities: [],
                                  description: '',
                                });
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Room
                            </Button>
                            <Button
                              onClick={() => removeFloor(building.id, floor.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {floor.rooms.map((room) => (
                            <div key={room.id} className="border rounded p-3 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                {editingRoomNumbers[room.id] !== undefined ? (
                                  <Input
                                    value={editingRoomNumbers[room.id]}
                                    onChange={(e) => setEditingRoomNumbers(prev => ({
                                      ...prev,
                                      [room.id]: e.target.value
                                    }))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        finishEditingRoom(building.id, floor.id, room.id);
                                      }
                                    }}
                                    onBlur={() => finishEditingRoom(building.id, floor.id, room.id)}
                                    className="font-medium text-sm h-8"
                                    autoFocus
                                  />
                                ) : (
                                  <span 
                                    className="font-medium text-sm cursor-pointer hover:text-blue-600"
                                    onClick={() => startEditingRoom(room.id, room.roomNumber)}
                                  >
                                    {room.roomNumber}
                                  </span>
                                )}
                                <Button
                                  onClick={() => removeRoom(building.id, floor.id, room.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center space-x-1">
                                  <Bed className="h-3 w-3" />
                                  <span>{room.bedsAvailable}/{room.bedCount} beds available</span>
                                </p>
                                <p className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>Max {room.maxOccupants} occupants</span>
                                </p>
                                <p className="font-medium">₵{room.rentAmount}/semester</p>
                                <Badge variant="outline" className="text-xs">
                                  {room.roomType}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingRoom && selectedBuilding && selectedFloor && (
            <Card className="mt-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle>Add New Room</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...roomForm}>
                  <form onSubmit={roomForm.handleSubmit((data) => addRoom(selectedBuilding, selectedFloor, data))} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={roomForm.control}
                        name="roomNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Number</FormLabel>
                            <FormControl>
                              <Input placeholder="101, A1, FK101, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="roomType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="deluxe">Deluxe</SelectItem>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="double">Double</SelectItem>
                                <SelectItem value="suite">Suite</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="bedCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Beds</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="bedsAvailable"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Beds</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="maxOccupants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Occupants</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="rentAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rent Amount (₵)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={roomForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Room features, special notes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-3">
                      <Button type="button" variant="outline" onClick={() => setEditingRoom(null)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Room</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingStructureManager;

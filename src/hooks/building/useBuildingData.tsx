
import { useState, useEffect } from 'react';
import { Building } from '@/types/common';
import { Property, Amenity } from '@/types/property';

interface Floor {
  id: string;
  floorNumber: number;
  name: string;
  description?: string;
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
  amenities?: string[];
  description?: string;
}

export const useBuildingData = (properties: Property[]) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateBuildingData = () => {
      const mockBuilding: Building = {
        id: '1',
        property_id: '1',
        name: 'Main Building',
        description: 'Primary accommodation building',
        floors_count: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setBuildings([mockBuilding]);
      setLoading(false);
    };

    generateBuildingData();
  }, [properties]);

  const generateFloorsAndRooms = (property: Property): Floor[] => {
    const floors: Floor[] = [];
    const floorsCount = 3; // Default floors
    
    for (let floorNum = 1; floorNum <= floorsCount; floorNum++) {
      const rooms: Room[] = [];
      const roomsPerFloor = 8;
      
      for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
        const roomNumber = `${floorNum}${roomNum.toString().padStart(2, '0')}`;
        
        const room: Room = {
          id: `${property.id}_${floorNum}_${roomNum}`,
          roomNumber,
          roomType: property.type || 'Standard',
          bedCount: property.beds_per_room || 2,
          bedsAvailable: Math.floor(Math.random() * (property.beds_per_room || 2)) + 1,
          maxOccupants: property.max_occupants || 2,
          rentAmount: property.price || property.rent || 500,
          amenities: property.amenities?.map(amenity => 
            typeof amenity === 'string' ? amenity : amenity.name
          ) || [],
          description: `${property.type} room with ${property.beds_per_room || 2} beds`
        };
        
        rooms.push(room);
      }
      
      floors.push({
        id: `${property.id}_floor_${floorNum}`,
        floorNumber: floorNum,
        name: `Floor ${floorNum}`,
        description: `${floorNum === 1 ? 'Ground' : floorNum === 2 ? 'First' : 'Second'} floor accommodations`,
        rooms
      });
    }
    
    return floors;
  };

  const getBuildingsByProperty = (propertyId: string) => {
    return buildings.filter(building => building.property_id === propertyId);
  };

  const getPropertyBuildings = (property: Property) => {
    const propertyBuildings = getBuildingsByProperty(property.id);
    
    if (propertyBuildings.length === 0) {
      // Generate mock building data
      const mockBuilding: Building = {
        id: `${property.id}_building_1`,
        property_id: property.id,
        name: `${property.title} - Main Building`,
        description: property.description,
        floors_count: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return [mockBuilding];
    }
    
    return propertyBuildings;
  };

  const getAvailableBedsCount = (property: Property): number => {
    return property.beds_available || 0;
  };

  const getTotalBedsCount = (property: Property): number => {
    const totalRooms = property.total_rooms || 1;
    const bedsPerRoom = property.beds_per_room || 1;
    return totalRooms * bedsPerRoom;
  };

  const getOccupancyRate = (property: Property): number => {
    const totalBeds = getTotalBedsCount(property);
    const availableBeds = getAvailableBedsCount(property);
    const occupiedBeds = totalBeds - availableBeds;
    return totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
  };

  return {
    buildings,
    loading,
    generateFloorsAndRooms,
    getBuildingsByProperty,
    getPropertyBuildings,
    getAvailableBedsCount,
    getTotalBedsCount,
    getOccupancyRate
  };
};

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Building, Floor, Room, OccupancyTracking } from '@/types/building';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { ErrorHandler } from '@/utils/ErrorHandler';

export const useBuildingData = (buildingId?: string) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyTracking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert properties to buildings format for now (using existing properties table)
  const transformPropertyToBuilding = (property: Property): Building => {
    return {
      property_id: property.id,
      name: property.name || property.title || 'Unnamed Building',
      total_floors: 1,
      total_rooms: property.bedrooms || 1,
      floors: [],
      rooms: [],
    };
  };

  // Create mock floor and room data from property
  const createMockFloorsAndRooms = (property: Property): { floors: Floor[], rooms: Room[] } => {
    const floor: Floor = {
      id: `${property.id}-floor-1`,
      building_id: property.id,
      number: 1,
      name: 'Ground Floor',
      created_at: property.created_at,
      updated_at: property.updated_at,
    };

    const rooms: Room[] = [];
    for (let i = 1; i <= (property.bedrooms ?? 1); i++) {
      rooms.push({
        id: `${property.id}-room-${i}`,
        floor_id: floor.id,
        number: `Room ${i}`,
        type: 'standard',
        capacity: property.beds_per_room || 2,
        price: property.rent || property.price || 0,
        status: property.status,
        amenities: property.amenities || [],
        images: property.images || [],
        created_at: property.created_at,
        updated_at: property.updated_at,
      });
    }

    return { floors: [floor], rooms };
  };

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedBuildings = (data || []).map(transformPropertyToBuilding);
      setBuildings(transformedBuildings);
    } catch (err) {
      setError('Failed to fetch buildings');
      toast({
        title: "Error",
        description: "Failed to load buildings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildingDetails = async (id: string) => {
    setLoading(true);
    try {
      // Fetch property as building
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      
      const building = transformPropertyToBuilding(property);
      const { floors: mockFloors, rooms: mockRooms } = createMockFloorsAndRooms(property);
      const buildingWithDetails = { ...building, floors: mockFloors, rooms: mockRooms };
      setSelectedBuilding(buildingWithDetails);

      // Create mock occupancy data
      const mockOccupancy: OccupancyTracking[] = mockRooms.map(room => ({
        id: `${room.id}-occupancy`,
        room_id: room.id,
        building_id: building.id,
        floor_id: room.floor_id,
        current_occupancy: 0,
        available_spots: room.capacity,
        last_updated: new Date().toISOString(),
        updated_by: undefined
      }));
      
      setOccupancy(mockOccupancy);

    } catch (err) {
      setError('Failed to fetch building details');
      toast({
        title: "Error",
        description: "Failed to load building details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOccupancyData = async (id: string) => {
    try {
      // For now, return mock data since occupancy_tracking table doesn't exist yet
      const mockOccupancy: OccupancyTracking[] = rooms.map(room => ({
        id: `${room.id}-occupancy`,
        room_id: room.id,
        building_id: id,
        floor_id: room.floor_id,
        current_occupancy: Math.floor(Math.random() * room.capacity),
        available_spots: room.capacity - Math.floor(Math.random() * room.capacity),
        last_updated: new Date().toISOString(),
        updated_by: undefined
      }));
      
      setOccupancy(mockOccupancy);
    } catch (err) {
      ErrorHandler.handle(err, 'useBuildingData error fetching occupancy data');
    }
  };

  const getRoomOccupancy = (roomId: string) => {
    const roomOccupancy = occupancy.find(o => o.room_id === roomId);
    return roomOccupancy || {
      current_occupancy: 0,
      available_spots: 2,
      last_updated: new Date().toISOString()
    };
  };

  const getFloorOccupancy = (floorId: string) => {
    const floorRooms = rooms.filter(room => room.floor_id === floorId);
    const totalOccupancy = floorRooms.reduce((sum, room) => {
      const roomOcc = getRoomOccupancy(room.id);
      return sum + roomOcc.current_occupancy;
    }, 0);
    
    const totalCapacity = floorRooms.reduce((sum, room) => sum + room.capacity, 0);
    const availableSpots = totalCapacity - totalOccupancy;

    return {
      current_occupancy: totalOccupancy,
      total_capacity: totalCapacity,
      available_spots: availableSpots,
      occupancy_percentage: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0
    };
  };

  const getBuildingOccupancy = (buildingId: string) => {
    const buildingRooms = rooms.filter(room => 
      floors.find(floor => floor.id === room.floor_id && floor.building_id === buildingId)
    );
    
    const totalOccupancy = buildingRooms.reduce((sum, room) => {
      const roomOcc = getRoomOccupancy(room.id);
      return sum + roomOcc.current_occupancy;
    }, 0);
    
    const totalCapacity = buildingRooms.reduce((sum, room) => sum + room.capacity, 0);
    const availableSpots = totalCapacity - totalOccupancy;

    return {
      current_occupancy: totalOccupancy,
      total_capacity: totalCapacity,
      available_spots: availableSpots,
      occupancy_percentage: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0
    };
  };

  // Polling for real-time occupancy updates (every 30 seconds)
  useEffect(() => {
    if (buildingId) {
      const interval = setInterval(() => {
        fetchOccupancyData(buildingId);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [buildingId, rooms]);

  return {
    buildings,
    selectedBuilding,
    floors,
    rooms,
    occupancy,
    loading,
    error,
    fetchBuildings,
    fetchBuildingDetails,
    getRoomOccupancy,
    getFloorOccupancy,
    getBuildingOccupancy,
    refreshOccupancy: () => buildingId && fetchOccupancyData(buildingId)
  };
};

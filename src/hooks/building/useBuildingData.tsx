
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Building, Floor, Room, OccupancyTracking } from '@/types/building';
import { useToast } from '@/hooks/use-toast';

export const useBuildingData = (buildingId?: string) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyTracking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Polling for real-time occupancy updates (every 30 seconds)
  useEffect(() => {
    if (buildingId) {
      const interval = setInterval(() => {
        fetchOccupancyData(buildingId);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [buildingId]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
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
      // Fetch building
      const { data: building, error: buildingError } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', id)
        .single();

      if (buildingError) throw buildingError;
      setSelectedBuilding(building);

      // Fetch floors
      const { data: floorsData, error: floorsError } = await supabase
        .from('floors')
        .select('*')
        .eq('building_id', id)
        .order('floor_number');

      if (floorsError) throw floorsError;
      setFloors(floorsData || []);

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          *,
          floor:floors(*)
        `)
        .in('floor_id', (floorsData || []).map(f => f.id))
        .order('room_number');

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch occupancy data
      await fetchOccupancyData(id);

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
      const { data, error } = await supabase
        .from('occupancy_tracking')
        .select('*')
        .eq('building_id', id);

      if (error) throw error;
      setOccupancy(data || []);
    } catch (err) {
      console.error('Failed to fetch occupancy data:', err);
    }
  };

  const getRoomOccupancy = (roomId: string) => {
    const roomOccupancy = occupancy.find(o => o.room_id === roomId);
    return roomOccupancy || {
      current_occupancy: 0,
      available_spots: 0,
      last_updated: new Date().toISOString()
    };
  };

  const getFloorOccupancy = (floorId: string) => {
    const floorRooms = rooms.filter(room => room.floor_id === floorId);
    const totalOccupancy = floorRooms.reduce((sum, room) => {
      const roomOcc = getRoomOccupancy(room.id);
      return sum + roomOcc.current_occupancy;
    }, 0);
    
    const totalCapacity = floorRooms.reduce((sum, room) => sum + room.occupancy_limit, 0);
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
    
    const totalCapacity = buildingRooms.reduce((sum, room) => sum + room.occupancy_limit, 0);
    const availableSpots = totalCapacity - totalOccupancy;

    return {
      current_occupancy: totalOccupancy,
      total_capacity: totalCapacity,
      available_spots: availableSpots,
      occupancy_percentage: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0
    };
  };

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

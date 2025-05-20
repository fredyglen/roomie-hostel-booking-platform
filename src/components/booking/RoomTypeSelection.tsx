
import React from 'react';

interface RoomType {
  name: string;
  price: number;
  unit: string;
}

interface RoomTypeSelectionProps {
  roomTypes: RoomType[];
  selectedRoomType: string;
  onSelectRoomType: (name: string, value: string) => void;
}

const RoomTypeSelection: React.FC<RoomTypeSelectionProps> = ({
  roomTypes,
  selectedRoomType,
  onSelectRoomType
}) => {
  return (
    <div className="space-y-4">
      {roomTypes.map((roomType, index) => (
        <div 
          key={index}
          className={`border p-4 rounded-lg cursor-pointer transition-all ${
            selectedRoomType === roomType.name ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
          }`}
          onClick={() => onSelectRoomType('roomType', roomType.name)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{roomType.name}</h3>
              <p className="text-sm text-gray-600">Choose this option for {roomType.name.toLowerCase()} living arrangement</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">₵{roomType.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">per {roomType.unit}</p>
            </div>
          </div>
        </div>
      ))}
      
      {roomTypes.length === 0 && (
        <p className="text-gray-500 italic">No room types available for this property.</p>
      )}
    </div>
  );
};

export default RoomTypeSelection;

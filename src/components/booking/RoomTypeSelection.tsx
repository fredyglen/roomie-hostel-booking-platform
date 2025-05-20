
import React from 'react';

interface RoomType {
  name: string;
  price: number;
  unit: string;
}

interface RoomTypeSelectionProps {
  roomTypes: RoomType[];
  selectedRoomType: string;
  onSelectRoomType: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomTypeSelection: React.FC<RoomTypeSelectionProps> = ({ 
  roomTypes,
  selectedRoomType,
  onSelectRoomType
}) => {
  return (
    <div className="space-y-4">
      {roomTypes.map((room, index) => (
        <div 
          key={index} 
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedRoomType === room.name ? 'border-roomi-blue bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            const syntheticEvent = {
              target: { name: 'roomType', value: room.name }
            } as React.ChangeEvent<HTMLInputElement>;
            onSelectRoomType(syntheticEvent);
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-roomi-blue"
                checked={selectedRoomType === room.name}
                onChange={() => {
                  const syntheticEvent = {
                    target: { name: 'roomType', value: room.name }
                  } as React.ChangeEvent<HTMLInputElement>;
                  onSelectRoomType(syntheticEvent);
                }}
              />
              <div className="ml-3">
                <h3 className="font-semibold">{room.name}</h3>
                <p className="text-sm text-gray-500">Suitable for 1-2 persons</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-roomi-blue">${room.price}</span>
              <span className="text-gray-600">/{room.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomTypeSelection;

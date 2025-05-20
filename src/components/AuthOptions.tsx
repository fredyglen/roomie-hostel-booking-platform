
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

interface RoleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    description: 'Looking for accommodation near campus',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
      </svg>
    )
  },
  {
    id: 'owner',
    title: 'Property Owner',
    description: 'List and manage your properties',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'agent',
    title: 'Property Agent',
    description: 'Manage multiple properties for clients',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const AuthOptions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleContinue = () => {
    if (selectedRole) {
      // In a real app, we would store this selection
      console.log(`Selected role: ${selectedRole}`);
      // Redirect to the appropriate dashboard or onboarding
      navigate(`/onboarding/${selectedRole}`);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose your role</h2>
      
      <div className="space-y-4">
        {roleOptions.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === option.id 
                ? 'border-roomi-blue bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole(option.id)}
          >
            <div className="flex items-center">
              <div className={`mr-4 text-${selectedRole === option.id ? 'roomi-blue' : 'gray-500'}`}>
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Button 
          variant="primary" 
          fullWidth
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AuthOptions;


import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OwnerSettingsLink: React.FC = () => {
  return (
    <Link to="/owner/settings">
      <Button variant="outline" size="sm" className="flex items-center space-x-2">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Button>
    </Link>
  );
};

export default OwnerSettingsLink;

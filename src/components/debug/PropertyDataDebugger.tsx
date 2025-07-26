import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropertyDataDebugger: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_available', true)
          .eq('verification_status', 'verified')
          .limit(5);

        if (error) {
          console.error('Error fetching properties:', error);
        } else {
          console.log('🔍 RAW PROPERTY DATA:', data);
          setProperties(data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="p-4">Loading debug data...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">🔍 Property Data Debugger</h2>
      
      {properties.map((property) => (
        <Card key={property.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">{property.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {property.id}</div>
              <div><strong>Title:</strong> {property.title}</div>
              <div><strong>Address:</strong> {property.address}</div>
              <div><strong>Price:</strong> {property.rent || property.base_price_per_semester}</div>
              <div><strong>Property Type:</strong> {property.property_type}</div>
              <div><strong>Property Category:</strong> {property.property_category}</div>
              
              <div className="mt-4">
                <strong>Images Data:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(property.images, null, 2)}
                </pre>
                <div className="mt-2">
                  <strong>Images Type:</strong> {typeof property.images}
                </div>
                <div>
                  <strong>Images Length:</strong> {Array.isArray(property.images) ? property.images.length : 'Not an array'}
                </div>
              </div>

              <div className="mt-4">
                <strong>Image URL (single):</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  {property.image_url || 'null'}
                </pre>
              </div>

              <div className="mt-4">
                <strong>Cover Image URL:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  {property.cover_image_url || 'null'}
                </pre>
              </div>

              <div className="mt-4">
                <strong>Amenities:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(property.amenities, null, 2)}
                </pre>
              </div>

              <div className="mt-4">
                <strong>Full Property Object:</strong>
                <details>
                  <summary className="cursor-pointer text-blue-600">Click to expand</summary>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-64">
                    {JSON.stringify(property, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyDataDebugger;

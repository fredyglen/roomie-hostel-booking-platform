
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PropertyCard from '@/components/properties/PropertyCard';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';
import { FavoritesQueries, type Favorite } from '@/services/database/favoritesQueries';
import { useAuth } from '@/context/EnhancedAuthContext';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';

// Real favorites data from database

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userFavorites = await FavoritesQueries.getUserFavorites(user.id);
        setFavorites(userFavorites);

        logger.info('Favorites loaded successfully', {
          userId: user.id,
          favoritesCount: userFavorites.length
        });
      } catch (err) {
        const errorMessage = 'Failed to load favorites';
        setError(errorMessage);
        ErrorHandler.handle(err, errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!user?.id) return;

    try {
      await FavoritesQueries.removeFavorite(user.id, propertyId);
      setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
      logger.info('Favorite removed successfully', { userId: user.id, propertyId });
    } catch (err) {
      ErrorHandler.handle(err, 'Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
        <Header />
        <main className="flex-grow py-6 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>
            <div className="flex justify-center items-center py-12">
              <Icon icon="solar:loading-linear" className="animate-spin text-blue-500" width={32} height={32} />
              <span className="ml-2 text-gray-600">Loading your favorites...</span>
            </div>
          </div>
        </main>
        <StudentNavBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
        <Header />
        <main className="flex-grow py-6 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>
            <div className="text-center py-12">
              <Icon icon="solar:danger-circle-linear" className="mx-auto text-red-500" width={64} height={64} />
              <h2 className="text-xl font-semibold mt-4 mb-2">Error Loading Favorites</h2>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-500 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <StudentNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>
          
          {favorites.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">{favorites.length} saved properties</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map(favorite => {
                  const property = favorite.property;
                  if (!property) return null;

                  return (
                    <PropertyCard
                      key={favorite.id}
                      id={property.id}
                      title={property.title}
                      rent={property.base_price_per_semester}
                      location={property.address}
                      bedrooms={2} // TODO: Get from property data
                      bathrooms={1} // TODO: Get from property data
                      maxOccupants={property.max_occupancy}
                      images={property.images || []}
                      amenities={property.amenities || []}
                      propertyType={property.property_type}
                      genderRestriction={property.gender_type}
                      isAvailable={property.is_available}
                      distanceToCampus="N/A" // TODO: Calculate distance
                      totalBedsAvailable={property.max_occupancy - property.current_occupancy}
                      totalBeds={property.max_occupancy}
                      priceUnit="semester"
                      onViewDetails={() => navigate(`/student/property/${property.id}`)}
                      onViewStory={() => navigate(`/student/property/${property.id}/story`)}
                      onFavoriteToggle={() => handleRemoveFavorite(property.id)}
                      isFavorite={true}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Icon icon="solar:heart-broken-linear" className="mx-auto text-gray-400" width={64} height={64} />
              <h2 className="text-xl font-semibold mt-4 mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                Save properties you like by tapping the heart icon on a property card
              </p>
              <button 
                onClick={() => navigate('/student/properties')}
                className="text-blue-500 font-medium flex items-center gap-1 mx-auto"
              >
                <Icon icon="solar:home-2-linear" width={16} height={16} />
                Browse properties
              </button>
            </div>
          )}
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Favorites;

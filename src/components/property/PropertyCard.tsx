import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  isFavorite = false,
  className,
}) => {
  const {
    id,
    name,
    price,
    currency = 'GHS',
    location,
    images,
    propertyType,
    bedrooms,
    bathrooms,
    isAvailable,
  } = property;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
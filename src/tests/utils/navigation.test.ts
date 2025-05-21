
import { describe, it, expect, vi } from 'vitest';
import { 
  navigateToProperty, 
  navigateToBooking, 
  navigateToProperties 
} from '@/utils/navigation';

describe('Navigation Utilities', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('navigateToProperty', () => {
    it('should navigate to the property details page when given a valid ID', () => {
      navigateToProperty(mockNavigate, '123');
      expect(mockNavigate).toHaveBeenCalledWith('/student/property/123');
    });
    
    it('should not navigate when given an empty ID', () => {
      // Mock console.error to prevent it from showing in test output
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      navigateToProperty(mockNavigate, '');
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('Invalid ID'));
      
      consoleErrorMock.mockRestore();
    });
  });
  
  describe('navigateToBooking', () => {
    it('should navigate to the booking page when given a valid property ID', () => {
      navigateToBooking(mockNavigate, '123');
      expect(mockNavigate).toHaveBeenCalledWith('/student/book/123');
    });
    
    it('should not navigate when given an empty property ID', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      navigateToBooking(mockNavigate, '');
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('Invalid property ID'));
      
      consoleErrorMock.mockRestore();
    });
  });
  
  describe('navigateToProperties', () => {
    it('should navigate to the properties page with no filters', () => {
      navigateToProperties(mockNavigate);
      expect(mockNavigate).toHaveBeenCalledWith('/student/properties');
    });
    
    it('should navigate to the properties page with query parameters when filters are provided', () => {
      navigateToProperties(mockNavigate, { type: 'Hostel', location: 'Campus' });
      expect(mockNavigate).toHaveBeenCalledWith('/student/properties?type=Hostel&location=Campus');
    });
    
    it('should skip empty filter values when constructing the URL', () => {
      navigateToProperties(mockNavigate, { type: 'Hostel', price: '', location: 'Campus' });
      expect(mockNavigate).toHaveBeenCalledWith('/student/properties?type=Hostel&location=Campus');
    });
  });
});

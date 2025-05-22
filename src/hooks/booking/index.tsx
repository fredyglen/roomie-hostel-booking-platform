
import { useBookingForm } from './useBookingForm';
import { useBookingViewModel } from './useBookingViewModel';
import { usePersonalInfoForm } from './usePersonalInfoForm';
import { useDatesForm } from './useDatesForm';
import { useRoomOptionsForm } from './useRoomOptionsForm';
import { useRoommatesForm } from './useRoommatesForm';
import { useEmergencyContactForm } from './useEmergencyContactForm';
import { useStudentVerificationForm } from './useStudentVerificationForm';
import { usePaymentForm } from './usePaymentForm';
import { useLocalStorage } from './useLocalStorage';
import { useFormValidation } from './useFormValidation';
import { useRoommatesManager } from './useRoommatesManager';
import { calculateTotalPrice } from './usePriceCalculation';
import { STEP_LABELS } from './useBookingViewModel';

export {
  // Main hooks
  useBookingForm,
  useBookingViewModel,
  STEP_LABELS,
  
  // Form hooks
  usePersonalInfoForm,
  useDatesForm,
  useRoomOptionsForm,
  useRoommatesForm,
  useEmergencyContactForm,
  useStudentVerificationForm,
  usePaymentForm,
  
  // Utility hooks
  useLocalStorage,
  useFormValidation,
  useRoommatesManager,
  calculateTotalPrice
};

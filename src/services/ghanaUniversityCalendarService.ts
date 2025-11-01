/**
 * Ghana University Calendar Service
 * 
 * Intelligent duration calculation based on Ghana university semester system.
 * Automatically calculates move-out dates based on move-in date and academic calendar.
 */

import { logger } from '@/utils/enhanced-logger';

export interface SemesterPeriod {
  readonly name: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly type: 'first_semester' | 'second_semester' | 'vacation';
}

export interface BookingDuration {
  readonly moveInDate: Date;
  readonly moveOutDate: Date;
  readonly durationInDays: number;
  readonly durationInWeeks: number;
  readonly durationInMonths: number;
  readonly semesterType: 'first_semester' | 'second_semester' | 'full_academic_year' | 'custom';
  readonly description: string;
}

/**
 * ✅ PRODUCTION-GRADE: Ghana University Academic Calendar 2024-2025
 */
const GHANA_ACADEMIC_CALENDAR_2024_2025: SemesterPeriod[] = [
  // First Semester 2024
  {
    name: 'First Semester 2024',
    startDate: new Date('2024-08-19'),
    endDate: new Date('2024-12-20'),
    type: 'first_semester'
  },
  // Vacation Period
  {
    name: 'Vacation 2024-2025',
    startDate: new Date('2024-12-21'),
    endDate: new Date('2025-01-12'),
    type: 'vacation'
  },
  // Second Semester 2025
  {
    name: 'Second Semester 2025',
    startDate: new Date('2025-01-13'),
    endDate: new Date('2025-05-30'),
    type: 'second_semester'
  },
  // First Semester 2025
  {
    name: 'First Semester 2025',
    startDate: new Date('2025-08-18'),
    endDate: new Date('2025-12-19'),
    type: 'first_semester'
  },
  // Vacation Period
  {
    name: 'Vacation 2025-2026',
    startDate: new Date('2025-12-20'),
    endDate: new Date('2026-01-11'),
    type: 'vacation'
  },
  // Second Semester 2026
  {
    name: 'Second Semester 2026',
    startDate: new Date('2026-01-12'),
    endDate: new Date('2026-05-29'),
    type: 'second_semester'
  }
];

/**
 * ✅ PRODUCTION-GRADE: Calculate intelligent booking duration
 */
export function calculateIntelligentBookingDuration(
  moveInDate: Date,
  preferredDuration?: 'one_semester' | 'full_academic_year' | 'auto'
): BookingDuration {
  try {
    logger.info('Calculating intelligent booking duration', { 
      moveInDate: moveInDate.toISOString(),
      preferredDuration 
    });

    const currentSemester = findCurrentSemester(moveInDate);
    
    if (!currentSemester) {
      // Fallback to default 4-month duration
      const moveOutDate = new Date(moveInDate);
      moveOutDate.setMonth(moveOutDate.getMonth() + 4);
      
      return createBookingDuration(
        moveInDate,
        moveOutDate,
        'custom',
        'Standard 4-month accommodation'
      );
    }

    // Determine optimal duration based on move-in date and preferences
    let moveOutDate: Date;
    let semesterType: BookingDuration['semesterType'];
    let description: string;

    if (preferredDuration === 'full_academic_year') {
      // Full academic year - find end of second semester
      const nextSecondSemester = findNextSemesterOfType(moveInDate, 'second_semester');
      if (nextSecondSemester) {
        moveOutDate = nextSecondSemester.endDate;
        semesterType = 'full_academic_year';
        description = 'Full Academic Year (Two Semesters)';
      } else {
        // Fallback to 8 months
        moveOutDate = new Date(moveInDate);
        moveOutDate.setMonth(moveOutDate.getMonth() + 8);
        semesterType = 'full_academic_year';
        description = 'Full Academic Year (8 months)';
      }
    } else if (preferredDuration === 'one_semester') {
      // Always provide approximately 4 months from move-in date
      moveOutDate = new Date(moveInDate);
      moveOutDate.setMonth(moveOutDate.getMonth() + 4);
      semesterType = currentSemester.type === 'first_semester' ? 'first_semester'
        : currentSemester.type === 'second_semester' ? 'second_semester'
        : 'custom';
      description = `One Semester (${currentSemester.name})`;
    } else {
      // Auto-detect: align with current semester end
      if (currentSemester.type === 'first_semester') {
        moveOutDate = currentSemester.endDate;
        semesterType = 'first_semester';
        description = `First Semester (${currentSemester.name})`;
      } else if (currentSemester.type === 'second_semester') {
        moveOutDate = currentSemester.endDate;
        semesterType = 'second_semester';
        description = `Second Semester (${currentSemester.name})`;
      } else {
        // During vacation - book for next semester
        const nextSemester = findNextSemester(moveInDate);
        if (nextSemester) {
          moveOutDate = nextSemester.endDate;
          semesterType = nextSemester.type;
          description = `${nextSemester.name}`;
        } else {
          // Fallback
          moveOutDate = new Date(moveInDate);
          moveOutDate.setMonth(moveOutDate.getMonth() + 4);
          semesterType = 'custom';
          description = 'Standard semester duration';
        }
      }
    }

    const result = createBookingDuration(moveInDate, moveOutDate, semesterType, description);

    logger.info('Successfully calculated booking duration', {
      moveInDate: result.moveInDate.toISOString(),
      moveOutDate: result.moveOutDate.toISOString(),
      durationInMonths: result.durationInMonths,
      semesterType: result.semesterType
    });

    return result;

  } catch (error) {
    logger.error('Error calculating booking duration', { moveInDate, error });
    
    // Fallback to 4-month duration
    const moveOutDate = new Date(moveInDate);
    moveOutDate.setMonth(moveOutDate.getMonth() + 4);
    
    return createBookingDuration(
      moveInDate,
      moveOutDate,
      'custom',
      'Standard 4-month accommodation'
    );
  }
}

/**
 * ✅ HELPER: Find current semester for a given date
 */
function findCurrentSemester(date: Date): SemesterPeriod | null {
  return GHANA_ACADEMIC_CALENDAR_2024_2025.find(semester => 
    date >= semester.startDate && date <= semester.endDate
  ) || null;
}

/**
 * ✅ HELPER: Find next semester after a given date
 */
function findNextSemester(date: Date): SemesterPeriod | null {
  return GHANA_ACADEMIC_CALENDAR_2024_2025.find(semester => 
    semester.startDate > date
  ) || null;
}

/**
 * ✅ HELPER: Find next semester of specific type
 */
function findNextSemesterOfType(
  date: Date, 
  type: 'first_semester' | 'second_semester'
): SemesterPeriod | null {
  return GHANA_ACADEMIC_CALENDAR_2024_2025.find(semester => 
    semester.startDate > date && semester.type === type
  ) || null;
}

/**
 * ✅ HELPER: Create booking duration object
 */
function createBookingDuration(
  moveInDate: Date,
  moveOutDate: Date,
  semesterType: BookingDuration['semesterType'],
  description: string
): BookingDuration {
  const durationInMs = moveOutDate.getTime() - moveInDate.getTime();
  const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
  const durationInWeeks = Math.ceil(durationInDays / 7);
  const durationInMonths = Math.ceil(durationInDays / 30);

  return {
    moveInDate,
    moveOutDate,
    durationInDays,
    durationInWeeks,
    durationInMonths,
    semesterType,
    description
  };
}

/**
 * ✅ PRODUCTION-GRADE: Get available duration options for a move-in date
 */
export function getAvailableDurationOptions(moveInDate: Date): Array<{
  value: string;
  label: string;
  duration: BookingDuration;
}> {
  const options = [];

  // Single semester option
  const singleSemester = calculateIntelligentBookingDuration(moveInDate, 'one_semester');
  options.push({
    value: 'one_semester',
    label: `One Semester (${singleSemester.durationInMonths} months)`,
    duration: singleSemester
  });

  // Full academic year option
  const fullYear = calculateIntelligentBookingDuration(moveInDate, 'full_academic_year');
  options.push({
    value: 'full_academic_year',
    label: `Full Academic Year (${fullYear.durationInMonths} months)`,
    duration: fullYear
  });

  return options;
}

/**
 * ✅ HELPER: Check if a date falls within semester period
 */
export function isWithinSemesterPeriod(date: Date): boolean {
  return GHANA_ACADEMIC_CALENDAR_2024_2025.some(semester => 
    date >= semester.startDate && date <= semester.endDate && semester.type !== 'vacation'
  );
}

/**
 * ✅ HELPER: Get semester information for a date
 */
export function getSemesterInfo(date: Date): {
  semester: SemesterPeriod | null;
  isActive: boolean;
  daysUntilStart?: number;
  daysUntilEnd?: number;
} {
  const semester = findCurrentSemester(date);
  
  if (semester) {
    const daysUntilEnd = Math.ceil((semester.endDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return {
      semester,
      isActive: semester.type !== 'vacation',
      daysUntilEnd
    };
  }

  const nextSemester = findNextSemester(date);
  if (nextSemester) {
    const daysUntilStart = Math.ceil((nextSemester.startDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return {
      semester: nextSemester,
      isActive: false,
      daysUntilStart
    };
  }

  return {
    semester: null,
    isActive: false
  };
}

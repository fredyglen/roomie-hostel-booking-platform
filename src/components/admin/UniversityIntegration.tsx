/**
 * University Integration Features Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides tools for managing university-specific requirements,
 * semester-based booking cycles, campus event coordination, and academic calendar
 * integration for Ghana's four universities (UPSA, University of Ghana, KNUST, UCC)
 * 
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction
 * validation, university APIs, and Ghana academic system requirements
 * 
 * @author <ROOMie></ROOMie> Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  School, 
  Calendar, 
  Users, 
  Building,
  BookOpen,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Bell
} from 'lucide-react';
import { 
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';

// ============================================================================
// UNIVERSITY INTEGRATION TYPES
// ============================================================================

interface UniversityInfo {
  readonly code: string;
  readonly name: string;
  readonly location: string;
  readonly establishedYear: number;
  readonly studentPopulation: number;
  readonly campuses: readonly string[];
  readonly contactEmail: string;
  readonly contactPhone: string;
  readonly website: string;
  readonly logoUrl: string;
}

interface AcademicCalendar {
  readonly id: string;
  readonly university: string;
  readonly academicYear: string;
  readonly semester: 'first' | 'second' | 'summer';
  readonly startDate: Date;
  readonly endDate: Date;
  readonly registrationStart: Date;
  readonly registrationEnd: Date;
  readonly examStart: Date;
  readonly examEnd: Date;
  readonly holidays: readonly Holiday[];
  readonly isActive: boolean;
}

interface Holiday {
  readonly name: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly type: 'national' | 'university' | 'religious';
}

interface CampusEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly university: string;
  readonly eventType: 'orientation' | 'exam' | 'graduation' | 'holiday' | 'maintenance' | 'other';
  readonly startDate: Date;
  readonly endDate: Date;
  readonly location: string;
  readonly impactOnBookings: boolean;
  readonly createdBy: string;
  readonly status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

interface SemesterBookingCycle {
  readonly id: string;
  readonly university: string;
  readonly academicYear: string;
  readonly semester: string;
  readonly bookingOpenDate: Date;
  readonly bookingCloseDate: Date;
  readonly moveInStart: Date;
  readonly moveInEnd: Date;
  readonly moveOutStart: Date;
  readonly moveOutEnd: Date;
  readonly totalBookings: number;
  readonly availableSpaces: number;
  readonly waitlistCount: number;
}

interface UniversityRequirement {
  readonly id: string;
  readonly university: string;
  readonly requirementType: 'enrollment_verification' | 'academic_standing' | 'disciplinary_record' | 'financial_clearance';
  readonly title: string;
  readonly description: string;
  readonly mandatory: boolean;
  readonly documentRequired: boolean;
  readonly validityPeriod: number; // days
  readonly lastUpdated: Date;
}

// ============================================================================
// UNIVERSITY INTEGRATION COMPONENT
// ============================================================================

/**
 * University Integration Component
 * Provides comprehensive university integration and management
 */
const UniversityIntegration: React.FC = () => {
  const { 
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const queryClient = useQueryClient();
  const [selectedUniversity, setSelectedUniversity] = useState<string>('UPSA');
  const [selectedTab, setSelectedTab] = useState('calendar');

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!hasPermission(createAdminPermission('university.integrate'))) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access university integration features.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // GHANA UNIVERSITIES DATA
  // ============================================================================

  const ghanaUniversities: UniversityInfo[] = [
    {
      code: 'UPSA',
      name: 'University of Professional Studies, Accra',
      location: 'Accra, Greater Accra Region',
      establishedYear: 1965,
      studentPopulation: 15000,
      campuses: ['Main Campus - Accra'],
      contactEmail: 'info@upsa.edu.gh',
      contactPhone: '+233302307100',
      website: 'https://upsa.edu.gh',
      logoUrl: '/logos/upsa.png'
    },
    {
      code: 'UG',
      name: 'University of Ghana',
      location: 'Legon, Greater Accra Region',
      establishedYear: 1948,
      studentPopulation: 38000,
      campuses: ['Legon Campus', 'Korle Bu Campus'],
      contactEmail: 'info@ug.edu.gh',
      contactPhone: '+233302500381',
      website: 'https://ug.edu.gh',
      logoUrl: '/logos/ug.png'
    },
    {
      code: 'KNUST',
      name: 'Kwame Nkrumah University of Science and Technology',
      location: 'Kumasi, Ashanti Region',
      establishedYear: 1952,
      studentPopulation: 60000,
      campuses: ['Main Campus - Kumasi'],
      contactEmail: 'info@knust.edu.gh',
      contactPhone: '+233322060319',
      website: 'https://knust.edu.gh',
      logoUrl: '/logos/knust.png'
    },
    {
      code: 'UCC',
      name: 'University of Cape Coast',
      location: 'Cape Coast, Central Region',
      establishedYear: 1962,
      studentPopulation: 45000,
      campuses: ['Main Campus - Cape Coast'],
      contactEmail: 'info@ucc.edu.gh',
      contactPhone: '+233332132480',
      website: 'https://ucc.edu.gh',
      logoUrl: '/logos/ucc.png'
    }
  ];

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch academic calendar
   */
  const { data: academicCalendar, isLoading: calendarLoading } = useQuery({
    queryKey: ['academic-calendar', selectedUniversity],
    queryFn: async (): Promise<AcademicCalendar[]> => {
      // Mock data - would integrate with actual university APIs
      return [
        {
          id: '1',
          university: selectedUniversity,
          academicYear: '2023/2024',
          semester: 'first',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-15'),
          registrationStart: new Date('2023-08-15'),
          registrationEnd: new Date('2023-09-15'),
          examStart: new Date('2023-12-01'),
          examEnd: new Date('2023-12-15'),
          holidays: [
            {
              name: 'Independence Day',
              startDate: new Date('2024-03-06'),
              endDate: new Date('2024-03-06'),
              type: 'national'
            },
            {
              name: 'Mid-Semester Break',
              startDate: new Date('2023-10-15'),
              endDate: new Date('2023-10-22'),
              type: 'university'
            }
          ],
          isActive: false
        },
        {
          id: '2',
          university: selectedUniversity,
          academicYear: '2023/2024',
          semester: 'second',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-05-15'),
          registrationStart: new Date('2024-01-01'),
          registrationEnd: new Date('2024-01-31'),
          examStart: new Date('2024-05-01'),
          examEnd: new Date('2024-05-15'),
          holidays: [
            {
              name: 'Easter Break',
              startDate: new Date('2024-03-29'),
              endDate: new Date('2024-04-01'),
              type: 'religious'
            }
          ],
          isActive: true
        }
      ];
    },
    enabled: !!selectedUniversity
  });

  /**
   * Fetch campus events
   */
  const { data: campusEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['campus-events', selectedUniversity],
    queryFn: async (): Promise<CampusEvent[]> => {
      // Mock data - would integrate with actual university event APIs
      return [
        {
          id: '1',
          title: 'New Student Orientation',
          description: 'Welcome orientation for new students',
          university: selectedUniversity,
          eventType: 'orientation',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-17'),
          location: 'Main Auditorium',
          impactOnBookings: true,
          createdBy: 'Campus Admin',
          status: 'scheduled'
        },
        {
          id: '2',
          title: 'Final Examinations',
          description: 'End of semester examinations',
          university: selectedUniversity,
          eventType: 'exam',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-05-15'),
          location: 'Various Exam Halls',
          impactOnBookings: true,
          createdBy: 'Academic Office',
          status: 'scheduled'
        }
      ];
    },
    enabled: !!selectedUniversity
  });

  /**
   * Fetch semester booking cycles
   */
  const { data: bookingCycles, isLoading: cyclesLoading } = useQuery({
    queryKey: ['booking-cycles', selectedUniversity],
    queryFn: async (): Promise<SemesterBookingCycle[]> => {
      // Mock data - would integrate with actual booking system
      return [
        {
          id: '1',
          university: selectedUniversity,
          academicYear: '2023/2024',
          semester: 'Second Semester',
          bookingOpenDate: new Date('2023-12-01'),
          bookingCloseDate: new Date('2024-01-10'),
          moveInStart: new Date('2024-01-12'),
          moveInEnd: new Date('2024-01-20'),
          moveOutStart: new Date('2024-05-16'),
          moveOutEnd: new Date('2024-05-25'),
          totalBookings: 234,
          availableSpaces: 45,
          waitlistCount: 12
        }
      ];
    },
    enabled: !!selectedUniversity
  });

  /**
   * Fetch university requirements
   */
  const { data: universityRequirements, isLoading: requirementsLoading } = useQuery({
    queryKey: ['university-requirements', selectedUniversity],
    queryFn: async (): Promise<UniversityRequirement[]> => {
      // Mock data - would integrate with actual university requirements
      return [
        {
          id: '1',
          university: selectedUniversity,
          requirementType: 'enrollment_verification',
          title: 'Current Enrollment Verification',
          description: 'Proof of current enrollment status from the university',
          mandatory: true,
          documentRequired: true,
          validityPeriod: 30,
          lastUpdated: new Date('2024-01-01')
        },
        {
          id: '2',
          university: selectedUniversity,
          requirementType: 'academic_standing',
          title: 'Good Academic Standing',
          description: 'Student must be in good academic standing (GPA >= 2.0)',
          mandatory: true,
          documentRequired: false,
          validityPeriod: 90,
          lastUpdated: new Date('2024-01-01')
        },
        {
          id: '3',
          university: selectedUniversity,
          requirementType: 'financial_clearance',
          title: 'Financial Clearance',
          description: 'No outstanding fees or financial obligations to the university',
          mandatory: false,
          documentRequired: true,
          validityPeriod: 60,
          lastUpdated: new Date('2024-01-01')
        }
      ];
    },
    enabled: !!selectedUniversity
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get event type color
   */
  const getEventTypeColor = (eventType: string): string => {
    switch (eventType) {
      case 'orientation': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'graduation': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get event status color
   */
  const getEventStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Format date range
   */
  const formatDateRange = (startDate: Date, endDate: Date): string => {
    const start = startDate.toLocaleDateString();
    const end = endDate.toLocaleDateString();
    return start === end ? start : `${start} - ${end}`;
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  const selectedUniversityInfo = ghanaUniversities.find(uni => uni.code === selectedUniversity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <School className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">University Integration</h1>
            <p className="text-gray-600">Manage university partnerships and academic integration</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* University Selector */}
          <select 
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {ghanaUniversities.map((university) => (
              <option key={university.code} value={university.code}>
                {university.name}
              </option>
            ))}
          </select>
          
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-2">
            <School className="h-4 w-4" />
            University Integration
          </Badge>
        </div>
      </div>

      {/* University Information */}
      {selectedUniversityInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              {selectedUniversityInfo.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-600">Location</Label>
                <p className="font-medium">{selectedUniversityInfo.location}</p>
              </div>
              <div>
                <Label className="text-gray-600">Established</Label>
                <p className="font-medium">{selectedUniversityInfo.establishedYear}</p>
              </div>
              <div>
                <Label className="text-gray-600">Student Population</Label>
                <p className="font-medium">{selectedUniversityInfo.studentPopulation.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-gray-600">Contact Email</Label>
                <p className="font-medium">{selectedUniversityInfo.contactEmail}</p>
              </div>
              <div>
                <Label className="text-gray-600">Contact Phone</Label>
                <p className="font-medium">{selectedUniversityInfo.contactPhone}</p>
              </div>
              <div>
                <Label className="text-gray-600">Website</Label>
                <a href={selectedUniversityInfo.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                  {selectedUniversityInfo.website}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* University Integration Tabs */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Academic Calendar</TabsTrigger>
          <TabsTrigger value="events">Campus Events</TabsTrigger>
          <TabsTrigger value="bookings">Booking Cycles</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        {/* Academic Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Academic Calendar - {selectedUniversity}
                </span>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync with University
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calendarLoading ? (
                <div className="text-center py-4">Loading academic calendar...</div>
              ) : (
                <div className="space-y-4">
                  {academicCalendar?.map((semester) => (
                    <div key={semester.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{semester.academicYear} - {semester.semester.charAt(0).toUpperCase() + semester.semester.slice(1)} Semester</h3>
                          <p className="text-sm text-gray-600">
                            {formatDateRange(semester.startDate, semester.endDate)}
                          </p>
                        </div>
                        <Badge className={semester.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {semester.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Registration Period</Label>
                          <p>{formatDateRange(semester.registrationStart, semester.registrationEnd)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Examination Period</Label>
                          <p>{formatDateRange(semester.examStart, semester.examEnd)}</p>
                        </div>
                      </div>

                      {semester.holidays.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-gray-600">Holidays & Breaks</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {semester.holidays.map((holiday, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {holiday.name} ({holiday.startDate.toLocaleDateString()})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campus Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Campus Events - {selectedUniversity}
                </span>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="text-center py-4">Loading campus events...</div>
              ) : (
                <div className="space-y-3">
                  {campusEvents?.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{event.location}</span>
                            <Clock className="h-3 w-3 text-gray-400 ml-2" />
                            <span className="text-xs text-gray-500">
                              {formatDateRange(event.startDate, event.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                        <Badge className={getEventStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        {event.impactOnBookings && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Impacts Bookings
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Cycles Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Semester Booking Cycles - {selectedUniversity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cyclesLoading ? (
                <div className="text-center py-4">Loading booking cycles...</div>
              ) : (
                <div className="space-y-4">
                  {bookingCycles?.map((cycle) => (
                    <div key={cycle.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{cycle.academicYear} - {cycle.semester}</h3>
                          <p className="text-sm text-gray-600">{cycle.university}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{cycle.totalBookings} Total Bookings</p>
                          <p className="text-xs text-gray-600">{cycle.availableSpaces} spaces available</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-600">Booking Period</Label>
                          <p>{formatDateRange(cycle.bookingOpenDate, cycle.bookingCloseDate)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Move-In Period</Label>
                          <p>{formatDateRange(cycle.moveInStart, cycle.moveInEnd)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Move-Out Period</Label>
                          <p>{formatDateRange(cycle.moveOutStart, cycle.moveOutEnd)}</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Waitlist</Label>
                          <p>{cycle.waitlistCount} students waiting</p>
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Cycle
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  University Requirements - {selectedUniversity}
                </span>
                <Button size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Requirement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requirementsLoading ? (
                <div className="text-center py-4">Loading university requirements...</div>
              ) : (
                <div className="space-y-3">
                  {universityRequirements?.map((requirement) => (
                    <div key={requirement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${requirement.mandatory ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div>
                          <h3 className="font-medium">{requirement.title}</h3>
                          <p className="text-sm text-gray-600">{requirement.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Valid for {requirement.validityPeriod} days
                            </span>
                            <span className="text-xs text-gray-500">
                              Updated: {requirement.lastUpdated.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={requirement.mandatory ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                          {requirement.mandatory ? 'Mandatory' : 'Optional'}
                        </Badge>
                        {requirement.documentRequired && (
                          <Badge variant="outline">
                            Document Required
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Academic Calendar</div>
              <div className="text-xs text-green-600">Synced</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <div className="text-sm text-gray-600">Student Verification</div>
              <div className="text-xs text-green-600">Active</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">⚠</div>
              <div className="text-sm text-gray-600">Event Integration</div>
              <div className="text-xs text-yellow-600">Partial</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">🔄</div>
              <div className="text-sm text-gray-600">API Connection</div>
              <div className="text-xs text-blue-600">Connected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityIntegration;

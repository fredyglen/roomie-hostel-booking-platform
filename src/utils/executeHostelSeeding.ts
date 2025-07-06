/**
 * Execute Hostel Seeding Utility
 * Simple utility to run the comprehensive hostel seeding process
 */

import { executeHostelSeeding } from '@/scripts/seedAllHostels';

// Execute the seeding process
executeHostelSeeding().catch(console.error);

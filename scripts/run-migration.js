#!/usr/bin/env node

/**
 * ROOMi Platform Data Migration CLI
 * Apple-Grade Migration Execution Script
 *
 * Usage: node scripts/run-migration.js
 *
 * This script executes the complete hardcoded data migration process
 * following BE CONSCIOUS Apple-Grade standards with comprehensive validation.
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 ROOMi Platform Data Migration');
console.log('📋 BE CONSCIOUS Apple-Grade Standards');
console.log('⚡ Executing migration with TypeScript...');
console.log('');

try {
  // Change to project root directory
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);
  
  // Execute the TypeScript migration script
  execSync('npx tsx src/scripts/execute-migration.ts', {
    stdio: 'inherit',
    cwd: projectRoot
  });
  
} catch (error) {
  console.error('❌ Migration execution failed:');
  console.error(error.message);
  process.exit(1);
}

/**
 * Development Components Validation Script
 * Apple-Level validation for development environment components
 *
 * @fileoverview Comprehensive validation script for development components
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Validation result interface
 */
interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly summary: string;
}

/**
 * Component validation interface
 */
interface ComponentValidation {
  readonly componentPath: string;
  readonly hasNamedExport: boolean;
  readonly hasDefaultExport: boolean;
  readonly hasTypeDefinitions: boolean;
  readonly importsResolved: boolean;
}

/**
 * Development Components Validator
 */
class DevComponentsValidator {
  private readonly srcPath: string;
  private readonly componentsPath: string;
  private readonly typesPath: string;

  constructor() {
    this.srcPath = path.resolve(process.cwd(), 'src');
    this.componentsPath = path.resolve(this.srcPath, 'components', 'dev');
    this.typesPath = path.resolve(this.srcPath, 'types');
  }

  /**
   * Validate DevBypassIndicator component
   */
  async validateDevBypassIndicator(): Promise<ComponentValidation> {
    const componentPath = path.resolve(this.componentsPath, 'DevBypassIndicator.tsx');
    
    try {
      const content = await fs.readFile(componentPath, 'utf-8');
      
      // Check for named export
      const hasNamedExport = /export\s+const\s+DevBypassIndicator/.test(content);
      
      // Check for default export
      const hasDefaultExport = /export\s+default\s+DevBypassIndicator/.test(content);
      
      // Check for type definitions
      const typeDefPath = path.resolve(this.typesPath, 'dev-components.d.ts');
      const hasTypeDefinitions = await fs.access(typeDefPath).then(() => true).catch(() => false);
      
      // Check if imports are properly structured
      const importsResolved = this.validateImports(content);
      
      return {
        componentPath,
        hasNamedExport,
        hasDefaultExport,
        hasTypeDefinitions,
        importsResolved
      };
    } catch (error) {
      throw new Error(`Failed to validate DevBypassIndicator: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate component imports
   */
  private validateImports(content: string): boolean {
    // Check for proper React import
    const hasReactImport = /import\s+React/.test(content);
    
    // Check for proper utility imports with path aliases
    const hasUtilityImports = /@\/utils\//.test(content) && /@\/errors\//.test(content);
    
    // Check for no relative imports in dev components
    const hasNoRelativeImports = !content.includes("import") || !/import.*['"]\.\.?\//.test(content);
    
    return hasReactImport && hasUtilityImports && hasNoRelativeImports;
  }

  /**
   * Validate TypeScript configuration
   */
  async validateTypeScriptConfig(): Promise<boolean> {
    try {
      const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const config = JSON.parse(content);
      
      // Check for proper path aliases
      const hasPathAliases = config.compilerOptions?.paths?.['@/*'];
      
      // Check for proper JSX configuration
      const hasJsxConfig = config.compilerOptions?.jsx === 'react-jsx';
      
      // Check for proper module resolution
      const hasModuleResolution = config.compilerOptions?.moduleResolution === 'bundler';
      
      // Check for proper includes
      const hasProperIncludes = Array.isArray(config.include) && config.include.some((inc: string) => inc.includes('src'));
      
      return hasPathAliases && hasJsxConfig && hasModuleResolution && hasProperIncludes;
    } catch (error) {
      return false;
    }
  }

  /**
   * Run comprehensive validation
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate DevBypassIndicator component
      const componentValidation = await this.validateDevBypassIndicator();
      
      if (!componentValidation.hasNamedExport) {
        errors.push('DevBypassIndicator missing named export');
      }
      
      if (!componentValidation.hasDefaultExport) {
        errors.push('DevBypassIndicator missing default export');
      }
      
      if (!componentValidation.hasTypeDefinitions) {
        warnings.push('DevBypassIndicator missing type definitions file');
      }
      
      if (!componentValidation.importsResolved) {
        errors.push('DevBypassIndicator has import resolution issues');
      }
      
      // Validate TypeScript configuration
      const tsConfigValid = await this.validateTypeScriptConfig();
      if (!tsConfigValid) {
        errors.push('TypeScript configuration is invalid or incomplete');
      }
      
      const isValid = errors.length === 0;
      const summary = isValid 
        ? 'All development components validation passed'
        : `Validation failed with ${errors.length} errors and ${warnings.length} warnings`;
      
      return {
        isValid,
        errors,
        warnings,
        summary
      };
      
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${error instanceof Error ? error.message : String(error)}`],
        warnings: [],
        summary: 'Critical validation failure'
      };
    }
  }
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
  const validator = new DevComponentsValidator();
  const result = await validator.validate();
  
  console.log('\n🍎 Apple-Level Development Components Validation\n');
  console.log(`Status: ${result.isValid ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Summary: ${result.summary}\n`);
  
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
    console.log('');
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
    console.log('');
  }
  
  process.exit(result.isValid ? 0 : 1);
}

// Run validation if this script is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Validation script failed:', error);
    process.exit(1);
  });
}

export { DevComponentsValidator, ValidationResult, ComponentValidation };

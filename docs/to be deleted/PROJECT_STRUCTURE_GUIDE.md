# 🏗️ ROOMi Platform: Enterprise-Grade Project Structure

**Welcome to ROOMi!** This guide explains our entire project organization so clearly that anyone - from developers to photographers - can understand and navigate the platform.

---

## 🎯 **WHAT IS ROOMi?**

**ROOMi** is Ghana's premier student housing marketplace - think "Airbnb for university students." We connect students with verified accommodation across university campuses.

### **🏠 Core Business**
- **Students**: Find and book semester housing (4 months)
- **Property Owners**: List and manage student accommodations  
- **Agents**: Help students find housing (earn 4% commission)
- **Platform**: Facilitates bookings (5% + GHS 100 fee)

---

## 📁 **PROJECT STRUCTURE OVERVIEW**

```
roomi-campus-nest/                    # 🏠 Main Project Folder
├── 📚 docs/                          # All Documentation
├── 🎨 assets/                        # Visual Assets & Design
├── 💻 src/                           # Source Code
├── 🌐 public/                        # Public Web Files
├── 🗄️ supabase/                      # Database & Backend
├── 📦 scripts/                       # Automation Scripts
├── 🧪 tests/                         # Testing Files
├── 📋 project-management/            # Project Organization
└── 🔧 config files                   # Technical Configuration
```

---

## 📚 **DOCUMENTATION STRUCTURE** (`docs/`)

### **01-GETTING-STARTED/** 🚀
**For new team members and stakeholders**
- `README.md` - Project overview and quick start
- `AUTHENTICATION_GUIDE.md` - How login/signup works
- `index.md` - Navigation guide

### **02-ARCHITECTURE/** 🏗️
**Technical system design**
- Database schemas and relationships
- API documentation and endpoints
- Security frameworks and patterns

### **03-BUSINESS-LOGIC/** 💼
**Business rules and operations**
- `PAYMENT_RULES.md` - Commission structure (5% + GHS 100)
- `BOOKING_RULES.md` - How bookings work
- `PAYMENT-LOGIC.md` - Technical payment implementation

### **04-DEVELOPMENT/** 🛠️
**Development guidelines and standards**
- `HARDCODED_VALUES_INVENTORY.md` - Configuration management
- `BookingFlowImplementationRoadmap.md` - Feature development plan
- `REFACTORING_PLAN.md` - Code improvement strategy

### **05-DEPLOYMENT/** 🚀
**How to launch the platform**
- Production deployment guides
- Environment setup instructions
- Monitoring and alerting

### **06-MAINTENANCE/** 🔧
**Platform health and optimization**
- `COMPREHENSIVE_AUDIT_REPORT.md` - Platform health analysis
- `DEMO_HOSTELS_ANALYSIS_REPORT.md` - Data insights
- Performance optimization guides

### **07-LEGACY/** 📜
**Historical information**
- `DEVELOPMENT_TRANSCRIPT.md` - SaaS development insights
- Migration logs and decisions
- Deprecated feature documentation

### **08-PENDING-DELETION/** 🗑️
**Files awaiting approval for deletion**
- Duplicate documentation
- Outdated implementation guides

---

## 🎨 **VISUAL ASSETS STRUCTURE** (`assets/`)

### **images/** 📸
- `logos/` - ROOMi brand logos and variations
- `icons/` - UI icons and symbols
- `screenshots/` - Platform screenshots for documentation
- `mockups/` - Design mockups and wireframes
- `property-photos/` - Sample property images

### **design-system/** 🎨
- `colors.md` - Brand color palette
- `typography.md` - Font specifications
- `components.md` - UI component library
- `guidelines.md` - Design principles

### **marketing/** 📢
- `banners/` - Marketing banners and graphics
- `social-media/` - Social media assets
- `presentations/` - Pitch decks and presentations

---

## 💻 **SOURCE CODE STRUCTURE** (`src/`)

### **Core Application**
- `App.tsx` - Main application component
- `main.tsx` - Application entry point
- `index.css` - Global styles

### **Feature Modules**
- `pages/` - Main application pages (Home, Search, Booking)
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `services/` - API and business logic services

### **Configuration & Setup**
- `config/` - Application configuration
- `constants/` - Application constants
- `types/` - TypeScript type definitions
- `utils/` - Utility functions

### **Integrations**
- `integrations/` - Third-party service integrations
- `api/` - API endpoint definitions
- `schemas/` - Data validation schemas

### **Special Folders**
- `BE CONSCIOUS/` - **DO NOT TOUCH** - Critical architectural standards
- `test/` - Unit and integration tests

---

## 🌐 **PUBLIC FILES STRUCTURE** (`public/`)

### **Static Assets**
- `favicon.ico` - Website icon
- `robots.txt` - Search engine instructions
- `_redirects` - URL redirect rules

### **Uploads**
- `lovable-uploads/` - User-generated content
- `placeholder.svg` - Default placeholder image

---

## 🗄️ **DATABASE STRUCTURE** (`supabase/`)

### **Configuration**
- `config.toml` - Supabase configuration

### **Database Management**
- `migrations/` - Database schema changes
- `functions/` - Server-side functions

---

## 📦 **AUTOMATION SCRIPTS** (`scripts/`)

### **Development Tools**
- `seed-hostels.js` - Populate database with sample data
- `validate-dev-components.ts` - Code quality checks

---

## 📋 **PROJECT MANAGEMENT** (`project-management/`)

### **Planning & Tracking**
- `roadmap.md` - Feature development timeline
- `milestones.md` - Project milestones and goals
- `team-roles.md` - Team member responsibilities

### **Business Documentation**
- `business-model.md` - Revenue and growth strategy
- `market-analysis.md` - Ghana student housing market insights
- `competitor-analysis.md` - Competitive landscape

---

## 🔧 **CONFIGURATION FILES** (Root Level)

### **Development Configuration**
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build tool configuration
- `tailwind.config.ts` - Styling framework setup

### **Code Quality**
- `eslint.config.js` - Code linting rules
- `postcss.config.js` - CSS processing configuration

---

## 🎯 **QUICK NAVIGATION FOR DIFFERENT ROLES**

### **👨‍💼 Business Stakeholders**
1. Start with `docs/README.md` for platform overview
2. Review `docs/03-BUSINESS-LOGIC/` for business rules
3. Check `project-management/` for planning documents

### **👩‍💻 Developers**
1. Read `docs/01-GETTING-STARTED/` for setup
2. Review `docs/04-DEVELOPMENT/` for coding standards
3. Explore `src/` for source code

### **🎨 Designers**
1. Check `assets/design-system/` for brand guidelines
2. Review `assets/images/` for visual assets
3. See `src/components/` for UI components

### **📸 Photographers/Content Creators**
1. Upload images to `public/lovable-uploads/`
2. Reference `assets/design-system/` for brand consistency
3. Check `assets/marketing/` for campaign materials

### **🧪 Testers**
1. Review `docs/06-MAINTENANCE/` for platform health
2. Check `tests/` for testing procedures
3. Use `scripts/` for test data setup

---

## 🚀 **GETTING STARTED CHECKLIST**

### **For Anyone New to the Project**
- [ ] Read this `PROJECT_STRUCTURE_GUIDE.md`
- [ ] Review `docs/README.md` for platform overview
- [ ] Check your role-specific navigation above
- [ ] Ask questions if anything is unclear

### **For Technical Setup**
- [ ] Install Node.js and npm
- [ ] Run `npm install` to install dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Run `npm run dev` to start development server

---

---

## 🎯 **MOBILE PREVIEW SETUP**

### **Quick Mobile Testing**
```bash
# Start mobile-friendly development server
npm run dev:mobile

# Access from phone (same WiFi network)
# Use your computer's IP address: http://192.168.1.100:5173
```

**Detailed Instructions**: See `docs/01-GETTING-STARTED/MOBILE_PREVIEW_GUIDE.md`

---

## 🗂️ **CURRENT PROJECT STATUS**

### **✅ COMPLETED REORGANIZATION**
- **📚 Documentation**: Fully organized into 8-tier structure
- **🎨 Visual Assets**: Complete design system created
- **📋 Project Management**: All scattered files organized
- **📱 Mobile Preview**: Setup guide and configuration ready
- **🏗️ Enterprise Structure**: Professional organization implemented

### **📁 NEW FOLDER STRUCTURE**
```
roomi-campus-nest/
├── 📋 PROJECT_STRUCTURE_GUIDE.md    # 👈 YOU ARE HERE
├── 📚 docs/                         # All Documentation (8-tier)
├── 🎨 assets/                       # Visual Assets & Design System
├── 📋 project-management/           # Business & Planning Docs
├── 💻 src/                          # Source Code (Clean & Organized)
├── 🌐 public/                       # Public Web Files
├── 🗄️ supabase/                     # Database & Backend
├── 📦 scripts/                      # Automation Scripts
└── 🔧 config files                  # Technical Configuration
```

### **🎯 NO MORE SCATTERED FILES**
- ✅ All .md files properly organized
- ✅ No floating documentation in root
- ✅ Clear folder hierarchy
- ✅ Professional structure maintained

---

## 📞 **IMMEDIATE NEXT STEPS**

### **For Mobile Testing**
1. **Run**: `npm run dev -- --host`
2. **Find IP**: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. **Access**: `http://YOUR_IP:5173` on phone
4. **Detailed Guide**: `docs/01-GETTING-STARTED/MOBILE_PREVIEW_GUIDE.md`

### **For Project Navigation**
1. **Start Here**: This `PROJECT_STRUCTURE_GUIDE.md`
2. **Documentation**: `docs/README.md`
3. **Project Management**: `project-management/README.md`
4. **Design System**: `assets/design-system/README.md`

---

**Last Updated**: 2025-01-06
**Structure Version**: 2.0 Enterprise Grade
**Maintained By**: ROOMi Development Team

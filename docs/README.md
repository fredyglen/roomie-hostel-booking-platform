# 📚 ROOMi Platform Documentation

**Welcome to the ROOMi Platform Documentation Hub**

ROOMi is Ghana's premier student housing marketplace, connecting students with verified accommodation across university campuses. This documentation provides comprehensive guidance for developers, business stakeholders, and platform administrators.

---

## 🗂️ **DOCUMENTATION STRUCTURE**

### **📁 [01-GETTING-STARTED](./01-GETTING-STARTED/)**
Essential documentation for new developers and stakeholders
- Project overview and quick start guide
- Authentication setup and configuration
- Platform architecture overview

### **📁 [02-ARCHITECTURE](./02-ARCHITECTURE/)**
Technical architecture and system design documentation
- Database schemas and relationships
- API documentation and endpoints
- Security frameworks and patterns

### **📁 [03-BUSINESS-LOGIC](./03-BUSINESS-LOGIC/)**
Business rules, payment structures, and operational workflows
- Payment rules and commission structure (5% + GHS 100)
- Booking rules and semester-based system
- User roles and permissions

### **📁 [04-DEVELOPMENT](./04-DEVELOPMENT/)**
Development guidelines, coding standards, and implementation guides
- TypeScript migration and coding standards
- Configuration management
- Implementation roadmaps and refactoring plans

### **📁 [05-PROJECT-MANAGEMENT](./05-PROJECT-MANAGEMENT/)**
Planning, progress tracking, and program management
- Business planning and strategic briefs (business/)
- Technical specs and migration plans (technical/)
- Roadmaps, status, and operations (planning/)
- Archived project materials (archived/)

### **📁 [05-DEPLOYMENT](./05-DEPLOYMENT/)**
Deployment procedures, environment setup, and CI/CD pipelines
- Production deployment guides
- Environment configuration
- Monitoring and alerting setup

### **📁 [06-MAINTENANCE](./06-MAINTENANCE/)**
Platform maintenance, technical debt analysis, and performance optimization
- Comprehensive audit reports
- Performance optimization guides
- Security updates and procedures

### **📁 [07-LEGACY](./07-LEGACY/)**
Historical documentation and deprecated features
- Migration logs and historical decisions
- Deprecated feature documentation
- Legacy system references

### **📁 [08-PENDING-DELETION](./08-PENDING-DELETION/)**
Files staged for deletion pending approval
- Duplicate documentation
- Outdated implementation guides
- Conflicting information sources

## 🗄️ Historical Archives
- [07-LEGACY](./07-LEGACY/) — Retained historical materials and deprecated docs for reference
- [to be deleted](./to%20be%20deleted/) — Quarantine area — files marked for potential deletion. Do not rely on content here for current development.

---

## 🛡️ Authoritative Standards
- The directory `src/BE CONSCIOUS/` contains the platform’s Apple‑grade standards and protocols. Do not modify these files. Treat them as the single source of truth for business rules and development workflows.

## 📌 Key Canonical Docs
- Payment System: [docs/03-BUSINESS-LOGIC/PAYMENT-LOGIC.md](./03-BUSINESS-LOGIC/PAYMENT-LOGIC.md)
- Booking Flow: [docs/04-DEVELOPMENT/BOOKINGFLOW.MD](./04-DEVELOPMENT/BOOKINGFLOW.MD)
- Hardcoded Values Inventory: [docs/04-DEVELOPMENT/HARDCODED_VALUES_INVENTORY.md](./04-DEVELOPMENT/HARDCODED_VALUES_INVENTORY.md)


## 🎯 **QUICK NAVIGATION**

### **For New Developers**
1. Start with [Getting Started Guide](./01-GETTING-STARTED/README.md)
2. Review [Authentication Guide](./01-GETTING-STARTED/AUTHENTICATION_GUIDE.md)
3. Understand [Payment Rules](./03-BUSINESS-LOGIC/PAYMENT_RULES.md)
4. Check [Development Standards](./04-DEVELOPMENT/)

### **For Business Stakeholders**
1. Review [Business Logic](./03-BUSINESS-LOGIC/)
2. Understand [Payment Structure](./03-BUSINESS-LOGIC/PAYMENT_RULES.md)
3. Check [Platform Analysis](./06-MAINTENANCE/)

### **For Platform Administrators**
1. Review [Deployment Guides](./05-DEPLOYMENT/)
2. Check [Maintenance Procedures](./06-MAINTENANCE/)
3. Monitor [Technical Debt](./06-MAINTENANCE/COMPREHENSIVE_AUDIT_REPORT.md)

---

## 🔧 **PLATFORM OVERVIEW**

### **Core Features**
- **Student Portal**: Property search, booking, and payment
- **Owner Portal**: Property management and analytics
- **Admin Portal**: Platform administration and monitoring
- **Payment System**: Paystack integration with automated distribution

### **Technical Stack**
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Paystack integration
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

### **Business Model**
- **Commission Structure**: 5% + GHS 100 platform fee
- **Agent Partnership**: 4% commission on bookings
- **Property Owner Retention**: 88% of booking value
- **Target Market**: Ghana university students

---

## 📞 **SUPPORT & CONTACT**

- **Technical Issues**: Check [Development Documentation](./04-DEVELOPMENT/)
- **Business Questions**: Review [Business Logic](./03-BUSINESS-LOGIC/)
- **Platform Status**: Monitor [Maintenance Reports](./06-MAINTENANCE/)

---

**Last Updated**: 2025-01-06
**Documentation Version**: 2.0
**Platform Version**: Production Ready

# VendorPro - Product Requirements Document

## Overview
VendorPro is a comprehensive retail management platform designed to help shop owners manage their inventory, sales, commissions, and reporting. The application follows a mobile-first approach with a design theme inspired by [BharatPe](https://bharatpe.com/).

## User Types
The platform supports two types of users with distinct views and capabilities:
1. **Shop Owner** - The primary administrator who manages the shop, inventory, and salesman
2. **Salesman** - Employees who record sales and earn commissions

## Core Features

### User Authentication
- Mobile-based OTP login for shop owners
- Username/password login for salesmen (credentials provided by shop owner)
- Secure authentication flows with session management
- Multi-language support during onboarding (English/Hindi)

### Shop Management
- Shop registration with essential details
  - Shop name
  - Owner name
  - Email
  - GSTIN number
- Shop editing capabilities
- Multiple shop management (if applicable)

### Inventory Management
- Product addition with detailed information:
  - Product name
  - Base price
  - Selling price
  - Product image
  - Available quantity
- Inventory updates and tracking
- Low stock alerts
- Shop-specific inventory views

### Salesman Management
- Add/remove salesmen with relevant details:
  - Name
  - Mobile number
  - Commission structure
- Automatic notification to salesmen with login credentials
- Performance tracking and reporting

### Sales Management
- Sales entry by salesmen
- Sales approval/rejection workflow for shop owners
- Bulk approval/rejection capabilities
- Sales tracking and reporting
- Commission calculation based on predefined structures

### Commission Management
- Creation of commission structures by shop owners
- Commission tracking and reporting
- Daily, weekly, and monthly commission views

### Reporting & Analytics
- Comprehensive dashboard for shop owners
- Salesman-specific dashboard
- Daily, weekly, and monthly report views
- Top-performing product insights
- Sales trends and analytics
- Commission reports

## Pages for Shop Owner

### Login Page
- Mobile number input
- OTP verification
- Remember me option
- Language selection (English/Hindi)

### Shop Register/Edit Page
- Form fields for shop details
- Validation for required fields
- GSTIN validation
- Success/error notifications

### Inventory Management Page
- Product listing with search and filter options
- Add/edit product form
- Image upload capability
- Stock level indicators
- Batch update options

### Salesman Management Page
- List of salesmen with status indicators
- Add salesman form
- Commission structure assignment
- Performance metrics
- Activity logs

### Main Dashboard
- Key performance indicators:
  - Daily/weekly/monthly sales
  - Inventory status
  - Salesman performance
  - Commission payouts
- Quick action buttons
- Notifications center
- Recent activities log

### Sales Approval Page
- Pending sales list with details
- Individual and bulk approval options
- Rejection with reason option
- Sales history with status filters

### Shop Owner Profile Page
- Personal information
- Account settings
- Notification preferences
- Language preferences

## Pages for Salesman

### Login Page
- Phone number/username input
- Password field
- Forgot password option
- Language selection

### Main Dashboard
- Sales entry form
- Product selection from inventory
- Quantity and price fields
- Commission calculation preview
- Daily sales summary
- Commission earned summary

### Sales History Page
- List of sales entries with status
- Sales details view
- Filter by date, status, product
- Commission breakdown

### Performance Reports
- Daily, weekly, monthly sales metrics
- Commission earned statistics
- Progress towards targets (if applicable)
- Comparison with previous periods

## Non-Functional Requirements
- Mobile-first, responsive design
- Lightweight application with fast load times
- Intuitive and accessible UI
- Offline capability for basic functions
- Secure data handling and privacy compliance
- Scalable architecture to support business growth
- Cross-platform compatibility
- Regular data backups
- High availability (99.9% uptime) 
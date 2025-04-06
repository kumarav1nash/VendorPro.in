# Sprint 3: Sales and Commission Management

**Sprint Goal**: Implement sales entry, approval workflow, and commission structure.

**Sprint Duration**: 2 weeks

**Story Points Committed**: 50

## Tasks

### Sales Management

#### TASK-022: Create Sales Entry Form for Salesmen
- [ ] Priority: P0
- Description: Implement the form for salesmen to record sales transactions.
- Acceptance Criteria:
  - Product selection from inventory with search
  - Quantity input with validation
  - Multiple product selection capability
  - Automatic price calculation
  - Commission preview
  - Form validation
  - Submit functionality to create sale in pending status
  - Success/error notifications
  - Responsive design
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-023: Implement Sales Listing with Status
- [ ] Priority: P0
- Description: Create the page for displaying all sales with status indicators.
- Acceptance Criteria:
  - Table view of sales
  - Status indicators (pending, approved, rejected)
  - Date filtering
  - Search functionality
  - Salesman filtering (for shop owners)
  - Pagination
  - Quick action buttons (view, approve, reject)
  - Responsive design
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-024: Develop Sales Detail View
- [ ] Priority: P0
- Description: Create the detailed view for individual sales.
- Acceptance Criteria:
  - Display sale metadata (date, salesman, total amount)
  - List of products sold with quantities and prices
  - Commission calculation details
  - Status with color coding
  - Action buttons based on status
  - Back button to return to listing
  - Responsive design
- Estimated Hours: 4
- Assigned To: TBD

#### TASK-025: Implement Sales Approval/Rejection Functionality
- [ ] Priority: P0
- Description: Create the functionality for shop owners to approve or reject sales.
- Acceptance Criteria:
  - Approval button with confirmation
  - Rejection button with reason input
  - Status update in database
  - Inventory update on approval
  - Commission record creation on approval
  - Notification to salesman
  - Success/error messages
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-026: Add Bulk Approval/Rejection Feature
- [ ] Priority: P1
- Description: Implement functionality to approve or reject multiple sales at once.
- Acceptance Criteria:
  - Multi-select capability in sales list
  - Bulk approve button with confirmation
  - Bulk reject button with common reason
  - Status updates for all selected items
  - Success/error notifications
  - Batch processing to handle large selections
- Estimated Hours: 4
- Assigned To: TBD

### Commission Management

#### TASK-027: Create Commission Structure Setup
- [ ] Priority: P0
- Description: Implement the interface for shop owners to define commission structures.
- Acceptance Criteria:
  - Form for creating commission rules
  - Support for percentage and fixed amount commission types
  - Product-specific or global commission options
  - Validation for commission values
  - Save functionality to database
  - Success/error notifications
  - Responsive design
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-028: Implement Commission Calculation Logic
- [ ] Priority: P0
- Description: Develop the logic to calculate commissions based on defined structures.
- Acceptance Criteria:
  - Calculation algorithm for both percentage and fixed commissions
  - Product-specific rule application
  - Fallback to global rules when product-specific not available
  - Integration with sales approval flow
  - Unit tests for calculation logic
  - Documentation of calculation rules
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-029: Create Commission Overview for Salesmen
- [ ] Priority: P0
- Description: Implement the view for salesmen to see their earned commissions.
- Acceptance Criteria:
  - Display daily, weekly, monthly summaries
  - Detailed list of commissions with related sales
  - Filter by date range
  - Sort by amount, date
  - Visual representation of commission trends
  - Responsive design
- Estimated Hours: 4
- Assigned To: TBD

### Salesman Experience

#### TASK-030: Implement Salesman Dashboard
- [ ] Priority: P0
- Description: Create the main dashboard for salesmen.
- Acceptance Criteria:
  - Display key metrics (sales count, total amount, commission)
  - Quick access to sales entry
  - Recent sales list
  - Commission summary
  - Daily, weekly, monthly toggle for metrics
  - Responsive design
- Estimated Hours: 5
- Assigned To: TBD

#### TASK-031: Create Salesman Sales History
- [ ] Priority: P1
- Description: Implement a comprehensive sales history view for salesmen.
- Acceptance Criteria:
  - List of all sales with status
  - Filter by date range and status
  - Search functionality
  - Detailed view for each sale
  - Commission information
  - Export option for records
  - Responsive design
- Estimated Hours: 4
- Assigned To: TBD

### Notifications

#### TASK-032: Implement Basic Notification System
- [ ] Priority: P1
- Description: Create a notification system for important events.
- Acceptance Criteria:
  - In-app notifications for sale approval/rejection
  - Notification for commission earned
  - Notification list/center
  - Mark as read functionality
  - Real-time updates using Supabase Realtime
  - Mobile-friendly design
- Estimated Hours: 4
- Assigned To: TBD

## Sprint Review & Retrospective

### Sprint Review
- Date: TBD
- Time: TBD
- Demo Items:
  - Sales entry workflow
  - Approval/rejection process
  - Commission calculation
  - Salesman dashboard
  - Notification system

### Sprint Retrospective
- Date: TBD
- Time: TBD
- Discussion Points:
  - What went well
  - What could be improved
  - Action items for next sprint 
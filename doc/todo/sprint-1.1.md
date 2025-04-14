# Sprint 1.1: UI-First Development with Dummy Data

**Sprint Goal**: Remove backend dependencies and implement UI with dummy data.

**Sprint Duration**: 1 week

**Story Points Committed**: 20

## Tasks

### Code Cleanup

#### TASK-001: Remove Supabase Dependencies
- [x] Priority: P0
- Description: Remove all Supabase-related code and dependencies from the project.
- Acceptance Criteria:
  - Remove Supabase client configuration
  - Remove Supabase environment variables
  - Remove database types and interfaces
  - Remove Supabase-related utility functions
  - Update package.json to remove Supabase dependencies
- Estimated Hours: 2
- Assigned To: Current User

#### TASK-002: Remove Database Schema and Migrations
- [x] Priority: P0
- Description: Remove all database-related files and code.
- Acceptance Criteria:
  - Remove database schema files
  - Remove migration scripts
  - Remove verification scripts
  - Remove database-related types
  - Clean up any database-related documentation
- Estimated Hours: 1
- Assigned To: Current User

### UI Implementation with Dummy Data

#### TASK-003: Create Dummy Data Service
- [x] Priority: P0
- Description: Implement a service to provide dummy data for the application.
- Acceptance Criteria:
  - Create dummy user data (shop owners and salesmen)
  - Create dummy shop data
  - Create dummy product data
  - Create dummy sales data
  - Implement data access functions
  - Add TypeScript types for dummy data
- Estimated Hours: 2
- Assigned To: Current User

#### TASK-004: Update Authentication Flow
- [x] Priority: P0
- Description: Modify authentication to use dummy data instead of Supabase.
- Acceptance Criteria:
  - Update login page to use dummy credentials
  - Implement dummy session management
  - Update protected routes to work with dummy auth
  - Add dummy user roles and permissions
  - Update navigation based on dummy auth state
- Estimated Hours: 3
- Assigned To: Current User

#### TASK-005: Update Shop Management
- [x] Priority: P0
- Description: Modify shop management features to use dummy data.
- Acceptance Criteria:
  - Update shop registration form to use dummy data
  - Update shop listing to use dummy data
  - Update shop details page to use dummy data
  - Update shop editing functionality to use dummy data
  - Add loading states and error handling
- Estimated Hours: 3
- Assigned To: Current User

### Testing and Verification

#### TASK-006: Verify UI Functionality
- [x] Priority: P0
- Description: Test all UI components with dummy data.
- Acceptance Criteria:
  - Test login with dummy credentials
  - Test shop registration and management
  - Test navigation and routing
  - Test responsive design
  - Verify all UI components work as expected
- Estimated Hours: 2
- Assigned To: Current User

#### TASK-007: Update Documentation
- [x] Priority: P1
- Description: Update project documentation to reflect UI-only approach.
- Acceptance Criteria:
  - Update README with new setup instructions
  - Document dummy data structure
  - Update API documentation to reflect dummy endpoints
  - Add notes about future backend integration
  - Update development guidelines
- Estimated Hours: 2
- Assigned To: Current User

## Dummy Data Structure

### Users
```typescript
interface DummyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'shop_owner' | 'salesman';
  password: string; // For demo purposes only
}
```

### Shops
```typescript
interface DummyShop {
  id: string;
  name: string;
  owner_id: string;
  address: string;
  phone: string;
  email: string;
  gst_number: string;
  created_at: string;
  updated_at: string;
}
```

### Products
```typescript
interface DummyProduct {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  base_price: number;
  selling_price: number;
  quantity: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

### Sales
```typescript
interface DummySale {
  id: string;
  shop_id: string;
  salesman_id: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
```

## Sprint Review & Retrospective

### Sprint Review
- Date: TBD
- Time: TBD
- Demo Items:
  - Clean project without backend dependencies
  - UI components working with dummy data
  - Authentication flow with dummy credentials
  - Shop management with dummy data

### Sprint Retrospective
- Date: TBD
- Time: TBD
- Discussion Points:
  - What went well
  - What could be improved
  - Action items for next sprint 
# VendorPro - Technical Requirements Document

## Technology Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux or Context API
- **UI Library**: Material-UI or Chakra UI
- **Styling**: Styled Components / Emotion
- **Form Handling**: Formik with Yup validation
- **Data Visualization**: Recharts or Chart.js
- **Internationalization**: i18next for multilingual support (English/Hindi)
- **PWA Support**: Service workers for offline functionality
- **Testing**: Jest and React Testing Library

### Backend
- **Platform**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (with OTP for shop owners)
- **BaaS**: Supabase for backend services
- **API Design**: RESTful API with OpenAPI specification
- **File Storage**: Supabase Storage for product images
- **Real-time Features**: Supabase Realtime for notifications

### Infrastructure
- **Hosting**: Vercel/Netlify for frontend, Supabase for backend services
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking, LogRocket for session replay
- **Analytics**: Google Analytics or Mixpanel

## Architecture

### System Design
The VendorPro application will follow a modular, microservices-based architecture with clear separation of concerns:

1. **Authentication Service**
   - Handles user authentication and session management
   - Managed through Supabase Auth
   - Role-based access control for shop owners and salesmen

2. **Shop Management Service**
   - Manages shop registration, updating, and retrieval
   - Handles shop owner profile management

3. **Inventory Management Service**
   - Handles product CRUD operations
   - Manages stock levels and inventory updates
   - Provides search and filter capabilities

4. **Sales Management Service**
   - Processes sales transactions
   - Handles approval workflows
   - Calculates commissions

5. **Reporting Service**
   - Generates various reports and analytics
   - Provides data aggregation for dashboards
   - Exports reports in various formats

6. **Notification Service**
   - Sends SMS notifications for OTP and alerts
   - Manages in-app notifications
   - Handles email communications

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('shop_owner', 'salesman')),
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Shops Table
```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  gstin VARCHAR(15),
  address TEXT,
  contact_phone VARCHAR(15),
  contact_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id),
  name VARCHAR(255) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  available_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Salesmen Table
```sql
CREATE TABLE salesmen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  shop_id UUID NOT NULL REFERENCES shops(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shop_id)
);
```

#### Commission Structure Table
```sql
CREATE TABLE commission_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id),
  name VARCHAR(255) NOT NULL,
  rate_type VARCHAR(20) NOT NULL CHECK (rate_type IN ('flat', 'percentage')),
  rate_value DECIMAL(10, 2) NOT NULL,
  product_id UUID REFERENCES products(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sales Table
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id),
  salesman_id UUID NOT NULL REFERENCES salesmen(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sale Items Table
```sql
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

#### Authentication
- `POST /api/auth/login/otp/request` - Request OTP
- `POST /api/auth/login/otp/verify` - Verify OTP
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Shops
- `POST /api/shops` - Create shop
- `GET /api/shops` - List shops
- `GET /api/shops/:id` - Get shop
- `PUT /api/shops/:id` - Update shop
- `DELETE /api/shops/:id` - Delete shop

#### Products
- `POST /api/shops/:shopId/products` - Create product
- `GET /api/shops/:shopId/products` - List products
- `GET /api/shops/:shopId/products/:id` - Get product
- `PUT /api/shops/:shopId/products/:id` - Update product
- `DELETE /api/shops/:shopId/products/:id` - Delete product

#### Salesmen
- `POST /api/shops/:shopId/salesmen` - Add salesman
- `GET /api/shops/:shopId/salesmen` - List salesmen
- `GET /api/shops/:shopId/salesmen/:id` - Get salesman
- `PUT /api/shops/:shopId/salesmen/:id` - Update salesman
- `DELETE /api/shops/:shopId/salesmen/:id` - Remove salesman

#### Sales
- `POST /api/shops/:shopId/sales` - Create sale
- `GET /api/shops/:shopId/sales` - List sales
- `GET /api/shops/:shopId/sales/:id` - Get sale
- `PUT /api/shops/:shopId/sales/:id/status` - Update sale status
- `POST /api/shops/:shopId/sales/bulk-approve` - Bulk approve sales
- `POST /api/shops/:shopId/sales/bulk-reject` - Bulk reject sales

#### Commission
- `POST /api/shops/:shopId/commission-structures` - Create commission structure
- `GET /api/shops/:shopId/commission-structures` - List commission structures
- `GET /api/shops/:shopId/commission-structures/:id` - Get commission structure
- `PUT /api/shops/:shopId/commission-structures/:id` - Update commission structure
- `DELETE /api/shops/:shopId/commission-structures/:id` - Delete commission structure

#### Reports
- `GET /api/shops/:shopId/reports/sales` - Sales reports
- `GET /api/shops/:shopId/reports/inventory` - Inventory reports
- `GET /api/shops/:shopId/reports/commissions` - Commission reports
- `GET /api/shops/:shopId/reports/performance` - Performance reports
- `GET /api/salesmen/:salesmanId/reports/sales` - Salesman sales reports
- `GET /api/salesmen/:salesmanId/reports/commissions` - Salesman commission reports

## Security Requirements

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure password storage with bcrypt
- OTP verification for shop owners
- Session management and timeout

### Data Protection
- HTTPS for all communications
- Input validation and sanitization
- Protection against SQL injection
- XSS protection
- CSRF protection
- Rate limiting for API endpoints

### Compliance
- GDPR compliance for user data
- Audit logs for sensitive operations
- Data backup and recovery procedures

## Performance Requirements
- Page load time under 2 seconds
- API response time under 500ms
- Support for concurrent users
- Efficient database queries with proper indexing
- Image optimization for product photos
- Caching strategy for frequently accessed data

## Deployment & DevOps
- Containerization with Docker
- CI/CD pipeline with GitHub Actions
- Staging and production environments
- Automated testing before deployment
- Database migration strategy
- Monitoring and alerting
- Backup and disaster recovery

## Mobile Optimization
- Mobile-first responsive design
- Touch-friendly UI components
- Optimized for various screen sizes
- Reduced network payload for mobile
- PWA features for offline access
- Native-like experience on mobile browsers

## Integrations
- SMS gateway for OTP and notifications
- Email service for reports and alerts
- Payment gateway (if required)
- Cloud storage for images and documents
- Analytics and monitoring tools 
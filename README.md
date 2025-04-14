# VendorPro - Shop Management System

A React-based shop management system with a UI-first development approach using dummy data.

## Features

- User Authentication (Shop Owners and Salesmen)
- Shop Management
- Product Management
- Sales Management
- Role-based Access Control

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vendorpro.git
   cd vendorpro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000 (or another port if 3000 is in use).

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  │   ├── auth/      # Authentication-related components
  │   ├── layout/    # Layout components
  │   └── ui/        # Common UI components
  ├── hooks/         # Custom React hooks
  ├── pages/         # Page components
  │   ├── auth/      # Authentication pages
  │   ├── shop/      # Shop management pages
  │   ├── product/   # Product management pages
  │   └── sale/      # Sales management pages
  ├── services/      # Service layer with dummy data
  └── types/         # TypeScript type definitions
```

## Dummy Data

The project uses dummy data for development purposes. The data structure includes:

- Users (Shop Owners and Salesmen)
- Shops
- Products
- Sales

### Sample Credentials

Shop Owner:
- Email: owner@example.com
- Password: password123

Salesman:
- Email: salesman@example.com
- Password: password123

## Future Integration

This project is currently using dummy data for development. Future integration with a backend API will involve:

1. Replacing the dummy data services with actual API calls
2. Implementing proper authentication with JWT
3. Adding real-time updates for sales and inventory
4. Implementing data persistence and caching

## Development Guidelines

1. Component Structure:
   - Use functional components with TypeScript
   - Implement proper prop typing
   - Use custom hooks for shared logic

2. State Management:
   - Use React Context for global state
   - Use local state for component-specific data
   - Implement proper error handling

3. Styling:
   - Use TailwindCSS for styling
   - Follow the design system
   - Ensure responsive design

4. Testing:
   - Write unit tests for components
   - Test error scenarios
   - Ensure proper form validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
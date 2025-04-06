# VendorPro

A comprehensive vendor management system for shop owners and salesmen.

## Project Description

VendorPro is a web application that helps shop owners manage their inventory, track sales, and manage their relationship with salesmen. The system provides features for:

- Shop registration and management
- Inventory tracking
- Sales management
- Commission tracking
- Reporting and analytics

## Tech Stack

- Frontend: React.js
- Backend: Supabase
- Database: PostgreSQL
- Authentication: Supabase Auth
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

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

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
vendorpro/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   └── styles/        # Global styles
├── public/            # Static assets
└── tests/            # Test files
```

## Contributing

1. Create a feature branch: `git checkout -b feature/TASK-XXX-description`
2. Commit your changes: `git commit -m '[TASK-XXX] Type: description'`
3. Push to the branch: `git push origin feature/TASK-XXX-description`
4. Create a Pull Request

## License

This project is licensed under the MIT License. 
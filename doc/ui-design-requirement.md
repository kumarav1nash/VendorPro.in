# VendorPro - UI Design Requirements

## Design Philosophy
VendorPro follows the design theme of [BharatPe](https://bharatpe.com/) with a mobile-first approach. The UI should be intuitive, clean, and optimized for touch interactions while maintaining functionality across all device sizes.

## Brand Identity

### Color Palette
- **Primary Color**: #0075FF (BharatPe Blue)
- **Secondary Color**: #FFAD00 (BharatPe Yellow)
- **Accent Color**: #00D632 (Success Green)
- **Warning Color**: #FF3B30
- **Text Primary**: #333333
- **Text Secondary**: #666666
- **Background Primary**: #FFFFFF
- **Background Secondary**: #F8F9FC
- **Dividers**: #EEEEEE

### Typography
- **Primary Font**: Inter (for English)
- **Secondary Font**: Noto Sans (for Hindi support)
- **Font Sizes**:
  - Heading 1: 24px (mobile) / 32px (desktop)
  - Heading 2: 20px (mobile) / 24px (desktop)
  - Heading 3: 18px (mobile) / 20px (desktop)
  - Body: 14px (mobile) / 16px (desktop)
  - Small: 12px
  - Caption: 10px
- **Font Weights**:
  - Regular: 400
  - Medium: 500
  - Bold: 700

### Iconography
- Modern, simple line icons with consistent 24px x 24px dimensions
- Active state should use the primary color
- Inactive state should use a lighter gray (#BBBBBB)
- Critical actions should use appropriate semantic colors

## Layout & Navigation

### Mobile Layout
- Utilize a bottom navigation bar for primary navigation
- Content area should have 16px padding on left and right sides
- Cards should have 12px margin between them
- Use tab navigation for sub-sections when necessary
- Implement swipe gestures for common actions
- Floating action button (FAB) for primary actions

### Tablet Layout
- Utilize a bottom navigation bar and optional side navigation
- Content area should have 24px padding on left and right sides
- Cards should have 16px margin between them
- Split-screen layouts for master-detail views on landscape orientation

### Desktop Layout
- Side navigation with expandable sections
- Content area should have 32px padding on left and right sides
- Multi-column layout for optimal screen utilization
- Consider advanced data visualizations for larger screens

### Navigation Structure
- **Shop Owner Navigation**:
  - Dashboard (Home)
  - Inventory
  - Sales
  - Salesmen
  - Reports
  - Profile
- **Salesman Navigation**:
  - Dashboard (Home)
  - Sales Entry
  - Commission Reports
  - Profile

## Component Design

### Common Components

#### App Bar
- Height: 56px (mobile) / 64px (desktop)
- Contains: Back button, Page title, Action items
- Fixed position at the top

#### Bottom Navigation
- Height: 56px
- 5 icons maximum for Shop Owner
- 3 icons for Salesman
- Active state clearly indicated with color and label

#### Cards
- Border radius: 8px
- Box shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)
- Padding: 16px
- Clear visual hierarchy for content

#### Buttons
- Primary Button:
  - Background: Primary Color
  - Text: White
  - Border radius: 4px
  - Height: 44px (mobile) / 48px (desktop)
- Secondary Button:
  - Border: 1px solid Primary Color
  - Text: Primary Color
  - Background: Transparent
- Text Button:
  - Text: Primary Color
  - No background or border

#### Form Elements
- Input fields:
  - Height: 48px
  - Border radius: 4px
  - Border: 1px solid #DDDDDD
  - Focus state: Primary Color border
- Dropdown menus:
  - Same styling as input fields
  - Clear indicator for dropdown functionality
- Checkboxes and radios:
  - Use Primary Color for selected state

#### Dialogs
- Border radius: 8px
- Width: 90% of screen (mobile), maximum 400px (desktop)
- Clear action buttons at the bottom
- Proper spacing between elements (16px)

#### Toast Messages
- Position: Bottom center
- Duration: 3 seconds (short), 5 seconds (long)
- Error/Success/Info variants with appropriate colors

### Dashboard Components

#### KPI Cards
- Compact display of key metrics
- Include trend indicators (up/down arrows)
- Clear, large numbers with appropriate units
- Secondary text for context

#### Charts and Graphs
- Use consistent color scheme
- Provide interactive tooltips on hover/tap
- Responsive design that adapts to screen size
- Include legends and axes labels

#### Activity Feed
- Timeline style for recent activities
- Clear timestamps
- Ability to filter by activity type
- Load more functionality

### Page-Specific Components

#### Product List
- Grid view (desktop) / List view (mobile)
- Product image thumbnail
- Essential details (name, price, stock)
- Quick action buttons

#### Inventory Management
- Search and filter capabilities
- Batch actions (top bar)
- Sorting options
- Pagination or infinite scroll

#### Sales Entry Form
- Product selection with search
- Quantity selector with +/- buttons
- Automatic price calculation
- Commission preview

#### Sales Approval Interface
- Batch selection mechanism
- Clear approve/reject buttons
- Detailed view of each sale
- Confirmation dialogs for actions

#### Reports and Analytics
- Date range selector
- Export options
- Printable view
- Visual data representations
- Tabular data with sorting

## Responsive Breakpoints
- **Mobile**: 320px - 599px
- **Tablet**: 600px - 1023px
- **Desktop**: 1024px and above

## Accessibility Requirements
- Minimum touch target size of 44x44px
- Color contrast ratio of 4.5:1 for normal text, 3:1 for large text
- Alternative text for all images
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators for interactive elements

## User Interaction States
- **Resting state**: Default appearance
- **Hover state**: Subtle highlight (desktop only)
- **Active/Pressed state**: Color change to indicate interaction
- **Focus state**: Clear outline or highlight
- **Disabled state**: Reduced opacity (0.5) and non-interactive
- **Loading state**: Appropriate loaders and progress indicators

## Animation and Transitions
- Page transitions: 300ms ease-in-out
- Button hover/press animations: 150ms
- Dialog entrance/exit: 250ms
- Loading spinners: Continuous rotation
- Keep animations subtle and purposeful
- Provide option to reduce motion for accessibility

## Mobile-First Optimizations
- Fast loading skeleton screens
- Lazy-loading images
- Offline-first architecture with service workers
- Touch-optimized sliders and inputs
- Bottom sheet dialogs instead of modals
- Pull-to-refresh for content updates
- Swipe actions for common operations

## Language Support
- UI should support both English and Hindi
- Text elements should accommodate variable text lengths
- Right-to-left (RTL) support for potential future languages
- Clear language selection during onboarding

## Dark Mode Support
- Complete dark mode theme following the same color principles
- Dark background: #121212
- Surface colors: #1E1E1E
- Proper text contrast in dark mode
- Smooth transition between light and dark modes

## Mockups and Prototypes
Key screens that require detailed mockups:
1. Onboarding flow
2. Login screens (OTP and credentials)
3. Shop Owner Dashboard
4. Salesman Dashboard
5. Inventory Management
6. Sales Entry
7. Sales Approval
8. Reports

## Design Deliverables
- Complete design system with components
- High-fidelity mockups for all core screens
- Interactive prototype for key user flows
- Asset export for development
- Responsive design specifications

## Design Tools
- Figma for UI design and prototyping
- Lottie for complex animations
- SVG for icons and illustrations

## Implementation Guidelines
- Use a component-based approach with React
- Implement responsive design using CSS Grid and Flexbox
- Follow Material Design or custom design system guidelines
- Ensure all UI elements are reusable and consistent
- Maintain proper documentation for component usage
- Implement CSS-in-JS using Styled Components or Emotion 
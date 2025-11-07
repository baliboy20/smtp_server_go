# Beta CRM - React Prototype

> **Version:** 1.0.0
> **Framework:** React 18+ with Material-UI v5
> **Status:** ✅ Ready for Prototyping

Interactive React prototype for Beta CRM - a Consultancy CRM System. Built from the comprehensive UX specification with pixel-perfect components and fully interactive screens.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Available Screens](#available-screens)
- [Component Library](#component-library)
- [Design System](#design-system)
- [Development](#development)
- [Deployment](#deployment)

## 🎯 Overview

This prototype implements the complete Beta CRM design system and user interface as specified in the UX documentation. It includes:

- **Fully responsive layouts** (optimized for desktop 1280px+, tablet 768px+)
- **Material-UI v5** component library with custom theming
- **Interactive prototypes** for all Phase 1 screens
- **Reusable components** ready for production
- **Mock data** for realistic demonstrations

## ✨ Features

### Implemented Screens

- ✅ **Login Page** - Full authentication UI with form validation
- ✅ **Dashboard** - Metrics cards, activity feed, pipeline overview
- ✅ **Client List** - Searchable grid with filtering
- ✅ **Client Detail** - Tabbed interface with overview, contacts, communications, documents
- ✅ **Add Client Modal** - Complete form with validation
- ✅ **Log Interaction Modal** - Communication logging interface

### Core Components

- Navigation (Sidebar + Top Bar)
- Cards (Client cards, Metric cards, Info cards)
- Badges (Status, Priority, Sentiment)
- Search with debounce
- Empty states
- Form inputs with validation
- Tabs
- Modals/Dialogs

### Design Features

- **Color System** - Primary (Indigo), Success (Green), Error (Red), Warning (Amber)
- **Typography** - Inter font family with responsive sizing
- **Spacing** - 4px base unit system
- **Icons** - Lucide React icon library
- **Animations** - Smooth transitions and hover effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Navigate to prototype directory
cd beta-crm-prototype

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Default Route

- Opens to `/dashboard` (redirects from `/`)
- Login screen available at `/login`

## 📁 Project Structure

```
beta-crm-prototype/
├── src/
│   ├── components/
│   │   ├── core/              # Reusable UI components
│   │   │   ├── Badge.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   └── index.js
│   │   ├── layout/            # Layout components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── index.js
│   │   └── modals/            # Modal dialogs
│   │       ├── AddClientModal.jsx
│   │       ├── LogInteractionModal.jsx
│   │       └── index.js
│   ├── pages/                 # Screen components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ClientList.jsx
│   │   └── ClientDetail.jsx
│   ├── theme/                 # Material-UI theme
│   │   └── theme.js
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🖥 Available Screens

### 1. Login (`/login`)

Professional authentication interface with:
- Email/password fields
- Remember me checkbox
- Forgot password link
- Form validation
- Loading states

**Demo credentials:** Any email/password (mock authentication)

### 2. Dashboard (`/dashboard`)

Central command center featuring:
- 4 metric cards (Revenue, Clients, Opportunities, Proposals)
- Pipeline chart placeholder
- Recent activity feed
- Upcoming deadlines list

### 3. Client List (`/clients`)

Grid of client cards with:
- Search functionality (debounced 300ms)
- Client cards showing:
  - Company name, industry, location
  - Status badge
  - Engagement score with progress bar
  - Revenue, contacts, opportunities metrics
  - Last contact timestamp
- Click card to navigate to detail view

### 4. Client Detail (`/clients/:id`)

Comprehensive client view with tabs:
- **Overview:** Key metrics and recent activity
- **Contacts:** List of client contacts with details
- **Communications:** Timeline of interactions with sentiment
- **Documents:** File management interface

Actions: Edit client, Delete client, Add contact, Log interaction, Upload document

### 5. Modals

#### Add Client Modal
- Company name, industry, company type (required)
- Location, website, fiscal year end (optional)
- Client-side validation
- Success feedback

#### Log Interaction Modal
- Type selector (Email, Call, Meeting, Other)
- Date/time, contact, subject (required)
- Notes, next steps, sentiment (optional)
- File attachment dropzone

## 🎨 Component Library

### Core Components

#### Badge
```jsx
import { Badge } from './components/core';

<Badge label="Active" variant="active" />
<Badge label="High Priority" variant="high" size="small" />
```

**Variants:** `active`, `inactive`, `pending`, `positive`, `neutral`, `negative`, `high`, `medium`, `low`, `primary`, `default`

#### SearchInput
```jsx
import { SearchInput } from './components/core';

<SearchInput
  placeholder="Search clients..."
  onSearch={(query) => console.log(query)}
  debounceMs={300}
/>
```

#### EmptyState
```jsx
import { EmptyState } from './components/core';

<EmptyState
  type="search"
  title="No clients found"
  description="Try adjusting your search"
  actionLabel="Add client"
  onAction={() => {}}
/>
```

### Layout Components

#### MainLayout
```jsx
import MainLayout from './components/layout/MainLayout';

<MainLayout title="Page Title" showSearch={true}>
  {/* Page content */}
</MainLayout>
```

Includes:
- Sidebar navigation (256px wide)
- Top bar (64px height)
- Main content area (max 1280px)

## 🎨 Design System

### Colors

```js
Primary:    #4F46E5 (Indigo 600)
Success:    #16A34A (Green 600)
Error:      #DC2626 (Red 600)
Warning:    #D97706 (Amber 600)

Text Primary:   #111827 (Gray 900)
Text Secondary: #4B5563 (Gray 600)
Background:     #F9FAFB (Gray 50)
Surface:        #FFFFFF (White)
```

### Typography

- **Font Family:** Inter, system-ui, sans-serif
- **Base Size:** 14px (0.875rem)
- **H1:** 32px, Bold
- **H2:** 24px, Bold (Page titles)
- **H3:** 20px, Semibold (Section titles)
- **Body:** 14px, Regular
- **Caption:** 12px, Regular

### Spacing

- **Base Unit:** 4px
- **Common Values:** 8px (2), 12px (3), 16px (4), 24px (6), 32px (8)

### Border Radius

- **Default:** 8px
- **Cards:** 12px
- **Buttons:** 8px

## 🛠 Development

### Available Scripts

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Customization

#### Theme Customization

Edit `src/theme/theme.js` to modify:
- Color palette
- Typography
- Component styles
- Breakpoints

#### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/layout/Sidebar.jsx`

#### Mock Data

Replace mock data arrays in page components with API calls:

```jsx
// Current (mock)
const clients = [...];

// Future (API)
const { data: clients } = useQuery(['clients'], fetchClients);
```

### State Management (Future)

Ready for integration with:
- **React Query** - Server state management
- **Context API** - Global app state
- **Local Storage** - User preferences

## 📦 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Deployment Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Static Hosting
Upload `dist/` folder to:
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages
- Any static hosting service

### Environment Variables

Create `.env` file for API configuration:

```env
VITE_API_URL=https://api.yourcrm.com
VITE_API_KEY=your_api_key
```

Access in code:
```js
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🎯 Next Steps

### Phase 2 Features (Planned)

- [ ] Contacts management screens
- [ ] Opportunities pipeline
- [ ] Proposals workflow
- [ ] Document viewer
- [ ] Settings page
- [ ] User profile management

### Backend Integration

1. Replace mock data with API calls
2. Implement authentication (JWT)
3. Add React Query for caching
4. Implement real-time updates (WebSockets)

### Enhancements

- [ ] Add data visualization (charts)
- [ ] Implement filters and advanced search
- [ ] Add keyboard shortcuts
- [ ] Implement drag & drop for file uploads
- [ ] Add notification system
- [ ] Mobile responsive design

## 📚 Documentation References

This prototype implements the specifications from:

- `prototype_ui.md` - UX specification (this document)
- `design_system.md` - Design tokens and system
- `component_specs.md` - Component specifications
- `wireframes/` - Screen wireframes
- `user_flows.md` - User flow documentation

## 🐛 Known Issues

- Modal file upload is UI-only (no actual upload)
- Charts are placeholders (awaiting charting library)
- Some routes are placeholders (Contacts, Opportunities, etc.)
- Mock authentication (no real auth backend)

## 🤝 Contributing

This is a prototype. For production use:

1. Replace all mock data with real API calls
2. Implement proper authentication
3. Add comprehensive error handling
4. Add unit tests (Jest + React Testing Library)
5. Add E2E tests (Cypress or Playwright)
6. Implement accessibility features (ARIA labels)
7. Optimize performance (code splitting, lazy loading)

## 📝 License

MIT License - Built as a prototype for Beta CRM

## 👨‍💻 Developed By

**robot_clara** (Clara - UX Designer)
Based on comprehensive UX specifications for Beta CRM v1.0

---

**Status:** ✅ Ready for Prototyping and User Testing

For questions or improvements, refer to the original UX specification document.

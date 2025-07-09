# 🐟 Fisher Control Frontend

A modern, well-organized React/Next.js frontend application for fish farm management.

## 🚀 Features

- **Modern Architecture**: Built with Next.js 15, React 18, and TypeScript
- **Component Library**: Reusable UI components with consistent design system
- **Form Management**: Advanced form handling with validation
- **API Integration**: Centralized API service with error handling
- **Authentication**: JWT-based authentication with context management
- **Notifications**: Toast notification system
- **Responsive Design**: Mobile-first responsive design
- **Theme System**: Centralized theme configuration
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging system

## 📁 Project Structure

```
fisher-control-front/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Button/      # Button component
│   │   ├── Input/       # Input component
│   │   └── NotificationToast/ # Notification component
│   └── ...              # Other components
├── contexts/            # React contexts
│   ├── authContext.tsx  # Authentication context
│   ├── notificationContext.tsx # Notification context
│   └── ...              # Other contexts
├── hooks/               # Custom React hooks
│   ├── useApi.ts        # API hook
│   ├── useForm.ts       # Form management hook
│   └── ...              # Other hooks
├── utils/               # Utility functions
│   ├── api.ts           # API service
│   ├── validation.ts    # Form validation
│   ├── theme.ts         # Theme configuration
│   └── ...              # Other utilities
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: CSS Modules + Bootstrap
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: JWT
- **Charts**: Recharts
- **State Management**: React Context + Hooks

## 🎨 Design System

The project uses a comprehensive design system with:

- **Color Palette**: Primary, secondary, success, warning, error, and info colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Components**: Reusable UI components with variants
- **Responsive**: Mobile-first responsive design

## 🔧 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fisher-control-front
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Key Components

### UI Components

- **Button**: Versatile button component with multiple variants
- **Input**: Form input with validation and error handling
- **NotificationToast**: Toast notification system

### Hooks

- **useApi**: Hook for API calls with loading and error states
- **useForm**: Form management with validation
- **useAuth**: Authentication state management

### Utilities

- **API Service**: Centralized API calls with interceptors
- **Validation**: Form validation system
- **Theme**: Design system configuration

## 🔐 Authentication

The application uses JWT-based authentication with:

- Automatic token refresh
- Protected routes
- User context management
- Secure token storage

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoint system
- Flexible layouts
- Touch-friendly interactions

## 🧪 Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

### Best Practices

- Component composition
- Custom hooks for logic reuse
- Context for state management
- Error boundaries
- Performance optimization

## 🚀 Deployment

### Build

```bash
npm run build
```

### Start Production

```bash
npm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team.

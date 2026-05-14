# Laundry Connect Frontend

A modern web application for managing laundry services, built with React, TypeScript, and Vite. This frontend connects to the LaundryBer backend API for authentication, user management, and laundry request handling.

## 🚀 Features

- Modern React with TypeScript
- Fast development with Vite
- Styled with Tailwind CSS
- Component library with Radix UI
- Responsive design
- Type-safe development
- **Backend API Integration** with JWT authentication
- Real-time error handling and user feedback
- Secure token management with localStorage

## 🛠️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Development Tools:**
  - ESLint
  - TypeScript
  - PostCSS
  - Autoprefixer

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

For production, update `.env.production`:
```env
VITE_API_BASE_URL=https://api.laundryber.com/api
```

4. Ensure the backend server is running:
```bash
# In the LaundryBer directory
cd ../LaundryBer
npm start
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔌 Backend Integration

This frontend application integrates with the LaundryBer backend API. Key integration features:

### Authentication
- JWT token-based authentication
- Automatic token injection in API requests
- Token persistence across page refreshes
- Automatic logout on 401 errors

### API Client
- Centralized axios-based HTTP client
- Request/response interceptors for auth and error handling
- Comprehensive error transformation with user-friendly messages
- 30-second request timeout
- Support for request cancellation

### Environment Configuration
The API base URL is configured through environment variables:
- **Development:** `http://localhost:3000/api` (default)
- **Production:** Set `VITE_API_BASE_URL` in `.env.production`

### Error Handling
The application handles various error scenarios:
- Network errors
- Timeout errors
- HTTP status codes (400, 401, 403, 404, 409, 500, 503)
- Backend validation errors

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ui/           # Radix UI components
│   ├── contexts/         # React contexts (Theme, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and helpers
│   │   └── api/          # API client and error handling
│   │       ├── auth.ts   # JWT token management
│   │       ├── client.ts # Axios HTTP client
│   │       └── errors.ts # Error transformation
│   ├── services/         # API service layer
│   │   └── laundryApi.ts # Backend API methods
│   ├── types/            # TypeScript type definitions
│   │   ├── api.ts        # API request/response types
│   │   └── app.ts        # Application types
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env.development      # Development environment config
├── .env.production       # Production environment config
└── [config files]        # Various configuration files
```

## 🚀 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables

## 🔐 Authentication Flow

1. User selects account type (Customer or Provider)
2. User logs in or registers with email and password
3. Backend returns JWT token and user data
4. Token is stored in localStorage
5. Token is automatically included in all subsequent API requests
6. On 401 error, user is logged out and redirected to login page

## 🌐 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Management
- `PATCH /api/users/profile` - Update user profile
- `PATCH /api/users/location` - Update user location
- `GET /api/users/nearby-providers` - Get nearby service providers

### Laundry Requests (Customer)
- `POST /api/requests` - Create new laundry request
- `GET /api/requests/customer` - Get customer's requests
- `PATCH /api/requests/:id/rate` - Rate completed request

### Laundry Requests (Provider)
- `GET /api/requests/provider` - Get provider's requests
- `GET /api/requests/pending` - Get pending requests
- `PATCH /api/requests/:id/accept` - Accept request
- `PATCH /api/requests/:id/decline` - Decline request
- `PATCH /api/requests/:id/status` - Update request status

## 🐛 Troubleshooting

### Backend Connection Issues
If you see "Network error" messages:
1. Ensure the backend server is running on port 3000
2. Check that `VITE_API_BASE_URL` is correctly set
3. Verify CORS is enabled on the backend

### Authentication Issues
If you're automatically logged out:
1. Check browser console for 401 errors
2. Verify JWT token is valid (check localStorage)
3. Ensure backend JWT_SECRET is configured

### Build Issues
If TypeScript compilation fails:
1. Run `npm install` to ensure all dependencies are installed
2. Check for type errors with `npm run build`
3. Verify all imports are correct

## 📝 Development Notes

- The application uses localStorage for JWT token persistence
- All API calls are type-safe with TypeScript interfaces
- Error messages are user-friendly and actionable
- The UI automatically handles loading states during API calls
- Request cancellation is implemented to prevent memory leaks

## 📝 License


## 👥 Contributing



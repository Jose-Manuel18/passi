# Passi - Task Management App

A full-stack task management application built with React Native (Expo) frontend and NestJS backend.

## 🚀 Features

- **Authentication**: JWT-based login/register system
- **Task Management**: Create, read, update, delete tasks
- **Real-time Synchronization**: TanStack Query with automatic cache invalidation for instant updates
- **Collaborative Tasks**: Shared task lists with real-time updates across users
- **Theme Support**: Light/dark mode with system preference
- **Offline Persistence**: Zustand with AsyncStorage
- **Modern UI**: Animated components with React Native Reanimated
- **Error Handling**: Comprehensive error handling with connection failure recovery

## 📱 Tech Stack

### Frontend

- **React Native** with Expo
- **TypeScript**
- **TanStack Query** for real-time data fetching and cache management
- **Zustand** for state management with persistence
- **React Hook Form** with Zod validation
- **React Native Reanimated** for animations

### Backend

- **NestJS** framework
- **PostgreSQL** database
- **Prisma** ORM
- **JWT** authentication
- **Swagger** API documentation

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm/yarn
- **Docker** and Docker Compose
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development) or **Android Studio** (for Android development)

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd passi
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
bun install
# or
npm install
```

Create environment file:

```bash
cp .env.example .env.local
```

Configure your `.env.local`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/passi?schema=public
JWT_SECRET=your-super-secret-jwt-key
PORT=4001
```

Start the database:

```bash
bun run db:start
# or
npm run db:start
```

Run database migrations:

```bash
bun run prisma:generate
bun run prisma:migrate
```

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The backend will be available at `http://localhost:4001`
API documentation: `http://localhost:4001/api`

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
bun install
# or
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Configure your `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4001
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend** (in `backend/` directory):

```bash
bun run dev
```

2. **Start Frontend** (in `frontend/` directory):

```bash
bun start
```

3. **Run on Device/Simulator**:
   - Scan QR code with Expo Go app
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

### Development Build (Required for Native Features)

Since this app uses native modules, you need to create a local development build:

1. **Install Dependencies** (in `frontend/` directory):

```bash
bun install
```

2. **Create Local Development Build**:

For iOS:

```bash
bun run ios
```

For Android:

```bash
bun run android
```

3. **Start Development Server**:

```bash
bun start
```

The app will automatically open in the iOS Simulator or Android Emulator. If you don't have them installed:

**iOS Simulator** (macOS only):

- Install Xcode from App Store
- Open iOS Simulator: `open -a Simulator`

**Android Emulator**:

- Install Android Studio
- Create and start an Android Virtual Device (AVD)

### Alternative: Expo Go (Limited Features)

For quick testing without native modules:

```bash
bun start
# Then scan QR code with Expo Go app
```

**Note**: Some features may not work in Expo Go due to native module dependencies.

### Production Build

**Backend:**

```bash
cd backend
bun run build
bun run start:prod
```

**Frontend:**

```bash
cd frontend
bun run build
```

## 📋 Available Scripts

### Backend Scripts

- `bun run dev` - Start development server with database
- `bun run start:dev` - Start development server only
- `bun run build` - Build for production
- `bun run start:prod` - Start production server
- `bun run db:start` - Start PostgreSQL database
- `bun run db:stop` - Stop PostgreSQL database
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:migrate` - Run database migrations
- `bun run prisma:studio` - Open Prisma Studio

### Frontend Scripts

- `bun start` - Start Expo development server
- `bun run ios` - Run on iOS Simulator
- `bun run android` - Run on Android Emulator
- `bun run web` - Run on web browser

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Tasks (Protected)

- `GET /tasks` - Get all tasks for current user
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Users (Protected)

- `GET /findAll` - Get all users
- `GET /findOne/:id` - Get specific user
- `PUT /update/:id` - Update user

## 🗄️ Database Schema

### Users

- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Tasks

- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `completed` (Boolean, Default: false)
- `userId` (UUID, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## 🔄 Real-time Synchronization

### TanStack Query Implementation

The app uses TanStack Query for real-time synchronization through:

1. **Automatic Cache Invalidation**: When tasks are created, updated, or deleted, the cache is automatically invalidated
2. **Background Refetching**: Queries automatically refetch when the app regains focus
3. **Optimistic Updates**: UI updates immediately while API calls are in progress
4. **Error Recovery**: Failed requests are automatically retried

### Real-time Update Flow

```typescript
// When a task is created
const { mutateAsync: createTask } = useCreateTaskMutation();

// On success, TanStack Query automatically:
// 1. Invalidates the tasks cache
// 2. Refetches the tasks list
// 3. Updates all components displaying tasks
```

### Collaborative Features

- **User-specific Tasks**: Each user sees only their own tasks
- **Real-time Updates**: Changes are reflected immediately across all connected clients
- **Offline Support**: Tasks are cached locally and sync when connection is restored

## 🔐 Authentication

The app uses JWT tokens for authentication. Tokens are automatically:

- Stored in AsyncStorage on login
- Attached to API requests
- Cleared on logout or token expiration
- Refreshed automatically when needed

## 🎨 Theming

The app supports:

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes
- **System Mode**: Follows device preference

## 📱 App Structure

```
frontend/
├── src/
│   ├── app/                 # Expo Router screens
│   │   ├── auth/           # Authentication screens
│   │   └── (app)/          # Main app screens
│   ├── components/          # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API client
│   ├── services/           # API service functions
│   └── stores/             # Zustand stores
```

## 🔧 Technical Decisions

### Why TanStack Query?

1. **Real-time Sync**: Automatic cache invalidation provides instant updates
2. **Offline Support**: Built-in caching with background sync
3. **Error Handling**: Automatic retry logic and error recovery
4. **Performance**: Optimistic updates and background refetching
5. **Developer Experience**: Simple API with powerful features

### State Management Strategy

1. **Zustand for Auth**: Lightweight, persistent auth state
2. **TanStack Query for Data**: Server state management with caching
3. **React Hook Form**: Form state management with validation

### Real-time Sync Approach

1. **Cache Invalidation**: Immediate UI updates through cache invalidation
2. **Background Refetching**: Automatic data refresh when app regains focus
3. **Optimistic Updates**: UI responds immediately to user actions
4. **Error Recovery**: Automatic retry with exponential backoff

## 🚨 Error Handling

### Connection Failure Recovery

The app handles various error scenarios:

1. **Network Errors**:

   - Automatic retry with exponential backoff
   - Offline mode with cached data
   - User-friendly error messages

2. **Authentication Errors**:

   - Automatic token refresh
   - Redirect to login on token expiration
   - Clear local data on auth failure

3. **API Errors**:
   - Graceful degradation
   - Retry mechanisms
   - Error boundaries for component-level recovery

### Error Handling Implementation

```typescript
// API client with error handling
export async function apiFetch<TResponse>(path: string, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Handle 401 errors (token expired)
      if (response.status === 401) {
        clearUser();
        throw new Error("Session expired");
      }

      throw new Error(payload?.error?.message || "Request failed");
    }

    return payload.data;
  } catch (error) {
    // Log error for debugging
    console.error("API Error:", error);
    throw error;
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Ensure Docker is running
   - Run `bun run db:start` in backend directory
   - Check DATABASE_URL in `.env.local`

2. **Frontend Can't Connect to Backend**:

   - Verify backend is running on port 4001
   - Check `EXPO_PUBLIC_API_URL` in frontend `.env`
   - Ensure no firewall blocking localhost

3. **Development Build Issues**:

   - Clear cache: `bun start --clear`
   - Reset Metro: `bun start --reset-cache`
   - For iOS: Ensure Xcode is installed and iOS Simulator is available
   - For Android: Ensure Android Studio is installed and AVD is created

4. **Prisma Issues**:

   - Regenerate client: `bun run prisma:generate`
   - Reset database: `bun run prisma:migrate:reset`

5. **Real-time Sync Not Working**:
   - Check network connectivity
   - Verify API endpoints are responding
   - Clear TanStack Query cache if needed

### Local Build Troubleshooting

1. **iOS Build Fails**:

   - Install Xcode from App Store
   - Open iOS Simulator: `open -a Simulator`
   - Run `bun run ios` again

2. **Android Build Fails**:

   - Install Android Studio
   - Create Android Virtual Device (AVD)
   - Run `bun run android` again

3. **App Won't Connect to Development Server**:
   - Ensure backend is running on port 4001
   - Check device/simulator network settings
   - Verify backend is accessible from device

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.

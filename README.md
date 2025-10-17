# Task Management Dashboard

A full-stack web application built with Laravel (Backend) and React (Frontend) for managing personal tasks with user authentication.

## Features

### Backend (Laravel API)
- ✅ User authentication using Laravel Sanctum
- ✅ User registration, login, and logout
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ User-specific task isolation (users can only access their own tasks)
- ✅ Form Request validation
- ✅ Eloquent API Resources
- ✅ Task search functionality
- ✅ Task filtering by status
- ✅ CORS configuration for React frontend
- ✅ Database migrations

### Frontend (React + React Query)
- ✅ Modern React application with Vite
- ✅ React Query for data fetching and caching
- ✅ User authentication pages (Login/Register)
- ✅ Task management interface
- ✅ Real-time task updates
- ✅ Task filtering and search
- ✅ Responsive design with Tailwind CSS
- ✅ Loading and error states
- ✅ Optimistic updates for better UX

## Tech Stack

### Backend
- **Laravel 10** - PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL** - Database
- **Eloquent ORM** - Database operations

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
sooAndCarrots/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   └── Http/Resources/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   └── config/
└── frontend/               # React Application
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── services/
    └── public/
```

## Installation & Setup

### Prerequisites
- PHP 8.1 or higher. (My PHP version is 8.3)
- Composer
- Node.js 16 or higher
- MySQL 5.7 or higher

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Environment setup:**
   ```bash
   cp env.example .env
   ```

4. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=task_management
   DB_USERNAME=root
   DB_PASSWORD=My password
   ```

5. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Start the server:**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires authentication)
- `GET /api/me` - Get current user (requires authentication)

### Tasks
- `GET /api/tasks` - Get all user tasks (requires authentication)
- `POST /api/tasks` - Create new task (requires authentication)
- `GET /api/tasks/{id}` - Get specific task (requires authentication)
- `PUT /api/tasks/{id}` - Update task (requires authentication)
- `DELETE /api/tasks/{id}` - Delete task (requires authentication)

### Query Parameters for Tasks
- `search` - Search tasks by title
- `status` - Filter tasks by status (pending, in_progress, completed)

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Create tasks** with title, description, and status
3. **View all your tasks** in the dashboard
4. **Filter tasks** by status or search by title
5. **Edit or delete tasks** as needed
6. **Logout** when finished

## Features in Detail

### User Authentication
- Secure user registration and login
- JWT token-based authentication using Laravel Sanctum
- Automatic token refresh and logout on expiration
- Protected routes and API endpoints

### Task Management
- Create tasks with title, description, and status
- Three task statuses: Pending, In Progress, Completed
- Real-time updates using React Query
- Optimistic updates for better user experience
- Search functionality across task titles
- Filter tasks by status

### UI/UX Features
- Responsive design that works on all devices
- Modern, clean interface with Tailwind CSS
- Loading states and error handling
- Intuitive task management workflow
- Real-time feedback for all operations

## Development

### Backend Development
- Follow Laravel best practices
- Use Form Requests for validation
- Implement proper error handling
- Write comprehensive API documentation

### Frontend Development
- Use React Query for all data fetching
- Implement proper error boundaries
- Follow React best practices
- Ensure responsive design
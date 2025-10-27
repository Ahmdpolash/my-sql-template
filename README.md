# Fresh Backend Core

A modular Node.js backend with TypeScript, Express, and Prisma - Core functionality only.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER, ADMIN, SUPER_ADMIN)
- **User Management**: Complete user registration, login, profile management
- **Database Management**: PostgreSQL with Prisma ORM for type-safe database operations
- **Error Handling**: Comprehensive error handling with custom error classes and validation
- **Security**: Password hashing with bcrypt, JWT tokens, request validation, and CORS configuration
- **Super Admin Seeding**: Automatic super admin creation on application startup
- **Modular Architecture**: Clean, scalable, and maintainable code structure

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod for request validation
- **Development**: ts-node-dev, ESLint

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd fresh-backend-core
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   HOST=localhost
   DATABASE_URL="postgresql://username:password@localhost:5432/fresh_backend_db"

   JWT_ACCESS_SECRET=your-super-secret-access-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key

   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=your-secure-password

   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Start the application (creates super admin automatically)
   npm run dev
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Using Docker

```bash
docker-compose up -d
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── app/
│   ├── config/           # Configuration files
│   ├── errors/           # Error handling utilities
│   ├── helpers/          # Helper functions (password, JWT)
│   ├── interface/        # TypeScript interfaces
│   ├── middlewares/      # Express middlewares
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication module
│   │   └── user/         # User management
│   ├── routes/           # Route definitions
│   └── utils/            # Utility functions
├── prisma/               # Database schema and migrations
└── views/                # View templates (if needed)
```

## 🔗 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `PUT /api/v1/auth/change-password` - Change password (authenticated users)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/refresh-token` - Refresh JWT token

### Users

- `GET /api/v1/users` - Get all users (Admin/Super Admin only)
- `GET /api/v1/users/:userId` - Get user by ID (Admin/Super Admin only)
- `PATCH /api/v1/users/:userId` - Update user profile
- `DELETE /api/v1/users/:userId` - Delete user (Admin/Super Admin only)
- `PATCH /api/v1/users/:userId/role` - Update user role (Super Admin only)

## 🗃️ Database Schema

### User Model

- User authentication and profile information with UUID primary key
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- Password reset functionality
- Profile picture support

## 🔒 Authentication & Authorization

The API uses JWT-based authentication with robust security measures:

### **Token Security**

- **Dual Token System**: Separate access and refresh tokens with different secret keys
- **Token Expiration**:
  - Access tokens: 1 hour (configurable)
  - Refresh tokens: 7 days (configurable)
- **Token Validation**: Secure token verification on every protected route

### **Role-Based Access Control**

- **USER**: Regular users with basic access to personal data
- **ADMIN**: Administrative users with extended permissions for user management
- **SUPER_ADMIN**: Full system access including all administrative functions

### **Authentication Flow**

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing the API

### Register a new user

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get current user (requires authentication)

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🐳 Docker Deployment

1. **Build and run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **View logs**

   ```bash
   docker-compose logs -f app
   ```

3. **Stop services**

   ```bash
   docker-compose down
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue on GitHub.

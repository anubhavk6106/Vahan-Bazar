# Vahan Bazar Backend API

Backend API for Vahan Bazar - Two Wheeler Marketplace built with Express.js

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth system
- **Vehicle Management**: CRUD operations for vehicles
- **User Management**: User registration, login, profile management  
- **Search & Filtering**: Advanced vehicle search and filtering
- **Security**: Helmet, CORS, Rate limiting
- **Error Handling**: Comprehensive error handling middleware
- **Logging**: Morgan logging for development and production

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key-here
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📖 API Endpoints

### Health Check
- `GET /health` - Check server health

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user  
- `GET /api/v1/auth/me` - Get current user (Protected)

### Vehicles
- `GET /api/v1/vehicles` - Get all vehicles (with filtering & pagination)
- `GET /api/v1/vehicles/:id` - Get single vehicle
- `GET /api/v1/vehicles/meta/brands` - Get vehicle brands
- `GET /api/v1/vehicles/meta/categories` - Get vehicle categories

### Users
- `GET /api/v1/users/profile` - Get user profile (Protected)
- `PUT /api/v1/users/profile` - Update user profile (Protected)

## 🔍 API Usage Examples

### Get All Vehicles with Filtering
```bash
GET /api/v1/vehicles?category=bikes&brand=Honda&page=1&limit=10
```

### Register a New User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Protected Route (with JWT Token)
```bash
GET /api/v1/users/profile
Authorization: Bearer your-jwt-token-here
```

## 📁 Project Structure

```
vahan-bazar-backend/
├── src/
│   └── server.js          # Main server file
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User routes  
│   └── vehicles.js       # Vehicle routes
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling middleware
│   └── notFound.js       # 404 middleware
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
└── package.json         # Project dependencies
```

## 🛠️ Built With

- **Express.js** - Web framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logging
- **compression** - Response compression
- **express-rate-limit** - Rate limiting

## 🚀 Deployment

The API is ready for deployment to platforms like:
- Heroku
- Railway
- Vercel
- DigitalOcean
- AWS

Make sure to set environment variables in your deployment platform.

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
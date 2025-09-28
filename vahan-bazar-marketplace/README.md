# Vahan Bazar - Two Wheeler Marketplace

A modern web application for browsing, comparing, and purchasing two-wheelers including bikes, scooters, and electric vehicles.

## Features

- 🚲 Browse bikes, scooters, and EVs
- 🔍 Search and filter by brand, price, fuel type
- 📊 Compare vehicles side by side
- 🧮 EMI and fuel cost calculators
- 🏪 Explore showrooms and dealerships
- 📝 Book test rides
- 🔐 User authentication and profiles
- 💰 Sell used vehicles

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Lucide React (icons)
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs for password hashing
- CORS, Helmet, Morgan middleware

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vahan-bazar-marketplace
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd ../vahan-bazar-backend
npm install
```

4. Set up environment variables
```bash
# In backend directory
cp .env.example .env
# Edit .env with your configuration
```

5. Start development servers
```bash
# Backend (from vahan-bazar-backend directory)
npm run dev

# Frontend (from vahan-bazar-marketplace directory)
npm run dev
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Project Structure

```
vahan-bazar-marketplace/
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── data/          # Static data
│   ├── pages/         # Page components
│   └── services/      # API services
├── public/            # Static assets
└── ...

vahan-bazar-backend/
├── src/
│   └── server.js      # Main server file
├── routes/            # API routes
├── middleware/        # Express middleware
└── ...
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/vehicles` - Get vehicles with filtering
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

## License

MIT

# Rest Countries Explorer App

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,materialui&perline=14" />
  </a>
</p>

A full-stack web application that allows users to explore countries around the world, search and filter by various criteria, view detailed information, and save their favorite countries. Built as part of the SE3040 Application Frameworks course assignment at SLIIT.

## Live Demo

**[View Live Demo](https://rest-countries-app-new.vercel.app)**

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Features

### Frontend
- ✅ Browse all countries with essential information (flag, name, population, region, capital)
- ✅ Search countries by name
- ✅ Filter countries by region and language
- ✅ View detailed information about each country including:
  - Native name
  - Population
  - Region and subregion
  - Capital
  - Top-level domain
  - Currencies
  - Languages
  - Border countries
- ✅ Responsive design that works on all devices
- ✅ Modern UI with Material-UI and Tailwind CSS
- ✅ Image slider showcasing featured countries on home page

### Backend
- ✅ User authentication (register, login, logout)
- ✅ JWT-based authentication with secure HTTP-only cookies
- ✅ Save favorite countries to your account
- ✅ Manage your favorite countries list
- ✅ RESTful API endpoints for user management and favorites

## Tech Stack

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Material-UI (MUI)** - React UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing for React applications
- **Axios** - HTTP client for making API requests
- **Context API** - State management
- **Vite** - Next generation frontend tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication using JSON Web Tokens
- **bcryptjs** - Password hashing

## Project Structure

```
rest-countries-app/
├── backend/                      # Backend server code
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # MongoDB models
│   │   └── User.js               # User model
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication routes
│   │   └── favorites.js          # Favorites management routes
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server setup
│
├── frontend/                     # React frontend code
│   ├── public/                   # Static files
│   ├── src/                      # Source code
│   │   ├── _mocks_/              # Mock data for testing
│   │   ├── _tests_/              # Test files
│   │   ├── assets/               # Static assets like images
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # React context providers
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service layers
│   │   ├── App.css               # App styles
│   │   ├── App.jsx               # Main App component
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── .gitignore                # Git ignore file
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   └── vite.config.js            # Vite configuration
│
└── README.md                     # Project documentation
```

## API Integration

### External API
The application uses the following endpoints from the REST Countries API:
- `GET /all` - Get all countries
- `GET /name/{name}` - Search country by name
- `GET /region/{region}` - Get countries by region
- `GET /alpha/{code}` - Get country by code

### Backend API
The following custom API endpoints are provided:

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current authenticated user

#### Favorites
- `GET /api/favorites` - Get all favorite countries for current user
- `POST /api/favorites/add` - Add a country to favorites
- `POST /api/favorites/remove` - Remove a country from favorites

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- pnpm (v7 or higher)
- MongoDB

### Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/Eshan-Nayanapriya/Rest-Countries-App.git
cd rest-countries-app
```

2. Install backend dependencies:
```bash
cd backend
pnpm i
```

3. Install frontend dependencies:
```bash
cd frontend
pnpm i
```

## Running the Application

### Backend Server
```bash
cd backend
pnpm start
```

When running successfully, you should see:
```
MongoDB connected
🚀 Server is running on port 5000
```

### Frontend Development Server
```bash
cd frontend
pnpm run dev
```

When running successfully, you should see the Vite development server URL (typically http://localhost:5173)

## Testing

### Frontend Tests
```bash
cd frontend
pnpm test          # Run all tests
```

The project includes:
- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for API services
- Test mocks for API responses

## Deployment

The application is deployed on Vercel:

- Main URL: [rest-countries-app-new.vercel.app](https://rest-countries-app-new.vercel.app)

### Deployment Process
1. Frontend is deployed to Vercel
2. Backend is deployed to Vercel
3. Environment variables are configured in the deployment platform

## Features in Detail

### Home Page
- Country list with search and filter functionality
- Image slider showing featured countries
- Responsive grid layout for optimal viewing on all devices

### Country Detail Page
- Comprehensive information about each country
- Border countries navigation for seamless exploration
- Add/remove from favorites functionality for authenticated users

### Favorites Page
- View all your favorite countries in one place
- Remove countries from favorites with a single click
- Login required to access this feature

### User Authentication
- Secure sign up and login process
- JWT authentication with HTTP-only cookies
- Protected routes for authenticated users only
- 
## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing the country data
- [Material-UI](https://mui.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the backend framework
- SLIIT SE3040 Application Frameworks course for the assignment specification

# Express.js Server with JWT Authentication

This is a dummy server implementation with JWT authentication and product/user management APIs.

## Setup

1. Create a `.env` file in the server root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users` - Get all users (Admin only)
- `PUT /api/v1/users/update-status/:id` - Update user status (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Products
- `POST /api/v1/products` - Create new product
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `PUT /api/v1/products/:id/status` - Update product status (Admin only)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: your_jwt_token
```

## User Roles
- **User**: Can create, read, update, and delete their own products
- **Admin**: Has full access to all endpoints, including user management

## Query Parameters

### Products
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `name`: Search by product name

### Users
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `name`: Search by user name

# Chat Application Backend

## Overview
A Node.js backend for a real-time chat application that enables communication between users with specific roles (players and fans). Built with Express, Socket.IO, and MongoDB, featuring JWT authentication and role-based chat restrictions.

## Key Features
- Role-based user authentication (Player/Fan)
- Real-time messaging via Socket.IO
- Historical message storage and retrieval
- Online status tracking
- Strict player ↔ fan chat enforcement

## API Documentation

### Authentication

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "player" | "fan"
}
```

**Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### `POST /api/auth/login`
Authenticate a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as register endpoint.

### Users

#### `GET /api/users/opposite-role`
Get users of opposite role (players see fans, fans see players).

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isOnline": "boolean"
  }
]
```

### Chat

#### `GET /api/chat/:receiverId`
Get conversation history with a user.

**Headers:**
```
Authorization: Bearer JWT_TOKEN
```

**Response:**
```json
[
  {
    "_id": "string",
    "senderId": "string",
    "receiverId": "string",
    "message": "string",
    "createdAt": "ISO_DATE"
  }
]
```

## Socket.IO Events

### Connection
- Requires valid JWT token
- Automatically marks user as online

### `sendMessage`
Send a new message using Socket.io in Postman

**Data:**
```json
{
  "receiverId": "string",
  "message": "string"
}
```

### `receiveMessage`
Receive a new message in real-time.

**Data:** Same as chat message object

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your_secure_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Testing
Run the included test script, useful for testing the sending and receiving of messages.
```bash
node scripts/socketTest.js
```

## Database Schema

### Users
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'player' or 'fan'
  isOnline: Boolean
}
```

### Chat Messages
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  createdAt: Date
}
```

## Error Handling
All errors return consistent JSON responses:
```json
{
  "message": "Error description"
}
```

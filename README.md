# Node.js Todo API - Learning Project

 Node.js REST API built for learning backend development fundamentals using Node. This project demonstrates core concepts including Express.js, middleware, routing, data validation, and proper API design patterns.

## 🎯 Learning Objectives

By building this project step-by-step, you'll learn:

- **Express.js fundamentals** - Creating servers, routing, middleware
- **RESTful API design** - HTTP methods, status codes, consistent responses
- **Request handling** - Body parsing, URL parameters, validation
- **Error handling** - Proper status codes and error messages

## 🚀 What We've Built So Far

### Current Features ✅
- ✅ Basic Express server setup
- ✅ Essential middleware (JSON parsing, logging)
- ✅ GET `/` - Welcome route with API documentation
- ✅ GET `/todos` - Retrieve all todos
- ✅ POST `/todos` - Create new todos with validation
- ✅ GET `/todos/:id` - Retrieve specific todo by ID
- ✅ In-memory data storage
- ✅ Input validation and error handling
- ✅ Consistent API response format

### Planned Features 🔄
- 🔄 PUT `/todos/:id` - Update existing todos
- 🔄 DELETE `/todos/:id` - Delete todos
- 🔄 File persistence (save/load from JSON file)
- 🔄 Advanced validation middleware
- 🔄 Query filtering and sorting
- 🔄 Statistics endpoint

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **curl** or **Postman** (for testing API endpoints)

## 🛠️ Setup Instructions

### 1. Clone and Setup
```bash
# Create project directory
mkdir nodejs-todo-learning
cd nodejs-todo-learning

# Initialize git repository
git init

# Create package.json and server.js files (copy from the artifacts)
# Then install dependencies
npm install
```

### 2. Run the Application
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### 3. Test the API
The server runs on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Welcome Route
```http
GET /
```
**Response:**
```json
{
  "message": "Welcome to Todo API!",
  "status": "Server is running",
  "timestamp": "2025-07-17T10:30:00.000Z",
  "availableEndpoints": [
    "GET / - This welcome message",
    "GET /todos - Get all todos",
    "POST /todos - Create a new todo",
    "GET /todos/:id - Get a specific todo"
  ]
}
```

#### 2. Get All Todos
```http
GET /todos
```
**Response:**
```json
{
  "success": true,
  "message": "Todos retrieved successfully",
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Learn Node.js",
      "description": "Build a todo app step by step",
      "completed": false,
      "createdAt": "2025-07-17T10:30:00.000Z",
      "updatedAt": "2025-07-17T10:30:00.000Z"
    }
  ]
}
```

#### 3. Create New Todo
```http
POST /todos
Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "Learn Express.js",
  "description": "Master middleware and routing"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "id": 2,
    "title": "Learn Express.js",
    "description": "Master middleware and routing",
    "completed": false,
    "createdAt": "2025-07-17T10:35:00.000Z",
    "updatedAt": "2025-07-17T10:35:00.000Z"
  }
}
```

**Validation Errors (400 Bad Request):**
```json
{
  "success": false,
  "message": "Title is required and cannot be empty"
}
```

#### 4. Get Specific Todo
```http
GET /todos/:id
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Build a todo app step by step",
    "completed": false,
    "createdAt": "2025-07-17T10:30:00.000Z",
    "updatedAt": "2025-07-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Invalid ID (400 Bad Request)
{
  "success": false,
  "message": "Invalid todo ID. ID must be a number."
}

// Todo not found (404 Not Found)
{
  "success": false,
  "message": "Todo with ID 999 not found"
}
```

## 🧪 Testing Examples

### Using curl
```bash
# Get all todos
curl http://localhost:3000/todos

# Create a new todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "description": "Build APIs with Express"}'

# Get specific todo
curl http://localhost:3000/todos/1

# Test validation error
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"description": "Missing title"}'
```

### Using JavaScript fetch
```javascript
// Create a todo
const response = await fetch('http://localhost:3000/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Learn Node.js',
    description: 'Build a REST API'
  })
});

const result = await response.json();
console.log(result);
```

### 1. Express.js Fundamentals
- Creating Express applications
- Defining routes with different HTTP methods
- Using middleware for request processing
- Handling request and response objects

### 2. RESTful API Design
- **GET** for retrieving data
- **POST** for creating new resources
- Consistent response formats
- Proper HTTP status codes

### 3. Middleware Pattern
```javascript
// Middleware runs in order for every request
app.use(express.json());           // Parse JSON bodies
app.use(customLoggingMiddleware);  // Log requests
app.get('/todos', handler);        // Route handler
```

### 4. Data Validation
```javascript
// Always validate user input
if (!title || title.trim().length === 0) {
  return res.status(400).json({
    success: false,
    message: 'Title is required and cannot be empty'
  });
}
```

### 5. Error Handling
- **400** - Bad Request (validation errors)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (server problems)
- Always return consistent error format

## 📁 Project Structure
```
nodejs-todo/
├── package.json          # Project configuration and dependencies
├── server.js             # Main application file
├── README.md             # Project documentation
└── node_modules/         # Installed dependencies
```
